# Membership / Entitlement Sync Bug Fix Handover

**Handover date:** 15-09-2026
**Bug:** Membership badge reset to "The Owner" after logout/login despite an active RevenueCat purchase
**Frontend:** Expo React Native (`wspread-app`)
**Backend:** Express.js + TypeScript + Prisma on Vercel (`wspread-be`)
**Database:** PostgreSQL/Supabase

## 1. Root cause

There were two sources of truth for membership status that could disagree:

1. **Client-side (accurate, immediate):** `wspread-app/services/revenueCat.js` reads the RevenueCat SDK's live `CustomerInfo.entitlements.active` right after a purchase.
2. **Backend-side (can be stale/empty):** `GET /api/v1/memberships/me` (`wspread-be/src/services/membership.service.ts` → `getUserMembership`) reads only from the `MembershipSubscription` table, which was populated only by the async RevenueCat webhook.

On every login, `wspread-app/App.js` → `handleLoginSuccess` called `refreshMembership()`, which unconditionally overwrote the tier/role state with the backend's response. If the webhook hadn't landed yet (delivery delay, misconfigured secret/URL, or a sandbox test event that fell through `statusMap`), the backend had no active row, `membership.tier` was `null`, and that `null` wiped out the correct, already-verified entitlement state from the RevenueCat SDK.

Per RevenueCat's docs, `CustomerInfo` from the SDK is the source of truth for what a user is currently entitled to on their device: https://www.revenuecat.com/docs/getting-started/entitlements

## 2. What changed

### Frontend (`wspread-app`)

- **`App.js` → `refreshMembership`**: now fetches the live RevenueCat `CustomerInfo` (`Purchases.getCustomerInfo()`) in parallel with `getMyMembership()`. The tiers are ranked (`enterprise` > `business` > none) and the higher-ranked tier wins — a live SDK entitlement can no longer be overwritten by a `null`/lower tier from the backend. The backend's `role`/`validDays`/`totalDays`/`expiresAt` are only used for display metadata once the backend agrees with (or exceeds) the live tier. The existing retry loop (up to 3 retries, 2s apart) is preserved, but it now only retries when **neither** source has a tier, instead of retrying purely on the backend's tier being empty.
- **`services/revenueCat.js`**: added `buildMembershipSyncSnapshot(customerInfo)`, which extracts the active entitlement's product identifier, expiration, renewal, store, and sandbox flag from `CustomerInfo` into the shape the new backend `/memberships/sync` endpoint expects.
- **`services/api.js`**: added `syncMembership(snapshot)`, a thin wrapper around `POST /memberships/sync` following the existing `request()`/`payload.data` convention.
- **`screens/MembershipScreen.js` → `handleSelectPlan` / `handleRestorePurchases`**: after a successful purchase or restore, the client now calls `syncMembership(buildMembershipSyncSnapshot(customerInfo))` to push the entitlement to the backend immediately. This is best-effort and wrapped in its own try/catch — a sync failure does not block the UI, since the SDK-verified entitlement already drives the badge via `onSubscriptionChanged`/`onMembershipUpgraded`.

### Backend (`wspread-be`)

- **New endpoint: `POST /api/v1/memberships/sync`** (`requireAuth` protected)
  - Route: `src/routes/membership.routes.ts`
  - Controller: `MembershipController.sync` in `src/controllers/membership.controller.ts`
  - Service: `MembershipService.syncFromClient` in `src/services/membership.service.ts`
  - **Request body:**
    ```json
    {
      "appUserId": "string | undefined",
      "productIdentifier": "string",
      "entitlementIdentifier": "string | null",
      "purchasedAtMs": "number | null",
      "expiresAtMs": "number | null",
      "willRenew": "boolean | null",
      "store": "string | null",
      "isSandbox": "boolean | null",
      "originalTransactionId": "string | null",
      "transactionId": "string | null"
    }
    ```
    Either `productIdentifier` or `entitlementIdentifier` is required.
  - **Response:** identical shape to `GET /memberships/me` (`{ tier, role, status, validDays, totalDays, expiresAt, autoRenewing }`), so the frontend can reuse one parser for both.
  - **Trust model:** this data is client-submitted and is **not** treated as authoritative for billing. It's a fast local cache write (`status` is force-set to `ACTIVE`), upserted on the same key (`userId_productIdentifier`) the webhook uses. The webhook remains the durable/reconciling source of truth and will freely overwrite this row on its next delivery — there is no conflict because both paths write through the same shared `upsertSubscription` helper.
