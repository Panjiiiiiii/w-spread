import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import {
  Navbar,
  Button,
  ArrowLeftIcon,
  CrownIcon,
  DiamondIcon,
  CheckMarkSmallIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TagIcon,
  WalletIcon,
  QrCodeIcon,
  CheckCircleIcon,
  SparkleIcon,
} from '../components';

const MEMBERSHIP_PLANS = [
  {
    id: 'productive',
    name: 'Productive',
    badge: 'Free Tier',
    targetICP: 'Karyawan & Freelancer (Segala lini gaji)',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Structured DSS: 1-Angka Live Runway Personal, Auto-Parser & Gamified Health Score.',
    features: [
      '20 tries for what-if prediction',
      '1-Angka Live Runway Personal',
      'Auto-Parser e-Statement',
      'Gamified Financial Health Score & Daily Streak',
    ],
    buttonText: 'Current Plan',
    isPopular: false,
    disabled: true,
  },
  {
    id: 'business',
    name: 'Business',
    badge: 'Most Popular',
    targetICP: 'Pengusaha Rintisan / UMKM (1–15 Karyawan)',
    monthlyPrice: 10,
    yearlyPrice: 96, // $8/mo (~20% off)
    description: 'Semi-Structured DSS: What-If Decision Engine, Pemisah Kas Pribadi vs Bisnis.',
    features: [
      'Unlock unlimited what-if prediction',
      '20 tries for upload statement',
      'Limited AI recommendations',
      'Pemisah Kas Pribadi vs Bisnis',
      'Simulator Dampak Payroll & Vendor',
    ],
    buttonText: 'Upgrade to Business',
    isPopular: true,
    disabled: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Full Power',
    targetICP: 'Perusahaan Menengah / Besar (>15 Karyawan)',
    monthlyPrice: 20,
    yearlyPrice: 192, // $16/mo (~20% off)
    description: 'Unstructured DSS: Predictive Cashflow Analytics, Modul Valuasi, Akses API & Audit Log.',
    features: [
      'Unlock all features',
      'Unlimited AI recommendations',
      'Unlimited upload statement',
      'Predictive Cashflow Analytics & Valuasi',
      'Konsolidasi Multi-Akun / Entitas',
      'Akses API & Audit Log',
    ],
    buttonText: 'Upgrade to Enterprise',
    isPopular: false,
    disabled: false,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, Amex (RevenueCat)',
    icon: CreditCardIcon,
  },
  {
    id: 'wallet',
    name: 'Apple / Google Pay',
    subtitle: 'Instant 1-tap checkout',
    icon: WalletIcon,
  },
  {
    id: 'qris',
    name: 'QRIS / Virtual Account',
    subtitle: 'BCA, Mandiri, BRI, GoPay, OVO',
    icon: QrCodeIcon,
  },
];

