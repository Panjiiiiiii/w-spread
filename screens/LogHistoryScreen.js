import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {
  Navbar,
  ArrowLeftIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  TrashIcon,
  HistoryIcon,
  DocumentFillIcon,
} from '../components';

export default function LogHistoryScreen({
  activeTab = 'profile',
  onTabPress,
  onBack,
  logs = [],
  onSelectLog,
  onClearLogs,
}) {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'prediction' | 'estatement'

  const filteredLogs = logs.filter((log) => {
    if (selectedFilter === 'prediction') return log.type === 'prediction';
    if (selectedFilter === 'estatement') return log.type === 'estatement';
    return true;
  });

  const predictionCount = logs.filter((l) => l.type === 'prediction').length;
  const estatementCount = logs.filter((l) => l.type === 'estatement').length;

  const handleLogItemPress = (log) => {
    if (onSelectLog) {
      onSelectLog(log);
    } else if (onTabPress) {
      if (log.type === 'prediction') {
        onTabPress('prediction', {
          step: 'results',
          cutExpense: log.params?.cutExpense ?? 20,
          injectCapital: log.params?.injectCapital ?? '10.000',
          freezeHiring: log.params?.freezeHiring ?? true,
          simulatedDays: log.params?.simulatedDays ?? 162,
        });
      } else if (log.type === 'estatement') {
        onTabPress('estatement', {
          step: 'results',
          fileName: log.params?.fileName || 'BCA_Statement_JanFeb2026.pdf',
        });
      }
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Log History',
      'Are you sure you want to clear all prediction and e-statement history logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            if (onClearLogs) onClearLogs();
          },
        },
      ]
    );
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
          {/* Header Row: Back Button + Screen Title + Clear Button */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onBack || (() => onTabPress && onTabPress('profile'))}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeftIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Activity & Logs</Text>

            {logs.length > 0 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleClearAll}
                style={styles.clearButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <TrashIcon size={18} color="#EB5757" />
              </TouchableOpacity>
            ) : (
              <View style={styles.headerPlaceholder} />
            )}
          </View>

          {/* Subtitle / Description */}
          <View style={styles.headlineSection}>
            <Text style={styles.mainSubtitle}>
              Review past simulation decisions and e-statement cashflow analyses. Tap any log entry to jump directly to its analytics.
            </Text>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('all')}
              style={[
                styles.filterPill,
                selectedFilter === 'all' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === 'all' && styles.filterPillTextActive,
                ]}
              >
                All ({logs.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('prediction')}
              style={[
                styles.filterPill,
                selectedFilter === 'prediction' && styles.filterPillActive,
              ]}
            >
              <TrendingUpIcon
                size={14}
                color={selectedFilter === 'prediction' ? '#FFFFFF' : '#1F6F5F'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === 'prediction' && styles.filterPillTextActive,
                ]}
              >
                Prediction ({predictionCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('estatement')}
              style={[
                styles.filterPill,
                selectedFilter === 'estatement' && styles.filterPillActive,
              ]}
            >
              <DocumentFillIcon
                size={14}
                color={selectedFilter === 'estatement' ? '#FFFFFF' : '#1F6F5F'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === 'estatement' && styles.filterPillTextActive,
                ]}
              >
                E-Statement ({estatementCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Log Entries List */}
          {filteredLogs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <HistoryIcon size={32} color="#1F6F5F" />
              </View>
              <Text style={styles.emptyTitle}>No Activity Logs Found</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter === 'prediction'
                  ? 'Run a runway scenario simulation in Prediction to create your first log.'
                  : selectedFilter === 'estatement'
                  ? 'Upload and analyze a bank PDF in E-statement to record analytics logs.'
                  : 'Start using Prediction simulations or E-statement analytics to track your decisions here.'}
              </Text>
            </View>
          ) : (
            <View style={styles.logsList}>
              {filteredLogs.map((log) => {
                const isPrediction = log.type === 'prediction';

                return (
                  <TouchableOpacity
                    key={log.id}
                    activeOpacity={0.85}
                    onPress={() => handleLogItemPress(log)}
                    style={styles.logCard}
                  >
                    {/* Top Row: Type Badge + Timestamp */}
                    <View style={styles.logCardHeader}>
                      <View
                        style={[
                          styles.typeBadge,
                          isPrediction
                            ? styles.predictionBadge
                            : styles.estatementBadge,
                        ]}
                      >
                        {isPrediction ? (
                          <TrendingUpIcon size={12} color="#1F6F5F" />
                        ) : (
                          <DocumentFillIcon size={12} color="#1F6F5F" />
                        )}
                        <Text style={styles.typeBadgeText}>
                          {isPrediction ? 'Prediction Simulation' : 'E-Statement Analytics'}
                        </Text>
                      </View>

                      <Text style={styles.timestampText}>{log.timestamp}</Text>
                    </View>

                    {/* Main Title / Result Highlight */}
                    <Text style={styles.logTitle}>{log.title}</Text>

                    {/* Description or Summary */}
                    {log.description ? (
                      <Text style={styles.logDescription}>{log.description}</Text>
                    ) : null}

                    {/* Parameter / Metric Badges */}
                    {isPrediction ? (
                      <View style={styles.paramBadgesRow}>
                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Cut Expense:</Text>
                          <Text style={styles.paramTagValue}>
                            {log.params?.cutExpense ?? 20}%
                          </Text>
                        </View>

                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Capital:</Text>
                          <Text style={styles.paramTagValue}>
                            +${log.params?.injectCapital ?? '10.000'}
                          </Text>
                        </View>

                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Hiring:</Text>
                          <Text style={styles.paramTagValue}>
                            {log.params?.freezeHiring ? 'Frozen' : 'Active'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.paramBadgesRow}>
                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>File:</Text>
                          <Text numberOfLines={1} style={styles.paramTagValue}>
                            {log.params?.fileName || 'BCA_Statement.pdf'}
                          </Text>
                        </View>

                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Total Analyzed:</Text>
                          <Text style={styles.paramTagValue}>
                            {log.params?.totalAmount || '$ 120.000'}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Bottom Action Footer */}
                    <View style={styles.logCardFooter}>
                      <Text style={styles.redirectLinkText}>
                        {isPrediction
                          ? 'View Simulation Results'
                          : 'View Statement Breakdown'}
                      </Text>
                      <ChevronRightIcon size={14} color="#1F6F5F" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Floating Bottom Navbar */}
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
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F6F5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    width: 32,
    height: 32,
  },
  headlineSection: {
    width: '100%',
    maxWidth: 353,
    marginBottom: 16,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#828282',
    lineHeight: 19,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  filterRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#1F6F5F',
    borderColor: '#1F6F5F',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logsList: {
    width: '100%',
    maxWidth: 353,
    gap: 12,
  },
  logCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  logCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  predictionBadge: {
    backgroundColor: '#E8F8F0',
  },
  estatementBadge: {
    backgroundColor: '#E6F4F1',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  timestampText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  logTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  logDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  paramBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  paramTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: 4,
  },
  paramTagLabel: {
    fontSize: 11,
    color: '#828282',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  paramTagValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  logCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  redirectLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  emptyContainer: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
});
