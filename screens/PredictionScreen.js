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
  Alert,
} from 'react-native';
import {
  Navbar,
  HeroRunwayCard,
  Button,
  CutExpenseSlider,
  ArrowLeftIcon,
} from '../components';

export default function PredictionScreen({
  activeTab = 'prediction',
  onTabPress,
  onBack,
  baseDays = 142,
}) {
  const [cutExpense, setCutExpense] = useState(80);
  const [injectCapital, setInjectCapital] = useState('20.000.000');
  const [freezeHiring, setFreezeHiring] = useState(true);

  // Dynamic simulation computation
  const [simulatedDays, setSimulatedDays] = useState(182);
  const [diffDays, setDiffDays] = useState(40);

  useEffect(() => {
    // Dynamic formula for realistic simulation
    const expenseBonus = Math.round((cutExpense / 100) * 35);
    const hiringBonus = freezeHiring ? 15 : 0;
    const cleanNum = parseFloat(injectCapital.replace(/[^0-9]/g, '')) || 0;
    const capitalBonus = cleanNum > 0 ? Math.min(Math.round(cleanNum / 1000000), 20) : 0;

    const totalCalculated = baseDays + expenseBonus + hiringBonus + capitalBonus;
    const diff = totalCalculated - baseDays;

    setSimulatedDays(totalCalculated);
    setDiffDays(diff);
  }, [cutExpense, injectCapital, freezeHiring, baseDays]);

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (onTabPress) {
      onTabPress('home');
    }
  };

  const handleSimulateRunway = () => {
    Alert.alert(
      'Simulation Updated! 🚀',
      `Your simulated runway is now ${simulatedDays} Days (+${diffDays > 0 ? diffDays : 0} Days).`,
      [{ text: 'OK' }]
    );
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

            <Text style={styles.headerTitle}>Simulate Your Decision</Text>
            <View style={styles.headerPlaceholder} />
          </View>

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
                placeholder="e.g. 20.000.000"
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
        </ScrollView>

        {/* Floating Bottom-Middle Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabPress={onTabPress}
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
    marginBottom: 24,
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
    marginBottom: 24,
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
});
