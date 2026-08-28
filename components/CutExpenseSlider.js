import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Platform,
} from 'react-native';

/**
 * Custom Interactive Cut Expense Slider Component
 * Supports smooth dragging (PanResponder), tap-to-set, exact vertical line alignment,
 * and horizontal speech-bubble tooltip indicator matching Figma Node 33:37.
 *
 * @param {number} value - Current percentage value (0 - 100)
 * @param {function} onChange - Callback triggered on value change: (value) => void
 * @param {number} min - Minimum value (Default: 0)
 * @param {number} max - Maximum value (Default: 100)
 */
export default function CutExpenseSlider({
  value = 80,
  onChange,
  min = 0,
  max = 100,
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef(null);
  const trackLayoutRef = useRef({ pageX: 0, width: 0 });

  const updateTrackMeasurement = (callback) => {
    if (trackRef.current) {
      trackRef.current.measure((x, y, width, height, pageX) => {
        trackLayoutRef.current = { pageX, width };
        setTrackWidth(width);
        if (callback) callback({ pageX, width });
      });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt) => {
        updateTrackMeasurement(({ pageX, width }) => {
          const touchX = evt.nativeEvent.pageX - pageX;
          const clampedX = Math.max(0, Math.min(touchX, width));
          const pct = Math.round((clampedX / width) * (max - min) + min);
          if (onChange) onChange(pct);
        });
      },

      onPanResponderMove: (evt) => {
        const { pageX, width } = trackLayoutRef.current;
        if (width > 0) {
          const touchX = evt.nativeEvent.pageX - pageX;
          const clampedX = Math.max(0, Math.min(touchX, width));
          const pct = Math.round((clampedX / width) * (max - min) + min);
          if (onChange) onChange(pct);
        }
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const onTrackLayout = (e) => {
    const { width } = e.nativeEvent.layout;
    setTrackWidth(width);
    updateTrackMeasurement();
  };

  const clampedVal = Math.max(min, Math.min(max, value));
  const percentageRatio = (clampedVal - min) / (max - min);
  // Center wrapper (width 36) on the position
  const thumbLeft = trackWidth > 0 ? percentageRatio * trackWidth - 18 : 0;

  return (
    <View style={styles.container}>
      {/* Min Badge (0) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onChange && onChange(min)}
        style={styles.limitBadge}
      >
        <Text style={styles.limitBadgeText}>{min}</Text>
      </TouchableOpacity>

      {/* Main Slider Track Area with PanResponder */}
      <View
        ref={trackRef}
        onLayout={onTrackLayout}
        style={styles.sliderTrackContainer}
        {...panResponder.panHandlers}
      >
        {/* Inactive Background Track */}
        <View style={styles.backgroundTrack} />

        {/* Active Filled Track */}
        <View
          style={[
            styles.activeTrack,
            { width: `${percentageRatio * 100}%` },
          ]}
        />

        {/* Floating Tooltip + Centered Thumb Circle */}
        {trackWidth > 0 && (
          <View
            style={[
              styles.thumbAndTooltipWrapper,
              { left: thumbLeft },
            ]}
          >
            {/* Tooltip Bubble with arrow */}
            <View style={styles.tooltipContainer}>
              <View style={styles.tooltipBubble}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  style={styles.tooltipText}
                >
                  {clampedVal}
                </Text>
              </View>
              <View style={styles.tooltipArrow} />
            </View>

            {/* Exact Centered Thumb Circle on the line */}
            <View style={styles.thumbCircle} />
          </View>
        )}
      </View>

      {/* Max Badge (100) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onChange && onChange(max)}
        style={styles.limitBadge}
      >
        <Text style={styles.limitBadgeText}>{max}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 18, // Room for tooltip bubble above track
  },
  limitBadge: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F8F0',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  limitBadgeText: {
    color: '#1F6F5F',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  sliderTrackContainer: {
    flex: 1,
    height: 48,
    marginHorizontal: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E8F8F0',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  activeTrack: {
    height: 4,
    backgroundColor: '#1F6F5F',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  thumbAndTooltipWrapper: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    top: 6, // Centers 36px wrapper vertically inside 48px container (48 - 36)/2 = 6
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 24,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipBubble: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1F6F5F',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F6F5F',
    marginTop: -1,
  },
  tooltipText: {
    color: '#1F6F5F',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  thumbCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#6FCF97',
    borderWidth: 2.5,
    borderColor: '#1F6F5F',
    ...Platform.select({
      ios: {
        shadowColor: '#1F6F5F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
