import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import {
  Navbar,
  ArrowLeftIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  HistoryIcon,
  DocumentOutlineIcon,
  CheckCircleIcon,
} from '../components';
import { getStatementFileUrl, getStatementHistory } from '../services/api';

const STATEMENT_STATUS_META = {
  SUCCESS: { label: 'Success', color: '#1F6F5F', bg: '#E8F8F0', border: '#6FCF97' },
  FAILED: { label: 'Failed', color: '#EB5757', bg: '#FFF5F5', border: '#FFD6D6' },
  PROCESSING: { label: 'Processing', color: '#B58900', bg: '#FFF8E6', border: '#F0DDA6' },
};

function formatBank(bank) {
  if (!bank || bank === 'UNKNOWN') return 'Unrecognized Bank';
  return bank;
}

// Normalizes a raw /statements history item into the same log shape used
// for prediction entries, so both types can render through one list with
// one set of filter pills.
function toStatementLog(item) {
  return {
    id: `statement-${item.id}`,
    type: 'estatement',
    statementId: item.id,
    status: item.status,
    title: item.fileName,
    timestamp: new Date(item.createdAt).toLocaleString(),
    params: {
      fileName: item.fileName,
      bank: item.bank,
      transactionCount: item.transactionCount,
      errorMessage: item.errorMessage,
      status: item.status,
    },
  };
}

