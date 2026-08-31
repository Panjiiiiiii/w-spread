import React from 'react';
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
  Alert,
} from 'react-native';
import {
  Navbar,
  CrownIcon,
  DiamondIcon,
  ChevronRightIcon,
} from '../components';

export default function ProfileScreen({
  activeTab = 'profile',
  onTabPress,
  userName = 'Adam Ghosling',
  role = 'The Owner',
  streakCount = 12,
  validDays = 19,
  totalDays = 365,
  expiryDate = '27 Aug 2027',
  onExtendMembership,
}) {
  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((validDays / totalDays) * 100))
  );

  const handleExtendPress = () => {
    if (onExtendMembership) {
      onExtendMembership();
    } else if (onTabPress) {
      onTabPress('membership');
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
          {/* Top Profile Header Row */}
          <View style={styles.headerRow}>
            {/* Left: Avatar + Name & Badge Column */}
            <View style={styles.userProfileGroup}>
              {/* User Avatar */}
              <View style={styles.avatarWrapper}>
                <Image
                  source={require('../assets/avatar.png')}
                  style={styles.avatarImage}
                  defaultSource={require('../assets/icon.png')}
                />
              </View>

              {/* Name & Membership Badge Column */}
              <View style={styles.userInfoColumn}>
                <Text numberOfLines={1} style={styles.userNameText}>
                  {userName}
                </Text>

                {/* Membership Badge with Crown Icon */}
                <View style={styles.membershipBadge}>
                  <CrownIcon size={12} color="#E8C75B" />
                  <Text style={styles.badgeRoleText}>{role}</Text>
                </View>
              </View>
            </View>

            {/* Right: Health / Streak Badge */}
            <View style={styles.healthBadge}>
              <Image
                source={require('../assets/fire.png')}
                style={styles.fireIcon}
                resizeMode="contain"
              />
              <Text style={styles.healthBadgeText}>{streakCount}</Text>
            </View>
          </View>

          {/* Divider Line */}
          <View style={styles.dividerLine} />

          {/* Valid Period Progress Card (Node 77:215) */}
          <View style={styles.validPeriodCard}>
            {/* Top Row: Label & Days */}
            <View style={styles.periodHeaderRow}>
              <Text style={styles.periodLabelText}>Valid Period</Text>
              <Text style={styles.periodDaysText}>
                {validDays}/{totalDays} Days
              </Text>
            </View>

            {/* Progress Bar Track & Indicator */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>

            {/* Bottom Row: Expiry Info */}
            <View style={styles.periodFooterRow}>
              <Text style={styles.expiryText}>Expired in {expiryDate}</Text>
            </View>
          </View>

          {/* Extend Membership Button (Node 77:265 with Diamond & Chevron) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleExtendPress}
            style={styles.extendButton}
          >
            {/* Left Part: Diamond Icon + Label */}
            <View style={styles.extendButtonLeft}>
              <DiamondIcon size={18} color="#1F6F5F" />
              <Text style={styles.extendButtonText}>Extend Membership</Text>
            </View>

            {/* Right Part: Right Chevron */}
            <ChevronRightIcon size={18} color="#1F6F5F" />
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Bottom-Middle Navbar */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 20,
    paddingBottom: 110,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    marginRight: 12,
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
  userInfoColumn: {
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  membershipBadge: {
    backgroundColor: 'rgba(244, 232, 210, 0.95)',
    borderRadius: 42,
    height: 20,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeRoleText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#E8C75B',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
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
  dividerLine: {
    width: '100%',
    maxWidth: 353,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  validPeriodCard: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
  },
  periodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  periodLabelText: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  periodDaysText: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 64,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1F6F5F',
    borderRadius: 64,
  },
  periodFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 9,
    color: '#1F6F5F',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  extendButton: {
    width: '100%',
    maxWidth: 353,
    height: 48,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  extendButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  extendButtonText: {
    fontSize: 13,
    color: '#1F6F5F',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
});
