import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

/**
 * Circular Progress Ring Component
 * Guaranteed dead-center text alignment using SVG canvas text rendering.
 *
 * @param {number} percentage - Percentage value (0 - 100)
 * @param {number} size - Outer diameter of the circle (Default: 64)
 * @param {number} strokeWidth - Thickness of the progress ring (Default: 6)
 * @param {string} strokeColor - Color of the active ring (Default: #1F6F5F)
 * @param {string} trackColor - Color of the background ring (Default: #E8F8F0)
 */
export default function CircularProgress({
  percentage = 50,
  size = 64,
  strokeWidth = 6,
  strokeColor = '#1F6F5F',
  trackColor = '#E8F8F0',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Active Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Dead-Center SVG Text */}
        <SvgText
          x={center}
          y={center + (Platform.OS === 'android' ? 4.5 : 4)}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={strokeColor}
          fontFamily={Platform.select({
            ios: 'System',
            android: 'Roboto',
            default: 'Poppins, sans-serif',
          })}
        >
          {`${percentage}%`}
        </SvgText>
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
