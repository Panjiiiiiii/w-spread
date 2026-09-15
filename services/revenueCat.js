import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

export const ENTITLEMENTS = {
  business: process.env.EXPO_PUBLIC_REVENUECAT_BUSINESS_ENTITLEMENT || 'business',
  enterprise: process.env.EXPO_PUBLIC_REVENUECAT_ENTERPRISE_ENTITLEMENT || 'enterprise',
};

const PRODUCT_IDS = {
  businessMonthly: process.env.EXPO_PUBLIC_REVENUECAT_BUSINESS_MONTHLY_PRODUCT_ID,
  businessYearly: process.env.EXPO_PUBLIC_REVENUECAT_BUSINESS_YEARLY_PRODUCT_ID,
  enterpriseMonthly: process.env.EXPO_PUBLIC_REVENUECAT_ENTERPRISE_MONTHLY_PRODUCT_ID,
  enterpriseYearly: process.env.EXPO_PUBLIC_REVENUECAT_ENTERPRISE_YEARLY_PRODUCT_ID,
};

let isConfigured = false;

function getApiKey() {
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  return null;
}

export async function configureRevenueCat(appUserId) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('RevenueCat is configured for Android only.');
  }

  if (!isConfigured) {
    Purchases.configure({ apiKey });
    isConfigured = true;
  }

  if (appUserId) {
    await Purchases.logIn(String(appUserId));
  }

  return Purchases.getCustomerInfo();
}

export function getSubscriptionTier(customerInfo) {
  if (customerInfo?.entitlements?.active?.[ENTITLEMENTS.enterprise]) {
    return 'enterprise';
  }
  if (customerInfo?.entitlements?.active?.[ENTITLEMENTS.business]) {
    return 'business';
  }
  return null;
}

// Builds the payload for POST /memberships/sync from the RevenueCat SDK's
// live CustomerInfo, so the backend can fast-cache the active entitlement
// instead of waiting on the async RevenueCat webhook. Returns null when no
// entitlement is active (nothing to sync).
export function buildMembershipSyncSnapshot(customerInfo) {
  const tier = getSubscriptionTier(customerInfo);
  if (!tier) return null;

  const entitlementKey = tier === 'enterprise' ? ENTITLEMENTS.enterprise : ENTITLEMENTS.business;
  const entitlement = customerInfo?.entitlements?.active?.[entitlementKey];
  if (!entitlement) return null;

  return {
    appUserId: customerInfo?.originalAppUserId || null,
    productIdentifier: entitlement.productIdentifier || null,
    entitlementIdentifier: entitlementKey,
    purchasedAtMs: entitlement.latestPurchaseDate
      ? new Date(entitlement.latestPurchaseDate).getTime()
      : null,
    expiresAtMs: entitlement.expirationDate
      ? new Date(entitlement.expirationDate).getTime()
      : null,
    willRenew: typeof entitlement.willRenew === 'boolean' ? entitlement.willRenew : null,
    store: entitlement.store || null,
    isSandbox: entitlement.isSandbox ?? null,
    originalTransactionId: entitlement.originalPurchaseDate ? String(entitlement.originalPurchaseDate) : null,
    transactionId: null,
  };
}

function packageMatchesTier(packageItem, tier, billingCycle) {
  const configuredProductId = PRODUCT_IDS[`${tier}${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`];
  if (configuredProductId) {
    return packageItem.product.identifier === configuredProductId;
  }
  return packageItem.identifier.toLowerCase().includes(tier);
}

export async function purchaseTier(tier, billingCycle) {
  const offerings = await Purchases.getOfferings();
  const packages = offerings.current?.availablePackages || [];
  
  // Debug: Log available packages to help diagnose configuration issues
  if (__DEV__) {
    console.log('RevenueCat offerings.current:', offerings.current?.identifier);
    console.log('Available packages:', packages.map(p => ({
      identifier: p.identifier,
      productIdentifier: p.product?.identifier,
      tier,
      billingCycle,
    })));
  }
  
  const packageItem = packages.find((item) => packageMatchesTier(item, tier, billingCycle));

  if (!packageItem) {
    const lookingFor = PRODUCT_IDS[`${tier}${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`];
    throw new Error(`RevenueCat package is not configured for ${tier} ${billingCycle}. Looking for product ID: ${lookingFor || 'fallback'}`);
  }

  const result = await Purchases.purchasePackage(packageItem);
  return {
    customerInfo: result.customerInfo,
    tier: getSubscriptionTier(result.customerInfo),
  };
}

export async function restoreRevenueCatPurchases() {
  const customerInfo = await Purchases.restorePurchases();
  return { customerInfo, tier: getSubscriptionTier(customerInfo) };
}

export async function openSubscriptionManagement() {
  await Purchases.showManageSubscriptions();
}
