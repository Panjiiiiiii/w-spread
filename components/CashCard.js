import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

/**
 * Helper to format number with dot thousands separator (e.g. 15000 -> "15.000")
 */
function formatAmount(value) {
  if (typeof value === 'number') {
    return value.toLocaleString('id-ID');
  }
  return value;
}

/**
 * Reusable Cash Available / KPI Card Component
 * Matches Figma design (Node 21:51 - "KPI / Cash Available")
 *
 * @param {string} title - Label above amount (Default: 'Cash Available')
 * @param {number|string} amount - Money amount (Default: '15.000')
 * @param {string} currency - Currency symbol or prefix (Default: '$')
 * @param {function} onPress - Optional tap handler
 * @param {object} style - Custom container style override
 */
export default function CashCard({
  title = 'Cash Available',
  amount = '15.000',
  currency = '$',
  onPress,
  style,
}) {
  const CardWrapper = onPress ? TouchableOpacity : View;
  const formattedDisplay = formatAmount(amount);

  return (
    <CardWrapper
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, style]}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.amountRow}>
        {currency ? <Text style={styles.currency}>{currency} </Text> : null}
        <Text style={styles.amount}>{formattedDisplay}</Text>
      </View>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F8F0',
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
    maxWidth: 353,
    padding: 16,
    justifyContent: 'center',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  title: {
    fontSize: 16,
    color: 'rgba(130, 130, 130, 0.95)',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
});
