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
  const packageItem = packages.find((item) => packageMatchesTier(item, tier, billingCycle));

  if (!packageItem) {
    throw new Error(`RevenueCat package is not configured for ${tier} ${billingCycle}.`);
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
