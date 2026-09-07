import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Navbar,
  HeroRunwayCard,
  Button,
  CutExpenseSlider,
  ArrowLeftIcon,
  SparkleIcon,
} from '../components';

export default function PredictionScreen({
  activeTab = 'prediction',
  onTabPress,
  onBack,
  baseDays = 142,
  initialStep = 'simulation', // 'simulation' or 'results'
  initialCutExpense = 20,
  initialInjectCapital = '10.000',
  initialFreezeHiring = true,
  onLogCreated,
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [cutExpense, setCutExpense] = useState(initialCutExpense);
  const [injectCapital, setInjectCapital] = useState(initialInjectCapital);
  const [freezeHiring, setFreezeHiring] = useState(initialFreezeHiring);

  // Sync state when props change
  useEffect(() => {
    if (initialStep) setCurrentStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (initialCutExpense !== undefined) setCutExpense(initialCutExpense);
  }, [initialCutExpense]);

  useEffect(() => {
    if (initialInjectCapital !== undefined) setInjectCapital(initialInjectCapital);
  }, [initialInjectCapital]);

  useEffect(() => {
    if (initialFreezeHiring !== undefined) setFreezeHiring(initialFreezeHiring);
  }, [initialFreezeHiring]);

  // Dynamic simulation computation
  const [simulatedDays, setSimulatedDays] = useState(162);
  const [diffDays, setDiffDays] = useState(20);

  useEffect(() => {
    // Dynamic formula for realistic calculation
    const expenseBonus = Math.round((cutExpense / 100) * 40);
    const hiringBonus = freezeHiring ? 12 : 0;
    const cleanNum = parseFloat(String(injectCapital).replace(/[^0-9]/g, '')) || 0;
    const capitalBonus = cleanNum > 100000
      ? Math.min(Math.round(cleanNum / 1000000), 20)
      : (cleanNum > 0 ? Math.min(Math.round(cleanNum / 1000), 20) : 0);

    const totalCalculated = baseDays + expenseBonus + hiringBonus + capitalBonus;
    const diff = totalCalculated - baseDays;

    setSimulatedDays(totalCalculated);
    setDiffDays(diff);
  }, [cutExpense, injectCapital, freezeHiring, baseDays]);

  const handleBackPress = () => {
    if (currentStep === 'results') {
      setCurrentStep('simulation');
    } else if (onBack) {
      onBack();
    } else if (onTabPress) {
      onTabPress('home');
    }
  };

  const handleTabPress = (tabKey, tabItem) => {
    if (tabKey === 'prediction') {
      setCurrentStep('simulation');
    }
    if (onTabPress) {
      onTabPress(tabKey, tabItem);
    }
  };

  const handleSimulateRunway = () => {
    setCurrentStep('results');
    if (onLogCreated) {
      onLogCreated({
        type: 'prediction',
        title: `Simulated Runway: ${simulatedDays} Days (+${diffDays} days)`,
        description: `Cut expense by ${cutExpense}%, injected $${injectCapital}, hiring ${freezeHiring ? 'frozen' : 'active'}.`,
        params: {
          cutExpense,
          injectCapital,
          freezeHiring,
          simulatedDays,
          diffDays,
        },
      });
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
          {/* Header Row: Back Button + Title */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBackPress}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeftIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {currentStep === 'results' ? 'Results' : 'Simulate Your Decision'}
            </Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* STEP 1: SCENARIO ADJUSTMENT VIEW */}
          {currentStep === 'simulation' ? (
            <>
              {/* Hero Runway Card */}
              <View style={styles.cardContainer}>
                <HeroRunwayCard
                  days={simulatedDays}
                  title="Days Of Runway"
                  statusText={`Safe zone (+${diffDays > 0 ? diffDays : 0} Days)`}
                  statusType="safe"
                />
              </View>

              {/* Section Title */}
              <Text style={styles.sectionTitle}>Adjust Scenarios</Text>

              {/* 1. Input Slider: Cut Expense (%) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cut Expense (%)</Text>
                <CutExpenseSlider
                  value={cutExpense}
                  onChange={setCutExpense}
                  min={0}
                  max={100}
                />
              </View>

              {/* 2. Input Number: Inject Capital ($) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Inject Capital ($)</Text>
                <View style={styles.numberInputContainer}>
                  <TextInput
                    style={styles.numberInput}
                    value={injectCapital}
                    onChangeText={setInjectCapital}
                    placeholder="e.g. 10.000"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* 3. Switch Button: Freeze Non-Essential Hiring */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Freeze Non-Essential Hiring
                </Text>
                <Switch
                  value={freezeHiring}
                  onValueChange={setFreezeHiring}
                  trackColor={{ false: '#E0E0E0', true: '#1F6F5F' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E0E0E0"
                />
              </View>

              {/* Action Button: Simulate Runway */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Simulate Runway"
                  variant="primary"
                  fullWidth
                  onPress={handleSimulateRunway}
                />
              </View>
            </>
          ) : (
            /* STEP 2: THE RESULTS VIEW (Node 41:289) */
            <>
              {/* Hero Runway Card with Result */}
              <View style={styles.cardContainer}>
                <HeroRunwayCard
                  days={simulatedDays}
                  title="Days Of Runway"
                  statusText={`Safe zone (+${diffDays > 0 ? diffDays : 0} Days)`}
                  statusType="safe"
                />
              </View>

              {/* Section Title */}
              <Text style={styles.sectionTitle}>Applied Adjustment</Text>

              {/* Row of 2 Cards: Cut Expense & Injected Capital */}
              <View style={styles.adjustmentsRow}>
                <View style={styles.adjustmentSmallCard}>
                  <Text style={styles.adjustmentLabel}>Cut Expense</Text>
                  <Text style={styles.adjustmentValue}>{cutExpense}%</Text>
                </View>

                <View style={styles.adjustmentSmallCard}>
                  <Text style={styles.adjustmentLabel}>Injected Capital</Text>
                  <Text style={styles.adjustmentValue}>$ {injectCapital}</Text>
                </View>
              </View>

              {/* Full Width Card: Freeze Non-Essential Hiring */}
              <View style={styles.adjustmentFullCard}>
                <Text style={styles.adjustmentLabel}>Freeze Non-Essential Hiring</Text>
                <Text style={styles.adjustmentValue}>
                  {freezeHiring ? 'On' : 'Off'}
                </Text>
              </View>

              {/* Comparison Section: Initial Runway & Daily Burn */}
              <View style={styles.comparisonGroup}>
                {/* Initial Runway */}
                <Text style={styles.comparisonLabel}>Initial Runway</Text>
                <View style={styles.comparisonPill}>
                  <Text style={styles.comparisonPillText}>
                    Before : {baseDays} Days → After : {simulatedDays} Days (+{diffDays > 0 ? diffDays : 0} Days)
                  </Text>
                </View>

                {/* Daily Burn */}
                <Text style={styles.comparisonLabel}>Daily Burn</Text>
                <View style={styles.comparisonPill}>
                  <Text style={styles.comparisonPillText}>
                    Before : $15.000 → After : $10.000 (-30%)
                  </Text>
                </View>
              </View>

              {/* Recommendations Card with Star Accents */}
              <View style={styles.recommendationsContainer}>
                {/* Top-Left Sparkle Accent */}
                <View style={styles.starTopLeft}>
                  <SparkleIcon size={20} color="#1F6F5F" />
                </View>

                {/* Card Content */}
                <View style={styles.recommendationsCard}>
                  <Text style={styles.recommendationsTitle}>Recommendations</Text>
                  <Text style={styles.recommendationsBody}>
                    Based on your adjusted burn rate and expense cuts, your runway is extended into a healthy safe zone. We recommend keeping non-essential hiring frozen for at least 60 days.
                  </Text>
                </View>

                {/* Bottom-Right Sparkle Accent */}
                <View style={styles.starBottomRight}>
                  <SparkleIcon size={20} color="#1F6F5F" />
                </View>
              </View>

              {/* Action Button: Go to Dashboard */}
              <View style={styles.resultsButtonContainer}>
                <Button
                  title="Go to Dashboard"
                  variant="primary"
                  fullWidth
                  onPress={() => onTabPress && onTabPress('home')}
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* Floating Bottom-Middle Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
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
    paddingHorizontal: 24,
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
    marginBottom: 20,
    marginTop: 8,
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
  cardContainer: {
    width: '100%',
    maxWidth: 353,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  inputGroup: {
    width: '100%',
    maxWidth: 353,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#1F6F5F',
    fontWeight: '500',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  numberInputContainer: {
    width: '100%',
    height: 44,
    borderColor: '#1F6F5F',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  numberInput: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F6F5F',
    padding: 0,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 353,
    marginBottom: 28,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F6F5F',
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 353,
    marginTop: 4,
  },

  // RESULTS VIEW STYLES (Node 41:289)
  adjustmentsRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  adjustmentSmallCard: {
    flex: 1,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  adjustmentFullCard: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
    marginBottom: 20,
  },
  adjustmentLabel: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  adjustmentValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  comparisonGroup: {
    width: '100%',
    maxWidth: 353,
    gap: 6,
    marginBottom: 20,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '600',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  comparisonPill: {
    width: '100%',
    height: 28,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  comparisonPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  recommendationsContainer: {
    width: '100%',
    maxWidth: 353,
    position: 'relative',
    marginVertical: 12,
  },
  recommendationsCard: {
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  recommendationsBody: {
    fontSize: 12,
    color: '#1F6F5F',
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  starTopLeft: {
    position: 'absolute',
    top: -8,
    left: -6,
    zIndex: 10,
  },
  starBottomRight: {
    position: 'absolute',
    bottom: -8,
    right: -6,
    zIndex: 10,
  },
  resultsButtonContainer: {
    width: '100%',
    maxWidth: 353,
    marginTop: 8,
  },
});
