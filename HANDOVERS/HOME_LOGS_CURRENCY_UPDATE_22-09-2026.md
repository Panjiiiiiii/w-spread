# Home Runway, Unified Activity Logs & Rupiah Localization Handover

**Handover date:** 22-09-2026
**Feature:** Dynamic Home runway card, sample e-statement + upload limit, merged Activity & History Logs, Rupiah (IDR) currency localization
**Frontend:** Expo React Native (`wspread-app`)
**Backend:** Express.js + TypeScript + Prisma on Vercel (`wspread-be`)
**Database:** PostgreSQL/Supabase

## 1. Summary of changes this cycle

1. Bundled a real, judge-testable sample BCA statement PDF and a free-tier monthly upload limit (20 tries) into the E-Statement flow.
2. Fixed the Home screen's Hero Runway Card, which was static (`142` days hardcoded), to compute a real value from the latest server prediction.
3. Removed the static "Recommendations" card from the Prediction results screen (it was not AI-generated, just a hardcoded string presented as a recommendation).
4. Merged the standalone Statement Upload History screen into the existing Activity & History Logs screen — one unified, filterable timeline instead of two separate screens.
5. Localized all in-app financial figures (cash balance, predictions, statement averages, runway comparisons) from `$` (USD) to `Rp` (IDR), via a new shared `utils/formatCurrency.js` helper — **except** the Membership/paywall screen, which intentionally keeps `$` since that reflects real RevenueCat/App Store/Play Store billing prices, not a display-only figure.

## 2. Sample statement + upload limit (E-Statement screen)

### Sample statement fixture
- New asset: `wspread-app/assets/sample-bca-statement.pdf` — a synthetic but structurally real BCA-format statement (same transaction-block layout as actual BCA exports), generated and verified to parse correctly (38 recognized transactions, bank correctly detected as `BCA`) against the real `parseStatementText` logic before being committed.
- `wspread-app/screens/EStatementScreen.js`: added a "Use Sample Statement (Demo)" button. Uses `expo-asset`'s `Asset.fromModule(require(...)).downloadAsync()` to resolve the bundled asset to a real `file://` URI on-device (confirmed against the exact Expo SDK 57 docs before implementing, per this project's AGENTS.md requirement), then feeds it into the existing upload flow exactly as if it were picked via `expo-document-picker`. No new native dependency beyond `expo-asset` (`~57.0.18`, installed via `expo install` so it matches the pinned SDK version).
- Purpose: lets judges/reviewers test the full upload → parse → results flow without needing to source or transcribe their own bank PDF.

### 20-upload/month free-tier limit
- Backend: `StatementService.getUploadLimitStatus(userId)` in `wspread-be/src/services/statement.service.ts` — counts `StatementUpload` rows created since the start of the current calendar month for the user, checks their membership tier via `MembershipService.getUserMembership`. `business`/`enterprise` tiers are unlimited; everyone else (`tier: null`, "The Owner") is capped at `FREE_TIER_MONTHLY_UPLOAD_LIMIT = 20`.
- Enforcement: `StatementService.processPdf` checks the limit **before** uploading the file to storage or creating any DB row, so a blocked attempt leaves zero trace (no wasted storage, no phantom row). Throws `ApiError.forbidden(...)` (403) with a clear upgrade-prompt message.
- New endpoint: `GET /api/v1/statements/usage` → `StatementController.usage` — returns `{ tier, unlimited, limit, used, remaining }`. Route registered in `wspread-be/src/routes/statement.routes.ts` **before** the `/:id` route (Express route-order matters here — `/usage` would otherwise be captured as an `:id` param).
- Frontend: `services/api.js` → `getStatementUploadUsage()`. `EStatementScreen.js` fetches usage on mount and after every upload attempt (success or failure both count), renders a countdown badge ("X of 20 free uploads left this month" / exhausted state in red), and disables the dropzone, sample button, and "Process Statement" button once the limit is hit.
- **Verified end-to-end** against the live dev server and Supabase DB: seeded a test user to exactly 20 uploads, confirmed `/usage` reports `remaining: 0`, confirmed the 21st real upload attempt returns 403 and does not increment the stored count further. All test data cleaned up afterward.

