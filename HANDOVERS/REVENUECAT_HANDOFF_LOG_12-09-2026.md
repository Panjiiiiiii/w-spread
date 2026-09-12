# RevenueCat Payment Firewall Handoff Log

**Handoff date**: 12-09-2026

## Current status

The Android RevenueCat **Test Store** purchase flow is now working. The screenshot confirms that RevenueCat opens the native test purchase dialog for:

- Package: `business yearly`
- Product ID: `wspread_business_yearly`
- Period: `P1Y`
- Test price: `$10.00`

This confirms that the app can load the configured offering and match the yearly Business product from the frontend environment.

## Frontend implementation

- `services/revenueCat.js`
  - Configures RevenueCat with the Android public SDK key.
  - Loads the current offering.
  - Matches packages using the configured product IDs.
  - Purchases the selected package.
  - Reads the `business` and `enterprise` entitlements.
  - Supports restoring purchases and opening subscription management.
  - Logs the current offering and available product IDs when diagnosing package mismatches.

- `screens/MembershipScreen.js`
  - Provides Business and Enterprise monthly/yearly plan selection.
  - Starts the native RevenueCat purchase flow.
  - Handles restore and subscription management actions.
  - The competition promo-code input has been removed. RevenueCat/Google Play controls the real price.

## Current frontend environment

The app currently uses a RevenueCat Test Store key:

```env
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=test_...
EXPO_PUBLIC_REVENUECAT_BUSINESS_ENTITLEMENT=business
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_ENTITLEMENT=enterprise
EXPO_PUBLIC_REVENUECAT_BUSINESS_MONTHLY_PRODUCT_ID=wspread_business_monthly
EXPO_PUBLIC_REVENUECAT_BUSINESS_YEARLY_PRODUCT_ID=wspread_business_yearly
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_MONTHLY_PRODUCT_ID=wspread_enterprise_monthly
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_YEARLY_PRODUCT_ID=wspread_enterprise_yearly
```

Do not forward the full `.env` file or any secret backend values. The Android public SDK key is safe for the client, but backend secrets must remain on the server.

## Remaining production work

1. Create the matching subscription products in Google Play Console.
2. Configure the Google Play products in RevenueCat.
3. Attach the products to the `business` and `enterprise` entitlements.
4. Add the monthly and yearly packages to the default offering.
5. Replace the Test Store key with the production Android RevenueCat public key (`goog_...`).
6. Build and test a release-signed Android app through Google Play internal testing.
7. Configure the RevenueCat webhook URL against the deployed backend and set the backend webhook secret.
8. Verify that a successful production purchase updates `/api/v1/memberships/me` and the profile/home membership badge.

## Important distinction

The Test Store dialog proves that package lookup and the test purchase flow work. It does **not** prove that Google Play billing, production product configuration, webhook delivery, or production backend membership persistence are complete.
