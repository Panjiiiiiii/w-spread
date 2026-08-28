import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Navbar,
  HeroRunwayCard,
  CashCard,
  Button,
  SimulateDecisionModal,
  DocumentFillIcon,
} from '../components';

export default function HomeScreen({
  activeTab: controlledActiveTab,
  onTabPress,
  navigation,
  userName = 'Adams',
  streakCount = 12,
  runwayDays = 142,
  cashAmount = '15.000',
  onQuickSimulation,
  onUploadEStatement,
  onSimulateRunway,
}) {
  const [internalTab, setInternalTab] = useState('home');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalTab;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRunway, setCurrentRunway] = useState(runwayDays);

  const handleTabPress = (tabKey, params) => {
    if (onTabPress) {
      onTabPress(tabKey, params);
    } else {
      setInternalTab(tabKey);
    }
  };

  const handleQuickSimulation = () => {
    if (onQuickSimulation) {
      onQuickSimulation();
    } else {
      setIsModalVisible(true);
    }
  };

  const handleSimulationDone = (scenarioData) => {
    setIsModalVisible(false);
    if (scenarioData?.simulatedDays) {
      setCurrentRunway(scenarioData.simulatedDays);
    }
    if (onSimulateRunway) {
      onSimulateRunway(scenarioData);
    } else if (onTabPress) {
      onTabPress('prediction', scenarioData);
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
          {/* Header Row: User Avatar & Health/Streak Badge */}
          <View style={styles.headerRow}>
            {/* User Avatar */}
            <TouchableOpacity activeOpacity={0.8} style={styles.avatarWrapper}>
              <Image
                source={require('../assets/avatar.png')}
                style={styles.avatarImage}
                defaultSource={require('../assets/icon.png')}
              />
            </TouchableOpacity>

            {/* Health / Streak Badge */}
            <View style={styles.healthBadge}>
              <Image
                source={require('../assets/fire.png')}
                style={styles.fireIcon}
                resizeMode="contain"
              />
              <Text style={styles.healthBadgeText}>{streakCount}</Text>
            </View>
          </View>

          {/* User Greeting */}
          <Text style={styles.greetingText}>Hi, {userName} !!!</Text>

          {/* Hero Runway Card */}
          <View style={styles.sectionItem}>
            <HeroRunwayCard
              days={currentRunway}
              title="Days Of Runway"
              statusText="Safe zone (> 90 Days)"
              statusType="safe"
              onPress={handleQuickSimulation}
            />
          </View>

          {/* Cash Available Card */}
          <View style={styles.sectionItem}>
            <CashCard
              title="Cash Available"
              amount={cashAmount}
              currency="$"
              onPress={() => console.log('Cash card tapped')}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            {/* Primary Button: Quick Simulation */}
            <Button
              title="Quick Simulation"
              variant="primary"
              fullWidth
              onPress={handleQuickSimulation}
            />

            {/* Secondary Button: Upload E-Statement */}
            <Button
              title="Upload E-Statement"
              variant="outline"
              fullWidth
              leftIcon={<DocumentFillIcon size={24} color="#1F6F5F" />}
              style={styles.uploadButton}
              onPress={onUploadEStatement || (() => handleTabPress('estatement'))}
            />
          </View>
        </ScrollView>

        {/* Simulate Decision Modal Organism */}
        <SimulateDecisionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          baseDays={runwayDays}
          initialCutExpense={80}
          initialInjectCapital="20.000.000"
          initialFreezeHiring={true}
          onSimulate={handleSimulationDone}
        />

        {/* Floating Fixed Bottom-Middle Navbar */}
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
    paddingBottom: 110, // Generous padding so content is not obscured by floating Navbar
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  healthBadge: {
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 34,
    gap: 6,
  },
  fireIcon: {
    width: 16,
    height: 16,
  },
  healthBadgeText: {
    color: '#1F6F5F',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  greetingText: {
    width: '100%',
    maxWidth: 353,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  sectionItem: {
    width: '100%',
    maxWidth: 353,
    marginBottom: 16,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 353,
    gap: 12,
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
  },
});
