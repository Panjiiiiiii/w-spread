import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Text as SvgText } from 'react-native-svg';

/**
 * W-Spread App Logo Component
 * Pixel-perfect SVG reproduction of the official app icon.
 *
 * @param {number} size - Overall width/height of the square icon (Default: 72)
 * @param {number} borderRadius - Corner radius (Default: size * 0.22)
 * @param {string} bgColor - Background container color (Default: #E8F8F0)
 * @param {string} brandColor - Dark green graphic element color (Default: #1F6F5F)
 */
export default function AppLogo({
  size = 72,
  borderRadius,
  bgColor = '#E8F8F0',
  brandColor = '#1F6F5F',
}) {
  const radius = borderRadius !== undefined ? borderRadius : size * 0.22;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Rounded Background Container */}
        <Rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx={radius * (100 / size)}
          fill={bgColor}
        />

        {/* Letter "W" at Top Left */}
        <SvgText
          x="9"
          y="28"
          fontSize="24"
          fontWeight="900"
          fill={brandColor}
          fontFamily="System"
        >
          W
        </SvgText>

        {/* 3 Ascending Bar Charts */}
        {/* Bar 1 (Left) */}
        <Rect
          x="8.5"
          y="66"
          width="23.5"
          height="27"
          rx="1.5"
          fill={brandColor}
        />

        {/* Bar 2 (Middle) */}
        <Rect
          x="38.5"
          y="48"
          width="23.5"
          height="45"
          rx="1.5"
          fill={brandColor}
        />

        {/* Bar 3 (Right) */}
        <Rect
          x="68.5"
          y="36.5"
          width="23.5"
          height="56.5"
          rx="1.5"
          fill={brandColor}
        />

        {/* Diagonal Growth Line */}
        <Path
          d="M7 52.5 L88 12"
          stroke={brandColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Arrow Head at Top Right */}
        <Path
          d="M80 7.5 L93 10 L87 23"
          stroke={brandColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