export default function LogHistoryScreen({
  activeTab = 'profile',
  onTabPress,
  onBack,
  logs = [],
  onSelectLog,
}) {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'prediction' | 'estatement'
  const [statementLogs, setStatementLogs] = useState([]);
  const [isLoadingStatements, setIsLoadingStatements] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statementError, setStatementError] = useState(null);
  const [openingId, setOpeningId] = useState(null);

  const loadStatementHistory = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingStatements(true);
    try {
      const result = await getStatementHistory(1, 50);
      setStatementLogs(result.items.map(toStatementLog));
      setStatementError(null);
    } catch (err) {
      setStatementError(err.message || 'Unable to load your statement upload history.');
    } finally {
      setIsLoadingStatements(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStatementHistory();
  }, [loadStatementHistory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadStatementHistory({ silent: true });
  };

  // Merge prediction logs (passed down from App.js) with statement upload
  // logs (fetched here), newest first, so "Activity & History Logs" is one
  // unified timeline instead of two separate screens.
  const combinedLogs = useMemo(() => {
    const merged = [...logs, ...statementLogs];
    return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, statementLogs]);

  const filteredLogs = combinedLogs.filter((log) => {
    if (selectedFilter === 'all') return true;
    return log.type === selectedFilter;
  });

  const predictionCount = combinedLogs.filter((l) => l.type === 'prediction').length;
  const estatementCount = combinedLogs.filter((l) => l.type === 'estatement').length;

  const handleOpenStatementFile = async (log) => {
    if (log.status !== 'SUCCESS') return;
    setOpeningId(log.id);
    try {
      const url = await getStatementFileUrl(log.statementId);
      if (!url) throw new Error('No file is available for this statement.');
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Unable to Open File', err.message || 'Could not open the original statement.');
    } finally {
      setOpeningId(null);
    }
  };

  const handleLogItemPress = (log) => {
    if (log.type === 'estatement') {
      handleOpenStatementFile(log);
      return;
    }
    if (onSelectLog) {
      onSelectLog(log);
    } else if (onTabPress) {
      onTabPress('prediction', {
        step: 'results',
        cutExpense: log.params?.cutExpense ?? 20,
        injectCapital: log.params?.injectCapital ?? '10.000',
        freezeHiring: log.params?.freezeHiring ?? true,
        simulatedDays: log.params?.simulatedDays ?? 162,
      });
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
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#1F6F5F" />
          }
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

            <View style={styles.headerPlaceholder} />
          </View>

          {/* Subtitle / Description */}
          <View style={styles.headlineSection}>
            <Text style={styles.mainSubtitle}>
              Review prediction runs and e-statement uploads saved to your account, including failed uploads. Tap any entry to view details.
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
                All ({combinedLogs.length})
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
              <DocumentOutlineIcon
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

          {isLoadingStatements && statementLogs.length === 0 ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color="#1F6F5F" />
            </View>
          ) : statementError && statementLogs.length === 0 && logs.length === 0 ? (
            <View style={styles.stateContainer}>
              <Text style={styles.errorText}>{statementError}</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => loadStatementHistory()} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : filteredLogs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <HistoryIcon size={32} color="#1F6F5F" />
              </View>
              <Text style={styles.emptyTitle}>No History Found</Text>
              <Text style={styles.emptySubtitle}>
                Run a runway scenario simulation or upload an e-statement to create your first log.
              </Text>
            </View>
          ) : (
            <View style={styles.logsList}>
              {filteredLogs.map((log) => {
                const isPrediction = log.type === 'prediction';
                const isEstatement = log.type === 'estatement';
                const statementStatusMeta = isEstatement
                  ? STATEMENT_STATUS_META[log.status] || STATEMENT_STATUS_META.PROCESSING
                  : null;
                const isTappable = !isEstatement || log.status === 'SUCCESS';
                const isOpening = openingId === log.id;

                return (
                  <TouchableOpacity
                    key={log.id}
                    activeOpacity={isTappable ? 0.85 : 1}
                    onPress={() => handleLogItemPress(log)}
                    disabled={!isTappable || isOpening}
                    style={styles.logCard}
                  >
                    {/* Top Row: Type Badge + Timestamp */}
                    <View style={styles.logCardHeader}>
                      <View
                        style={[
                          styles.typeBadge,
                          isPrediction ? styles.predictionBadge : styles.estatementBadge,
                        ]}
                      >
                        {isPrediction ? (
                          <TrendingUpIcon size={12} color="#1F6F5F" />
                        ) : (
                          <DocumentOutlineIcon size={12} color="#1F6F5F" />
                        )}
                        <Text style={styles.typeBadgeText}>
                          {isPrediction ? 'Prediction Simulation' : 'E-Statement Upload'}
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

                    {/* Status Badge for E-Statement Uploads */}
                    {isEstatement ? (
                      <View
                        style={[
                          styles.statementStatusBadge,
                          { backgroundColor: statementStatusMeta.bg, borderColor: statementStatusMeta.border },
                        ]}
                      >
                        <Text style={[styles.statementStatusText, { color: statementStatusMeta.color }]}>
                          {statementStatusMeta.label}
                        </Text>
                      </View>
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
                            +Rp{log.params?.injectCapital ?? '10.000'}
                          </Text>
                        </View>

                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Hiring:</Text>
                          <Text style={styles.paramTagValue}>
                            {log.params?.freezeHiring ? 'Frozen' : 'Active'}
                          </Text>
                        </View>
                      </View>
                    ) : log.status === 'SUCCESS' ? (
                      <View style={styles.paramBadgesRow}>
                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Bank:</Text>
                          <Text numberOfLines={1} style={styles.paramTagValue}>
                            {formatBank(log.params?.bank)}
                          </Text>
                        </View>

                        <View style={styles.paramTag}>
                          <Text style={styles.paramTagLabel}>Transactions:</Text>
                          <Text style={styles.paramTagValue}>
                            {log.params?.transactionCount ?? 0}
                          </Text>
                        </View>
                      </View>
                    ) : log.status === 'FAILED' ? (
                      <Text numberOfLines={2} style={styles.logErrorText}>
                        {log.params?.errorMessage || 'This statement could not be processed.'}
                      </Text>
                    ) : null}

                    {/* Bottom Action Footer */}
                    {isTappable ? (
                      <View style={styles.logCardFooter}>
                        {isOpening ? (
                          <ActivityIndicator size="small" color="#1F6F5F" />
                        ) : (
                          <>
                            <View style={styles.footerLeft}>
                              {isEstatement ? <CheckCircleIcon size={14} color="#1F6F5F" /> : null}
                              <Text style={styles.redirectLinkText}>
                                {isPrediction
                                  ? 'View Simulation Results'
                                  : 'View Original PDF'}
                              </Text>
                            </View>
                            <ChevronRightIcon size={14} color="#1F6F5F" />
                          </>
                        )}
                      </View>
                    ) : null}
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

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'Poppins, sans-serif',
});

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
    fontFamily,
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
    fontFamily,
  },
  filterRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontFamily,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stateContainer: {
    width: '100%',
    maxWidth: 353,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 13,
    color: '#EB5757',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1F6F5F',
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily,
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
    fontFamily,
  },
  timestampText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontFamily,
  },
  logTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 4,
    fontFamily,
  },
  logDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
    marginBottom: 10,
    fontFamily,
  },
  statementStatusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  statementStatusText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily,
  },
  logErrorText: {
    fontSize: 12,
    color: '#EB5757',
    lineHeight: 17,
    marginBottom: 4,
    fontFamily,
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
    fontFamily,
  },
  paramTagValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily,
  },
  logCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redirectLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily,
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
    fontFamily,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 19,
    fontFamily,
  },
});