- **Webhook logging** (`MembershipController.revenueCatWebhook` and `MembershipService.processRevenueCatEvent`): added structured `console.log`/`console.warn` calls covering: event id, event type, `app_user_id`, whether the Authorization header was present/valid, whether a matching user was found, and whether the event type was unmapped (falling back to `INCOMPLETE`). This makes future delivery failures (bad secret, no matching user, unmapped event type) visible in Vercel logs instead of silent.
- **`statusMap` coverage**: added `TEST` (dashboard/sandbox test events), `SUBSCRIPTION_EXTENDED`, `REFUND_REVERSED`, and `TEMPORARY_ENTITLEMENT_GRANT` to the RevenueCat event type → `MembershipStatus` map, per RevenueCat's event type reference (https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields). Previously, a sandbox `TEST` event mapped to `INCOMPLETE`, which is excluded by `ACTIVE_STATUSES`, so a test webhook never surfaced as an active subscription.
- **`store` field**: `processRevenueCatEvent` and `syncFromClient` now populate `MembershipSubscription.store` via a new `mapStore()` helper (previously always left at the schema default `UNKNOWN`).
- **Shared upsert logic**: extracted `MembershipService.upsertSubscription(userId, productIdentifier, data)`, used by both `processRevenueCatEvent` (webhook path) and `syncFromClient` (client sync path), so there's one code path for writing `MembershipSubscription` rows.
- No changes to the Prisma schema or to RevenueCat product/entitlement identifiers.

## 3. Webhook configuration — verified/to verify

The following was checked or needs to be checked to make the webhook path itself reliable (the sync-on-purchase endpoint above is a mitigation, not a replacement, for a correctly configured webhook):

- [x] `wspread-be/.env` (local) has `REVENUECAT_WEBHOOK_SECRET` set (non-empty).
- [ ] **Not verified in this session** — requires dashboard/CLI access this agent didn't have: confirm the **same** `REVENUECAT_WEBHOOK_SECRET` value is set in the deployed backend's Vercel environment variables (Project Settings → Environment Variables), and that it matches the Authorization header value configured in RevenueCat (Project → Integrations → Webhooks).
- [ ] **Not verified in this session**: confirm the webhook URL registered in RevenueCat points to `https://w-spread-backend.vercel.app/api/v1/memberships/revenuecat/webhook`, not `localhost`.
- [ ] Recommended: after redeploying, trigger a RevenueCat "Send Test Event" from the dashboard and check Vercel's function logs for the new `[RevenueCat webhook] received` / `[RevenueCat webhook] processing event` log lines to confirm delivery, auth, and user matching all succeed end-to-end.

## 4. How to verify the fix

1. Purchase Enterprise on a test device → badge shows "The Enterprise".
2. Force-kill the app, or log out and log back in → badge should still show "The Enterprise", even if the webhook is delayed or misconfigured (the live RevenueCat SDK entitlement now wins over a stale/empty backend response).
3. Confirm `GET /api/v1/memberships/me` eventually reflects the correct tier once the webhook or the new `/memberships/sync` call has been processed. Run `npm run prisma:studio` in `wspread-be` and check the `membership_subscriptions` table for a row with `status: ACTIVE` and the expected `entitlementIdentifier`.

## 5. Notes / follow-ups not addressed in this fix

- `getUserMembership` picks the first non-expired subscription ordered by `expiresAt desc, updatedAt desc`. If a user has multiple `MembershipSubscription` rows (e.g. after switching products), this could still pick a row that isn't the "best" one. Not in scope for this fix since the bug report didn't describe multi-product upgrades.
- The webhook's Authorization check is a plain string comparison, not a timing-safe comparison. Not changed here since it wasn't part of the reported bug.