## 3. Home screen Hero Runway Card — real data instead of static

**Root cause:** `HomeScreen.js`'s `runwayDays` prop defaulted to a hardcoded `142` and `App.js` never overrode it with anything derived from real prediction data, unlike `PredictionScreen.js` which already used live server predictions.

**Fix (in `wspread-app/App.js`):**
- Added `getRunwayFromPrediction(prediction)` — computes `days = currentBalance / averageDailyBurn`, where `averageDailyBurn = max(0, averageMonthlyExpenses - averageMonthlyRevenue) / 30.4375`. Returns a status text/type (`safe` / `warning` / `danger`) based on day thresholds (< 30 = danger, < 90 = caution, else safe; profitable businesses with no net burn short-circuit to a "Safe zone (profitable)" state).
- The `'home'` case in `App.js`'s `renderCurrentScreen()` now computes this from `latestPrediction` and passes `runwayDays`, `runwayStatusText`, `runwayStatusType` into `HomeScreen`.
- `HomeScreen.js` gained `runwayStatusText`/`runwayStatusType` props (previously hardcoded to `"Safe zone (> 90 Days)"` / `"safe"` inside the component) and a `useEffect` that re-syncs `currentRunway` whenever the `runwayDays` prop changes, so a fresh prediction or statement upload updates the card automatically. The "Quick Simulation" local what-if preview still temporarily overrides the display (unchanged behavior), reverting to the real value on the next prediction/statement update.

**Not addressed / known limitation:** if the user has never run a prediction or uploaded a statement, the card still falls back to the static `142`-day default — this is an acceptable first-run placeholder, not a bug, since there's no real data to compute from yet.

## 4. Removed the "Recommendations" card (Prediction results screen)

`wspread-app/screens/PredictionScreen.js`'s results view had a "Recommendations" card with a hardcoded static sentence, visually presented next to sparkle icons in a way that implied AI-generated advice. It was not AI-generated and was misleading. Removed entirely, along with the now-unused `SparkleIcon` import and its dead styles (`recommendationsContainer`, `recommendationsCard`, `recommendationsTitle`, `recommendationsBody`, `starTopLeft`, `starBottomRight`). Nothing else in the results view (hero runway card, applied adjustments, comparison pills, "Go to Dashboard" button) was touched.

## 5. Merged Statement Upload History into Activity & History Logs

