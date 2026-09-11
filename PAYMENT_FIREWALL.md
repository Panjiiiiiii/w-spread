# RevenueCat payment firewall

The mobile app now uses RevenueCat for the only paid tiers:

- `business` entitlement
- `enterprise` entitlement

The membership screen no longer collects card numbers, applies local promo codes, or simulates QRIS/card payments. Selecting a plan opens the RevenueCat native purchase flow. Restore purchases and native subscription management are also available.

## Mobile environment

Copy these values into the Expo environment used for the native build:

```env
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_...
EXPO_PUBLIC_REVENUECAT_BUSINESS_ENTITLEMENT=business
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_ENTITLEMENT=enterprise
EXPO_PUBLIC_REVENUECAT_BUSINESS_MONTHLY_PRODUCT_ID=...
EXPO_PUBLIC_REVENUECAT_BUSINESS_YEARLY_PRODUCT_ID=...
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_MONTHLY_PRODUCT_ID=...
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_YEARLY_PRODUCT_ID=...
```

Only RevenueCat public SDK keys belong in the app. Never add the RevenueCat secret API key to Expo or commit `.env`.

## RevenueCat dashboard setup

1. Create the Business and Enterprise entitlements with the exact IDs above.
2. Create the monthly and yearly subscriptions in App Store Connect and Google Play Console.
3. Add each store product to its matching entitlement.
4. Add the four products to the current offering and configure packages whose identifiers contain `business` or `enterprise` when product ID variables are omitted.
5. Test with Apple sandbox and Google Play license testers before production.

RevenueCat uses Apple/Google billing. Mastercard may be available through the store account, but QRIS is not a native App Store/Google Play payment method. A QRIS checkout would require a separate compliant web payment provider and must not be implemented by collecting raw card details in this app.

## Firewall behavior

`App.js` loads the active entitlement after login and only allows the prediction feature when Business or Enterprise is active. RevenueCat is the source of truth; the backend should independently validate RevenueCat webhooks or customer entitlements before granting server-side premium operations.

Build a native development client or production app for testing. Expo Go cannot execute the native RevenueCat purchase module.
