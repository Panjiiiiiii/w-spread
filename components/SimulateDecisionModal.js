import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import HeroRunwayCard from './HeroRunwayCard';
import Button from './Button';
import CutExpenseSlider from './CutExpenseSlider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Organism Component: SimulateDecisionModal
 * Matches Figma design (Node 33:37 - "Simulate Decision Modal")
 *
 * Features:
 * - Smooth slide-up entry animation from bottom to top
 * - Buttery-smooth drag-down-to-close gesture without visual glitching
 * - Simultaneous backdrop fade
 * - Top-right 'X' close button
 * - Interactive Cut Expense Slider, Inject Capital, and Freeze Hiring switch
 */
export default function SimulateDecisionModal({
  visible = false,
  onClose,
  baseDays = 142,
  initialCutExpense = 80,
  initialInjectCapital = '20.000.000',
  initialFreezeHiring = true,
  onSimulate,
}) {
  // Modal visibility state to allow exit animations before unmounting
  const [modalVisible, setModalVisible] = useState(visible);

  const [cutExpense, setCutExpense] = useState(initialCutExpense);
  const [injectCapital, setInjectCapital] = useState(initialInjectCapital);
  const [freezeHiring, setFreezeHiring] = useState(initialFreezeHiring);

  // Dynamic simulation computation
  const [simulatedDays, setSimulatedDays] = useState(182);
  const [diffDays, setDiffDays] = useState(40);

  // Animation values
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isClosingRef = useRef(false);

  // Handle open/close transitions with smooth native animations
  useEffect(() => {
    if (visible) {
      isClosingRef.current = false;
      setModalVisible(true);
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);

      // Smooth slide from down to up + fade in backdrop
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 24,
          mass: 0.9,
          stiffness: 160,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalVisible && !isClosingRef.current) {
      closeWithAnimation();
    }
  }, [visible]);

  // Dynamic formula calculation
  useEffect(() => {
    const expenseBonus = Math.round((cutExpense / 100) * 35);
    const hiringBonus = freezeHiring ? 15 : 0;
    const cleanNum = parseFloat(injectCapital.replace(/[^0-9]/g, '')) || 0;
    const capitalBonus = cleanNum > 0 ? Math.min(Math.round(cleanNum / 1000000), 20) : 0;

    const totalCalculated = baseDays + expenseBonus + hiringBonus + capitalBonus;
    const diff = totalCalculated - baseDays;

    setSimulatedDays(totalCalculated);
    setDiffDays(diff);
  }, [cutExpense, injectCapital, freezeHiring, baseDays]);

  const closeWithAnimation = (callback) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      isClosingRef.current = false;
      if (onClose) onClose();
      if (callback) callback();
    });
  };

  const handleSimulatePress = () => {
    if (onSimulate) {
      onSimulate({
        cutExpense,
        injectCapital,
        freezeHiring,
        simulatedDays,
      });
    }
    closeWithAnimation();
  };

  // PanResponder for smooth drag-down to close
  const dragPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dy > 4,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          // Fade backdrop slightly as dragged down
          const progress = Math.max(0, 1 - gestureState.dy / 400);
          backdropOpacity.setValue(progress);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Drag threshold or fast flick
        if (gestureState.dy > 120 || gestureState.vy > 0.6) {
          closeWithAnimation();
        } else {
          // Spring back to fully open
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              damping: 20,
              stiffness: 180,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  if (!modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={() => closeWithAnimation()}
    >
      <View style={styles.modalRoot}>
        {/* Animated Dark Backdrop */}
        <TouchableWithoutFeedback onPress={() => closeWithAnimation()}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Animated Slide-Up Modal Sheet */}
        <Animated.View
          style={[
            styles.modalSheet,
            { transform: [{ translateY }] },
          ]}
        >
          {/* Top Drag Handle with PanResponder */}
          <View
            style={styles.handleContainer}
            {...dragPanResponder.panHandlers}
          >
            <View style={styles.handle} />
          </View>

          {/* Close 'X' Button in Top Right Corner */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => closeWithAnimation()}
            style={styles.closeButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1F6F5F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M18 6L6 18M6 6l12 12" />
            </Svg>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Modal Title */}
            <Text style={styles.modalTitle}>Simulate Decision</Text>

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
                onPress={handleSimulatePress}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: '90%',
    width: '100%',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0px -6px 20px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#828282',
    opacity: 0.4,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  cardContainer: {
    width: '100%',
    maxWidth: 353,
    marginBottom: 20,
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
    marginBottom: 18,
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
    height: 42,
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
    marginBottom: 24,
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
    marginTop: 6,
  },
});