**Before:** two separate screens — `LogHistoryScreen.js` (prediction runs only, passed down from `App.js`'s `activityLogs` state) and a standalone `StatementHistoryScreen.js` (e-statement uploads, fetched from `GET /api/v1/statements`), reachable via two separate buttons on `ProfileScreen.js`.

**After:** `StatementHistoryScreen.js` was deleted. `LogHistoryScreen.js` now:
- Fetches statement upload history itself (`getStatementHistory(1, 50)` from `services/api.js`) via a `useCallback`-wrapped `loadStatementHistory`, normalizing each item into the same log shape used for prediction entries (`toStatementLog`).
- Merges prediction logs (still passed down as the `logs` prop from `App.js`) with the fetched statement logs, sorted newest-first by timestamp (`combinedLogs` via `useMemo`).
- Adds a third filter pill ("E-Statement (`N`)") alongside the existing "All"/"Prediction" pills.
- Renders per-item status (Success/Failed/Processing, color-coded, matching the removed screen's badge styling) for statement entries, and an error message preview for FAILED uploads.
- Tapping a successful statement log calls `getStatementFileUrl(statementId)` and opens the signed PDF URL via `Linking.openURL` (same pattern as the old standalone screen); tapping a FAILED/PROCESSING entry does nothing (not tappable — the point of showing it is to see the status/error, not open a file that doesn't exist yet).
- Added pull-to-refresh (`RefreshControl`) since this screen now does its own data fetching.

**Wiring cleanup:** removed `StatementHistoryScreen` from `screens/index.js`'s barrel export, removed the `'statement-history'` case from `App.js`'s `renderCurrentScreen()`, and removed the separate "Statement Upload History" button + `onViewStatementHistory` prop/handler from `ProfileScreen.js`. There is now only one entry point ("Activity & History Logs") for both log types.

## 6. Rupiah (IDR) currency localization

**New shared helper:** `wspread-app/utils/formatCurrency.js` exports `formatRupiah(value)` → `` `Rp ${Math.round(amount).toLocaleString('id-ID')}` ``.

**Converted to `formatRupiah` / `Rp` / `'id-ID'` locale formatting:**
- `App.js` — prediction log title (`Projected Balance: Rp...`), Home screen `cashAmount` prop (both the `'home'` case and the `default` fallback case).
- `screens/HomeScreen.js` — `CashCard`'s `currency` prop changed from `"$"` to `"Rp"`.
- `components/CashCard.js` — default `currency` prop changed from `'$'` to `'Rp'` (the `formatAmount` helper inside already used `'id-ID'` locale formatting, so only the symbol default needed to change).
- `screens/PredictionScreen.js` — all balance/average displays in the results view (`formatRupiah` from the new helper), input labels (`Inject Capital (Rp)`, `Payroll / month (Rp)`, `Vendor / month (Rp)` — previously `($)`), the "Injected Capital" applied-adjustment card, and the hardcoded daily-burn comparison pill (`Rp15.000` → `Rp10.000`, previously `$15.000` → `$10.000`).
- `screens/EStatementScreen.js` — `formatCurrency` now delegates to `formatRupiah`.
- `screens/LogHistoryScreen.js` — the "Capital" param badge on prediction log cards (`+Rp{injectCapital}`, previously `+${injectCapital}` — this one was missed in the initial pass and fixed as part of this handover).
- `components/SimulateDecisionModal.js` — "Inject Capital" input label changed to `(Rp)`.

**Deliberately left as `$` (USD):** `screens/MembershipScreen.js`'s `MEMBERSHIP_PLANS` pricing display (`priceCurrency` = `$`, `monthlyPrice`/`yearlyPrice` = 10/96/20/192). These are not computed from any backend/RevenueCat API response — they are hardcoded display labels in the app — but changing them without also correcting the actual configured App Store/Play Store product prices (set via `EXPO_PUBLIC_REVENUECAT_*_PRODUCT_ID` in `.env`, configured externally in App Store Connect / Play Console) would create a mismatch between what the app displays and what RevenueCat actually charges. If Rupiah pricing is wanted here too, it needs to be coordinated with whoever manages the actual store product configuration, not just a text swap.

## 7. Verification performed

- All modified/new frontend files (`App.js`, `HomeScreen.js`, `PredictionScreen.js`, `EStatementScreen.js`, `LogHistoryScreen.js`, `ProfileScreen.js`, `MembershipScreen.js`, `CashCard.js`, `SimulateDecisionModal.js`, `utils/formatCurrency.js`) parse cleanly via `@babel/parser`.
- Backend (`wspread-be`) TypeScript build (`npm run build`, which runs `prisma generate && tsc`) passes clean.
- The upload-limit enforcement and `/statements/usage` endpoint were verified against the live dev server and the actual Supabase database (not just unit-level): registration, usage check at 0/20, seeding to exactly 20 uploads, confirming the 21st attempt is blocked with a 403 and does not persist a new row, then full cleanup of test users/data.
- The sample statement PDF was verified to parse correctly (38 transactions, correct bank detection) against the real `parseStatementText` function before being committed as an app asset.
- A repo-wide search for remaining `$`/USD currency displays was run after the conversion to confirm no stray dollar signs remained outside the intentionally-untouched Membership screen.

## 8. Known follow-ups / not addressed in this cycle

- Membership plan pricing (`MembershipScreen.js`) is still USD-labeled; converting it to Rupiah requires coordinating with the actual App Store/Play Store product configuration, not just a text change — flagged above, not done here.
- The Home screen's runway card still falls back to a static `142`-day placeholder for brand-new users with no prediction/statement history yet — acceptable as a first-run default, not a bug, but worth revisiting if a more meaningful "no data yet" empty state is wanted.
- No automated test suite exists for the upload-limit logic or the merged logs screen; verification in this cycle was manual/live-server-based only (see Section 7). A future agent adding a test framework should cover: free-tier limit boundary (19/20/21 uploads), tier-based unlimited bypass, and the merged-logs sort/filter behavior.
