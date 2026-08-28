import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

/**
 * Hero Runway Card Component
 * Matches Figma design (Node 11:53 & 21:43)
 *
 * @param {number|string} days - Number of runway days (Default: 142)
 * @param {string} title - Card header title (Default: 'Days Of Runway')
 * @param {string} statusText - Status badge text (Default: 'Safe zone (> 90 Days)')
 * @param {string} statusType - 'safe' | 'warning' | 'danger'
 * @param {function} onPress - Optional press callback
 * @param {object} style - Optional container style override
 */
export default function HeroRunwayCard({
  days = 142,
  title = 'Days Of Runway',
  statusText = 'Safe zone (> 90 Days)',
  statusType = 'safe',
  onPress,
  style,
}) {
  const CardWrapper = onPress ? TouchableOpacity : View;

  const getStatusTextColor = () => {
    switch (statusType) {
      case 'warning':
        return '#F2C94C';
      case 'danger':
        return '#EB5757';
      case 'safe':
      default:
        return '#1F6F5F';
    }
  };

  return (
    <CardWrapper
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, style]}
    >
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Main Metric Value */}
      <Text style={styles.metricValue}>{days}</Text>

      {/* Status Pill with BOLD format */}
      <View style={styles.statusPill}>
        <Text style={[styles.statusText, { color: getStatusTextColor() }]}>
          {statusText}
        </Text>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1.5,
    borderRadius: 24,
    width: '100%',
    maxWidth: 353,
    minHeight: 177,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1F6F5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 4px 14px rgba(31, 111, 95, 0.08)',
      },
    }),
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(130, 130, 130, 0.95)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  metricValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1F6F5F',
    textAlign: 'center',
    lineHeight: Platform.select({ ios: 52, android: 54, default: 50 }),
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  statusPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700', // BOLD format as requested
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
});