export default function MembershipScreen({
  activeTab = 'profile',
  onTabPress,
  onBack,
  onMembershipUpgraded,
  isOnboarding = false,
  onSkipToDashboard,
}) {
  // Navigation step: 'plans' or 'checkout'
  const [currentStep, setCurrentStep] = useState('plans');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(MEMBERSHIP_PLANS[1]); // default Business

  // Checkout State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code, percentage, amount }
  const [discountError, setDiscountError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock Card Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Handle plan select
  const handleSelectPlan = (plan) => {
    if (plan.disabled) {
      if (isOnboarding && onSkipToDashboard) {
        onSkipToDashboard();
      } else if (onTabPress) {
        onTabPress('home');
      }
      return;
    }
    setSelectedPlan(plan);
    setAppliedDiscount(null);
    setPromoCodeInput('');
    setDiscountError('');
    setCurrentStep('checkout');
  };

  // Calculate pricing
  const basePrice = billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percentage) {
      discountAmount = (basePrice * appliedDiscount.percentage) / 100;
    } else if (appliedDiscount.amount) {
      discountAmount = Math.min(basePrice, appliedDiscount.amount);
    }
  }
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Promo code validation
  const handleApplyPromoCode = () => {
    const cleanCode = promoCodeInput.trim().toUpperCase();
    setDiscountError('');

    if (!cleanCode) {
      setDiscountError('Please enter a promo code');
      return;
    }

    if (cleanCode === 'PROMO20' || cleanCode === 'WSPREAD20') {
      setAppliedDiscount({ code: cleanCode, percentage: 20 });
      Alert.alert('Promo Applied! 🎉', '20% discount has been applied to your order.');
    } else if (cleanCode === 'HACKATHON50' || cleanCode === 'WSPREAD50') {
      setAppliedDiscount({ code: cleanCode, percentage: 50 });
      Alert.alert('Special Promo Applied! 🚀', '50% discount has been applied to your order.');
    } else if (cleanCode === 'REVENUECAT') {
      setAppliedDiscount({ code: cleanCode, amount: 5 });
      Alert.alert('RevenueCat Promo Applied! 💎', '$5 flat discount has been applied.');
    } else {
      setDiscountError('Invalid or expired promo code');
    }
  };

  // Payment process simulation
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowSuccessModal(true);
      if (onMembershipUpgraded) {
        onMembershipUpgraded({
          plan: selectedPlan.name,
          role: selectedPlan.id === 'enterprise' ? 'The Enterprise' : 'The Business Owner',
        });
      }
    }, 1400);
  };

  const handleSkip = () => {
    if (onSkipToDashboard) {
      onSkipToDashboard();
    } else if (onTabPress) {
      onTabPress('home');
    }
  };

  const handleBackNavigation = () => {
    if (currentStep === 'checkout') {
      setCurrentStep('plans');
    } else if (isOnboarding) {
      handleSkip();
    } else if (onBack) {
      onBack();
    } else if (onTabPress) {
      onTabPress('profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F3F3"
        translucent={Platform.OS === 'android'}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBackNavigation}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeftIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {currentStep === 'checkout' ? 'RevenueCat Checkout' : 'Membership Plans'}
            </Text>

            {isOnboarding && currentStep === 'plans' ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSkip}
                style={styles.skipHeaderBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.skipHeaderBtnText}>Skip</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.headerPlaceholder} />
            )}
          </View>

          {/* ================= STEP 1: PLANS SELECTION ================= */}
          {currentStep === 'plans' ? (
            <>
              {/* Headline */}
              <View style={styles.headlineContainer}>
                <Text style={styles.headlineTitle}>Unlock Supercharged DSS</Text>
                <Text style={styles.headlineSubtitle}>
                  Scale your runway predictions, automated cashflow analysis, and AI financial recommendations.
                </Text>
              </View>

              {/* Billing Cycle Switcher (Monthly vs Yearly) */}
              <View style={styles.billingToggleWrapper}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setBillingCycle('monthly')}
                  style={[
                    styles.billingOption,
                    billingCycle === 'monthly' && styles.billingOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.billingOptionText,
                      billingCycle === 'monthly' && styles.billingOptionTextActive,
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setBillingCycle('yearly')}
                  style={[
                    styles.billingOption,
                    billingCycle === 'yearly' && styles.billingOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.billingOptionText,
                      billingCycle === 'yearly' && styles.billingOptionTextActive,
                    ]}
                  >
                    Yearly
                  </Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>Save 20%</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Membership Cards List */}
              <View style={styles.plansContainer}>
                {MEMBERSHIP_PLANS.map((plan) => {
                  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
                  const pricePeriod = billingCycle === 'yearly' ? '/yr' : '/mo';

                  return (
                    <View
                      key={plan.id}
                      style={[
                        styles.planCard,
                        plan.isPopular && styles.planCardPopular,
                      ]}
                    >
                      {/* Popular / Recommended Tag */}
                      {plan.isPopular && (
                        <View style={styles.popularRibbon}>
                          <SparkleIcon size={12} color="#FFFFFF" />
                          <Text style={styles.popularRibbonText}>RECOMMENDED</Text>
                        </View>
                      )}

                      {/* Plan Header */}
                      <View style={styles.planHeader}>
                        <View style={styles.planTitleGroup}>
                          <Text style={styles.planName}>{plan.name}</Text>
                          <View style={styles.icpBadge}>
                            <Text style={styles.icpBadgeText}>{plan.targetICP}</Text>
                          </View>
                        </View>

                        {/* Price */}
                        <View style={styles.priceRow}>
                          <Text style={styles.priceCurrency}>$</Text>
                          <Text style={styles.priceAmount}>{price}</Text>
                          <Text style={styles.pricePeriod}>{pricePeriod}</Text>
                        </View>
                      </View>

                      <Text style={styles.planDescription}>{plan.description}</Text>

                      {/* Divider */}
                      <View style={styles.planDivider} />

                      {/* Features List */}
                      <View style={styles.featuresList}>
                        {plan.features.map((feat, idx) => (
                          <View key={idx} style={styles.featureItem}>
                            <View style={styles.featureCheckWrapper}>
                              <CheckMarkSmallIcon size={12} color="#1F6F5F" />
                            </View>
                            <Text style={styles.featureText}>{feat}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Action Button */}
                      <View style={styles.planActionWrapper}>
                        <Button
                          title={plan.buttonText}
                          variant={plan.isPopular ? 'primary' : (plan.disabled ? 'outline' : 'primary')}
                          disabled={plan.disabled}
                          fullWidth
                          onPress={() => handleSelectPlan(plan)}
                          style={plan.disabled ? styles.disabledBtnStyle : null}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          ) : (
            /* ================= STEP 2: REVENUECAT CHECKOUT ================= */
            <>
              {/* Order Summary Box */}
              <View style={styles.checkoutSummaryCard}>
                <View style={styles.summaryTopRow}>
                  <View>
                    <Text style={styles.summaryPlanLabel}>SELECTED PLAN</Text>
                    <Text style={styles.summaryPlanName}>{selectedPlan.name} Tier</Text>
                    <Text style={styles.summaryBillingText}>
                      Billed {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} • Auto-renews
                    </Text>
                  </View>

                  <View style={styles.summaryPriceBox}>
                    <Text style={styles.summaryPriceValue}>${basePrice}</Text>
                    <Text style={styles.summaryPriceCycle}>
                      {billingCycle === 'yearly' ? '/yr' : '/mo'}
                    </Text>
                  </View>
                </View>

                {/* Change Plan Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCurrentStep('plans')}
                  style={styles.changePlanBtn}
                >
                  <Text style={styles.changePlanText}>Change Plan</Text>
                </TouchableOpacity>
              </View>

              {/* Payment Methods Section */}
              <Text style={styles.checkoutSectionTitle}>Select Payment Method</Text>

              <View style={styles.paymentMethodsList}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPaymentMethod === method.id;
                  const IconComp = method.icon;

                  return (
                    <TouchableOpacity
                      key={method.id}
                      activeOpacity={0.85}
                      onPress={() => setSelectedPaymentMethod(method.id)}
                      style={[
                        styles.paymentMethodCard,
                        isSelected && styles.paymentMethodCardSelected,
                      ]}
                    >
                      <View style={styles.paymentMethodLeft}>
                        <View
                          style={[
                            styles.paymentIconWrapper,
                            isSelected && styles.paymentIconWrapperSelected,
                          ]}
                        >
                          <IconComp size={20} color={isSelected ? '#1F6F5F' : '#828282'} />
                        </View>
                        <View>
                          <Text style={styles.paymentMethodName}>{method.name}</Text>
                          <Text style={styles.paymentMethodSubtitle}>{method.subtitle}</Text>
                        </View>
                      </View>

                      {/* Radio Circle */}
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Card Details Form (shown when Credit Card is selected) */}
              {selectedPaymentMethod === 'card' && (
                <View style={styles.cardFormContainer}>
                  <Text style={styles.cardFormLabel}>Card Number</Text>
                  <View style={styles.cardInputWrapper}>
                    <CreditCardIcon size={18} color="#1F6F5F" />
                    <TextInput
                      style={styles.cardTextInput}
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      placeholder="4242 4242 4242 4242"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.cardRow}>
                    <View style={styles.cardHalfInput}>
                      <Text style={styles.cardFormLabel}>Expiry Date</Text>
                      <View style={styles.cardInputWrapperSmall}>
                        <TextInput
                          style={styles.cardTextInput}
                          value={cardExpiry}
                          onChangeText={setCardExpiry}
                          placeholder="MM/YY"
                          placeholderTextColor="#A0A0A0"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={styles.cardHalfInput}>
                      <Text style={styles.cardFormLabel}>CVC / CVV</Text>
                      <View style={styles.cardInputWrapperSmall}>
                        <TextInput
                          style={styles.cardTextInput}
                          value={cardCvc}
                          onChangeText={setCardCvc}
                          placeholder="123"
                          placeholderTextColor="#A0A0A0"
                          keyboardType="numeric"
                          secureTextEntry
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Promo / Discount Code Section */}
              <Text style={styles.checkoutSectionTitle}>Promo Code</Text>
              <View style={styles.promoCodeContainer}>
                <View style={styles.promoInputWrapper}>
                  <TagIcon size={16} color="#1F6F5F" />
                  <TextInput
                    style={styles.promoTextInput}
                    value={promoCodeInput}
                    onChangeText={setPromoCodeInput}
                    placeholder="e.g. PROMO20"
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="characters"
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleApplyPromoCode}
                  style={styles.applyCodeBtn}
                >
                  <Text style={styles.applyCodeBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>

              {appliedDiscount && (
                <View style={styles.appliedDiscountBadge}>
                  <CheckCircleIcon size={16} color="#27AE60" />
                  <Text style={styles.appliedDiscountText}>
                    Code <Text style={{ fontWeight: '700' }}>{appliedDiscount.code}</Text> applied (-${discountAmount.toFixed(2)})
                  </Text>
                </View>
              )}

              {discountError ? (
                <Text style={styles.discountErrorText}>{discountError}</Text>
              ) : null}

              {/* Price Breakdown */}
              <View style={styles.breakdownCard}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Subtotal</Text>
                  <Text style={styles.breakdownValue}>${basePrice.toFixed(2)}</Text>
                </View>

                {discountAmount > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: '#27AE60' }]}>
                      Discount ({appliedDiscount?.percentage ? `${appliedDiscount.percentage}%` : 'Promo'})
                    </Text>
                    <Text style={[styles.breakdownValue, { color: '#27AE60' }]}>
                      -${discountAmount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Tax / VAT</Text>
                  <Text style={styles.breakdownValue}>Included ($0.00)</Text>
                </View>

                <View style={styles.breakdownDivider} />

                <View style={styles.breakdownTotalRow}>
                  <Text style={styles.breakdownTotalLabel}>Total Due Today</Text>
                  <Text style={styles.breakdownTotalValue}>${finalPrice.toFixed(2)}</Text>
                </View>
              </View>

              {/* Security Badge */}
              <View style={styles.securityBadge}>
                <ShieldCheckIcon size={18} color="#1F6F5F" />
                <Text style={styles.securityBadgeText}>
                  Powered by RevenueCat Secure Billing • 256-Bit SSL
                </Text>
              </View>

              {/* Action Button: Pay Now */}
              <View style={styles.payButtonWrapper}>
                <Button
                  title={`Pay $${finalPrice.toFixed(2)} with RevenueCat`}
                  variant="primary"
                  fullWidth
                  loading={isProcessingPayment}
                  onPress={handleExecutePayment}
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* Floating Bottom-Middle Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabPress={onTabPress}
        />

        {/* Success Confirmation Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successModalCard}>
              <View style={styles.successIconCircle}>
                <CrownIcon size={32} color="#FFFFFF" />
              </View>

              <Text style={styles.successModalTitle}>Membership Active! 🎉</Text>
              <Text style={styles.successModalSubtitle}>
                Welcome to <Text style={{ fontWeight: '700', color: '#1F6F5F' }}>{selectedPlan.name} Tier</Text>! Your account is now upgraded with all premium DSS features.
              </Text>

              <View style={styles.successDetailsBox}>
                <Text style={styles.successDetailItem}>
                  ✓ Unlimited What-If Simulation
                </Text>
                <Text style={styles.successDetailItem}>
                  ✓ E-Statement Batch Processing
                </Text>
                <Text style={styles.successDetailItem}>
                  ✓ RevenueCat Pro Entitlement Enabled
                </Text>
              </View>

              <View style={styles.successModalBtnWrapper}>
                <Button
                  title="Go to Profile"
                  variant="primary"
                  fullWidth
                  onPress={() => {
                    setShowSuccessModal(false);
                    if (onTabPress) onTabPress('profile');
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 110,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 6,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1F6F5F',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  headerPlaceholder: {
    width: 34,
  },
  skipHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E8F8F0',
  },
  skipHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6F5F',
  },
  headlineContainer: {
    width: '100%',
    maxWidth: 353,
    alignItems: 'center',
    marginBottom: 20,
  },
  headlineTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  headlineSubtitle: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 310,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },

  // Billing Cycle Toggle
  billingToggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E8F8F0',
    borderRadius: 30,
    padding: 4,
    width: '100%',
    maxWidth: 290,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#6FCF97',
  },
  billingOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  billingOptionActive: {
    backgroundColor: '#1F6F5F',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  billingOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  billingOptionTextActive: {
    color: '#FFFFFF',
  },
  saveBadge: {
    backgroundColor: '#E8C75B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  saveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1F6F5F',
  },

  // Plans List
  plansContainer: {
    width: '100%',
    maxWidth: 353,
    gap: 20,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 3px 12px rgba(0,0,0,0.06)',
      },
    }),
  },
  planCardPopular: {
    borderColor: '#1F6F5F',
    borderWidth: 2,
    backgroundColor: '#FAFFFC',
  },
  popularRibbon: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#1F6F5F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  popularRibbonText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F6F5F',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  icpBadge: {
    backgroundColor: '#E8F8F0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  icpBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1F6F5F',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  pricePeriod: {
    fontSize: 12,
    color: '#828282',
    marginBottom: 4,
    marginLeft: 2,
  },
  planDescription: {
    fontSize: 12,
    color: '#828282',
    lineHeight: 18,
    marginBottom: 12,
  },
  planDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 12,
  },
  featuresList: {
    gap: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureCheckWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  planActionWrapper: {
    marginTop: 4,
  },
  disabledBtnStyle: {
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
  },

  // CHECKOUT VIEW STYLES
  checkoutSummaryCard: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  summaryPlanLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#828282',
    letterSpacing: 0.5,
  },
  summaryPlanName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F6F5F',
    marginVertical: 2,
  },
  summaryBillingText: {
    fontSize: 11,
    color: '#1F6F5F',
  },
  summaryPriceBox: {
    alignItems: 'flex-end',
  },
  summaryPriceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F6F5F',
  },
  summaryPriceCycle: {
    fontSize: 11,
    color: '#828282',
  },
  changePlanBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  changePlanText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F6F5F',
    textDecorationLine: 'underline',
  },
  checkoutSectionTitle: {
    width: '100%',
    maxWidth: 353,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 10,
    marginTop: 6,
  },
  paymentMethodsList: {
    width: '100%',
    maxWidth: 353,
    gap: 10,
    marginBottom: 16,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  paymentMethodCardSelected: {
    borderColor: '#1F6F5F',
    backgroundColor: '#FAFFFC',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconWrapperSelected: {
    backgroundColor: '#E8F8F0',
  },
  paymentMethodName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6F5F',
  },
  paymentMethodSubtitle: {
    fontSize: 10,
    color: '#828282',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#1F6F5F',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1F6F5F',
  },

  // Card Form
  cardFormContainer: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#6FCF97',
    padding: 14,
    marginBottom: 16,
  },
  cardFormLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6F5F',
    marginBottom: 6,
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 42,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardHalfInput: {
    flex: 1,
  },
  cardInputWrapperSmall: {
    height: 42,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  cardTextInput: {
    fontSize: 13,
    color: '#1F6F5F',
    fontWeight: '600',
    flex: 1,
    padding: 0,
  },

  // Promo Code
  promoCodeContainer: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  promoInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderColor: '#1F6F5F',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  promoTextInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6F5F',
    padding: 0,
  },
  applyCodeBtn: {
    backgroundColor: '#1F6F5F',
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyCodeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  appliedDiscountBadge: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  appliedDiscountText: {
    fontSize: 12,
    color: '#27AE60',
  },
  discountErrorText: {
    fontSize: 11,
    color: '#EB5757',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  // Breakdown Card
  breakdownCard: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginVertical: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#828282',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F6F5F',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F6F5F',
  },
  breakdownTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F6F5F',
  },

  // Security Badge
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 10,
  },
  securityBadgeText: {
    fontSize: 10,
    color: '#1F6F5F',
    fontWeight: '500',
  },

  // Pay Button Wrapper
  payButtonWrapper: {
    width: '100%',
    maxWidth: 353,
    marginTop: 8,
    marginBottom: 20,
  },

  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F6F5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 8,
  },
  successModalSubtitle: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  successDetailsBox: {
    width: '100%',
    backgroundColor: '#E8F8F0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 20,
  },
  successDetailItem: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6F5F',
  },
  successModalBtnWrapper: {
    width: '100%',
  },
});
