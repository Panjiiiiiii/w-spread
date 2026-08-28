import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Exact SVG Icon components matching Figma design
export const HomeIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10.635 1.96029C10.4793 1.77716 10.2521 1.67015 10.0118 1.66675C9.77149 1.66335 9.54139 1.76388 9.3806 1.94253L1.8806 10.2759C1.66045 10.5205 1.60488 10.8717 1.73877 11.1724C1.87265 11.473 2.17092 11.6667 2.50002 11.6667H4.16668V16.6667C4.16668 17.1269 4.53978 17.5 5.00002 17.5H8.33335V13.3333H11.6667V17.5H15C15.4603 17.5 15.8334 17.1269 15.8334 16.6667V11.6667H17.0834C17.4082 11.6667 17.7034 11.4779 17.8397 11.1831C17.9761 10.8883 17.9287 10.5411 17.7183 10.2936L10.635 1.96029Z"
      fill={color}
    />
  </Svg>
);

export const PredictionIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.1061 16.5279L15.4688 10.6804C15.9548 10.3567 15.9548 9.64326 15.4688 9.31957L7.1061 3.47205C6.56205 3.10975 5.83333 3.49933 5.83333 4.15249V15.8475C5.83333 16.5007 6.56206 16.8903 7.1061 16.5279Z"
      fill={color}
    />
  </Svg>
);

export const EStatementIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 16.6667H15L15 6.52369L11.8096 3.33333H5V16.6667ZM5 1.66667C4.07953 1.66667 3.33333 2.41286 3.33333 3.33333V16.6667C3.33333 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V6.52369C16.6667 6.08166 16.4911 5.65774 16.1785 5.34518L12.9882 2.15482C12.6756 1.84226 12.2517 1.66667 11.8096 1.66667H5Z"
      fill={color}
    />
    <Path
      d="M6.66667 14.1667C6.66667 13.7064 7.03976 13.3333 7.5 13.3333H12.5C12.9602 13.3333 13.3333 13.7064 13.3333 14.1667C13.3333 14.6269 12.9602 15 12.5 15H7.5C7.03976 15 6.66667 14.6269 6.66667 14.1667Z"
      fill={color}
    />
    <Path
      d="M6.66667 10.8333C6.66667 10.3731 7.03976 10 7.5 10H10.8333C11.2936 10 11.6667 10.3731 11.6667 10.8333C11.6667 11.2936 11.2936 11.6667 10.8333 11.6667H7.5C7.03976 11.6667 6.66667 11.2936 6.66667 10.8333Z"
      fill={color}
    />
    <Path
      d="M6.66667 7.5C6.66667 7.03976 7.03976 6.66667 7.5 6.66667H9.16667C9.6269 6.66667 10 7.03976 10 7.5C10 7.96024 9.6269 8.33333 9.16667 8.33333H7.5C7.03976 8.33333 6.66667 7.96024 6.66667 7.5Z"
      fill={color}
    />
  </Svg>
);

export const ProfileIcon = ({ color = '#1F6F5F', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.73048 12.6751C4.82574 11.1483 6.76549 10 9.99992 10C13.2344 10 15.1741 11.1483 16.2694 12.6751C17.3279 14.1508 17.4965 15.8421 17.4999 16.778C17.5033 17.7191 16.7143 18.3333 15.9054 18.3333H4.09446C3.28556 18.3333 2.49659 17.7191 2.49997 16.778C2.50334 15.8421 2.67194 14.1508 3.73048 12.6751ZM4.16811 16.6667H15.8317C15.8145 15.8733 15.6438 14.6625 14.9151 13.6466C14.1861 12.6305 12.7957 11.6667 9.99992 11.6667C7.20416 11.6667 5.81369 12.6305 5.08474 13.6466C4.356 14.6625 4.18532 15.8733 4.16811 16.6667Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 6.66667C10.9205 6.66667 11.6667 5.92047 11.6667 5C11.6667 4.07953 10.9205 3.33333 10 3.33333C9.07953 3.33333 8.33333 4.07953 8.33333 5C8.33333 5.92047 9.07953 6.66667 10 6.66667ZM10 8.33333C11.8409 8.33333 13.3333 6.84095 13.3333 5C13.3333 3.15905 11.8409 1.66667 10 1.66667C8.15905 1.66667 6.66667 3.15905 6.66667 5C6.66667 6.84095 8.15905 8.33333 10 8.33333Z"
      fill={color}
    />
  </Svg>
);

export const DEFAULT_NAV_ITEMS = [
  {
    key: 'home',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    key: 'prediction',
    label: 'Prediction',
    icon: PredictionIcon,
  },
  {
    key: 'estatement',
    label: 'E-statement',
    icon: EStatementIcon,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: ProfileIcon,
  },
];

/**
 * Reusable Floating Bottom Navbar Component
 * Matches Figma design (Frame 6, Node 52:307)
 *
 * @param {string} activeTab - The key of the currently active tab
 * @param {function} onTabPress - Callback triggered when a tab is pressed: (tabKey, tabItem) => void
 * @param {Array} items - Optional custom list of navigation items
 * @param {object} containerStyle - Optional style override for outer container
 * @param {string} primaryColor - Color for active items (Default: #1F6F5F)
 * @param {string} inactiveColor - Color for inactive items (Default: #1F6F5F with opacity or #828282)
 */
export default function Navbar({
  activeTab = 'home',
  onTabPress,
  items = DEFAULT_NAV_ITEMS,
  containerStyle,
  primaryColor = '#1F6F5F',
  inactiveColor = 'rgba(31, 111, 95, 0.55)',
}) {
  return (
    <View style={[styles.outerWrapper, containerStyle]}>
      <View style={styles.navContainer}>
        {items.map((item) => {
          const isActive = activeTab === item.key;
          const IconComponent = item.icon;
          const tintColor = isActive ? primaryColor : inactiveColor;

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => onTabPress && onTabPress(item.key, item)}
              style={[
                styles.navItem,
                isActive && styles.activeNavItem,
              ]}
            >
              <View style={styles.iconWrapper}>
                {IconComponent && <IconComponent color={tintColor} size={20} />}
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.navLabel,
                  { color: tintColor },
                  isActive && styles.activeNavLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBFBFB',
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%',
    maxWidth: 345,
    height: 62,
    // Modern Floating Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  navItem: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: 4,
  },
  activeNavItem: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 9,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
    fontWeight: '400',
    textAlign: 'center',
  },
  activeNavLabel: {
    fontWeight: '600',
  },
});
