import React, { useCallback, useEffect, useState } from 'react';
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
  DocumentOutlineIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  HistoryIcon,
} from '../components';
import { getStatementFileUrl, getStatementHistory } from '../services/api';

const STATUS_META = {
  SUCCESS: { label: 'Success', color: '#1F6F5F', bg: '#E8F8F0', border: '#6FCF97' },
  FAILED: { label: 'Failed', color: '#EB5757', bg: '#FFF5F5', border: '#FFD6D6' },
  PROCESSING: { label: 'Processing', color: '#B58900', bg: '#FFF8E6', border: '#F0DDA6' },
};

function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatBank(bank) {
  if (!bank || bank === 'UNKNOWN') return 'Unrecognized Bank';
  return bank;
}

export default function StatementHistoryScreen({
  activeTab = 'profile',
  onTabPress,
  onBack,
}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openingId, setOpeningId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async (targetPage = 1, { silent = false } = {}) => {
    if (!silent) setIsLoading(true);
    try {
      const result = await getStatementHistory(targetPage, 20);
      setItems(result.items);
      setPage(result.meta.page);
      setTotalPages(result.meta.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to load your upload history.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadHistory(1, { silent: true });
  };

  const handleLoadMore = () => {
    if (page < totalPages && !isLoading) {
      loadHistory(page + 1);
    }
  };

  const handleOpenFile = async (item) => {
    if (item.status !== 'SUCCESS') {
      // Failed/processing uploads may not have a retrievable file yet, or
      // the point of tapping them is to read the error, not open a PDF.
      return;
    }
    setOpeningId(item.id);
    try {
      const url = await getStatementFileUrl(item.id);
      if (!url) throw new Error('No file is available for this statement.');
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Unable to Open File', err.message || 'Could not open the original statement.');
    } finally {
      setOpeningId(null);
    }
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (onTabPress) {
      onTabPress('profile');
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
          onScrollEndDrag={handleLoadMore}
        >
          {/* Header Row: Back Button + Title */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBackPress}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeftIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Statement Upload History</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.headlineSection}>
            <Text style={styles.mainSubtitle}>
              Every e-statement you've uploaded, including ones that couldn't be parsed. Tap a successful upload to view the original PDF.
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color="#1F6F5F" />
            </View>
          ) : error ? (
            <View style={styles.stateContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => loadHistory(1)} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <HistoryIcon size={32} color="#1F6F5F" />
              </View>
              <Text style={styles.emptyTitle}>No Statements Uploaded Yet</Text>
              <Text style={styles.emptySubtitle}>
                Upload a bank e-statement to see it appear here, even if parsing fails.
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {items.map((item) => {
                const statusMeta = STATUS_META[item.status] || STATUS_META.PROCESSING;
                const isOpening = openingId === item.id;
                const isTappable = item.status === 'SUCCESS';

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={isTappable ? 0.85 : 1}
                    onPress={() => handleOpenFile(item)}
                    disabled={!isTappable || isOpening}
                    style={styles.itemCard}
                  >
                    <View style={styles.itemHeaderRow}>
                      <View style={styles.itemFileRow}>
                        <DocumentOutlineIcon size={18} color="#1F6F5F" />
                        <Text numberOfLines={1} style={styles.itemFileName}>
                          {item.fileName}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusMeta.bg, borderColor: statusMeta.border },
                        ]}
                      >
                        <Text style={[styles.statusBadgeText, { color: statusMeta.color }]}>
                          {statusMeta.label}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.itemMetaText}>
                      {formatDate(item.createdAt)} • {formatBank(item.bank)}
                    </Text>

                    {item.status === 'SUCCESS' ? (
                      <Text style={styles.itemDetailText}>
                        {item.transactionCount} transaction{item.transactionCount === 1 ? '' : 's'} recognized
                      </Text>
                    ) : item.status === 'FAILED' ? (
                      <Text numberOfLines={2} style={styles.itemErrorText}>
                        {item.errorMessage || 'This statement could not be processed.'}
                      </Text>
                    ) : (
                      <Text style={styles.itemDetailText}>Still processing…</Text>
                    )}

                    {isTappable ? (
                      <View style={styles.itemFooterRow}>
                        {isOpening ? (
                          <ActivityIndicator size="small" color="#1F6F5F" />
                        ) : (
                          <>
                            <View style={styles.itemFooterLeft}>
                              <CheckCircleIcon size={14} color="#1F6F5F" />
                              <Text style={styles.itemFooterText}>View original PDF</Text>
                            </View>
                            <ChevronRightIcon size={14} color="#1F6F5F" />
                          </>
                        )}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}

              {page < totalPages ? (
                <TouchableOpacity activeOpacity={0.8} onPress={handleLoadMore} style={styles.loadMoreButton}>
                  <Text style={styles.loadMoreButtonText}>Load More</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1F6F5F',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
      },
    }),
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F6F5F',
    fontFamily,
  },
  headerPlaceholder: {
    width: 34,
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
  itemsList: {
    width: '100%',
    maxWidth: 353,
    gap: 12,
  },
  itemCard: {
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
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  itemFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6F5F',
    flexShrink: 1,
    fontFamily,
  },
  statusBadge: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily,
  },
  itemMetaText: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 6,
    fontFamily,
  },
  itemDetailText: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '500',
    fontFamily,
  },
  itemErrorText: {
    fontSize: 12,
    color: '#EB5757',
    lineHeight: 17,
    fontFamily,
  },
  itemFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  itemFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily,
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6FCF97',
    backgroundColor: '#E8F8F0',
    marginTop: 4,
  },
  loadMoreButtonText: {
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
