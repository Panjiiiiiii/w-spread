import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function PredictionScreen({ activeTab = 'prediction', onTabPress }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F3F3"
        translucent={Platform.OS === 'android'}
      />

      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI Feature</Text>
          </View>
          <Text style={styles.title}>Prediction</Text>
          <Text style={styles.subtitle}>
            Explore smart financial forecasting and market trend predictions.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Run Prediction"
              onPress={() => console.log('Run Prediction pressed')}
            />
          </View>
        </View>

        {/* Floating Fixed Bottom-Middle Navbar */}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 90,
  },
  badge: {
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#1F6F5F',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 14,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 220,
  },
});
