import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';

/**
 * Reusable Primary Button Component
 * Matches Figma design (Node 21:11 - "Primary Button")
 *
 * @param {string} title - Text displayed inside the button
 * @param {function} onPress - Function called on button press
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} disabled - Disable press and dim opacity
 * @param {boolean} loading - Display loading spinner instead of text
 * @param {React.ReactNode} leftIcon - Optional icon element on the left
 * @param {React.ReactNode} rightIcon - Optional icon element on the right
 * @param {boolean} fullWidth - If true, stretches to 100% width
 * @param {object} style - Custom container style override
 * @param {object} textStyle - Custom text style override
 * @param {React.ReactNode} children - Optional nested elements
 */
export default function Button({
  title = 'Click Here',
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  children,
  ...props
}) {
  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#1F6F5F' : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          
          {children || (
            <Text
              style={[
                styles.baseText,
                styles[`text_${variant}`],
                styles[`textSize_${size}`],
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}

          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

// Alias for explicit PrimaryButton usage
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;

const styles = StyleSheet.create({
  base: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },

  // Variants
  primary: {
    backgroundColor: '#1F6F5F',
    ...Platform.select({
      ios: {
        shadowColor: '#1F6F5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(31, 111, 95, 0.25)',
      },
    }),
  },
  secondary: {
    backgroundColor: '#6FCF97',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#1F6F5F',
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  size_small: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 40,
  },
  size_medium: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    minHeight: 56,
  },
  size_large: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    minHeight: 64,
  },

  // Typography
  baseText: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
    fontWeight: '500',
    textAlign: 'center',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: '#1F6F5F',
  },
  text_ghost: {
    color: '#1F6F5F',
  },

  textSize_small: {
    fontSize: 14,
  },
  textSize_medium: {
    fontSize: 16,
  },
  textSize_large: {
    fontSize: 18,
    fontWeight: '600',
  },

  // Disabled State
  disabled: {
    opacity: 0.5,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
      web: { boxShadow: 'none' },
    }),
  },
  disabledText: {
    opacity: 0.8,
  },
});
