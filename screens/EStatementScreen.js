import React, { useState, useEffect } from 'react';
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
import * as DocumentPicker from 'expo-document-picker';
import { Asset } from 'expo-asset';
import {
  Navbar,
  Button,
  DocumentOutlineIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CircularProgress,
} from '../components';
import { getStatementUploadUsage, uploadStatement } from '../services/api';

const MAX_STATEMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB, matches dropzone copy + backend limit

// Bundled demo fixture (a real, synthetic BCA-format statement) so judges
// and reviewers can test the full upload -> parse -> results flow without
// needing to source their own bank PDF.
const SAMPLE_STATEMENT_ASSET = require('../assets/sample-bca-statement.pdf');
const SAMPLE_STATEMENT_NAME = 'sample-bca-statement.pdf';

export default function EStatementScreen({
  activeTab = 'estatement',
  onTabPress,
  onBack,
  initialStep = 'upload',
  initialFileName,
  onStatementProcessed,
}) {
  // 'upload' or 'results' step
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statementResult, setStatementResult] = useState(null);
  // Free-tier ("The Owner") upload allowance for the current calendar
  // month, fetched from GET /statements/usage. null while loading; once
  // loaded, `unlimited: true` for business/enterprise means no countdown is
  // shown and the upload button is never disabled for this reason.
  const [uploadUsage, setUploadUsage] = useState(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

  useEffect(() => {
    if (initialStep) setCurrentStep(initialStep);
  }, [initialStep]);

  const loadUploadUsage = async () => {
    try {
      const usage = await getStatementUploadUsage();
      setUploadUsage(usage);
    } catch (error) {
      console.warn('Failed to load statement upload usage:', error.message);
      setUploadUsage(null);
    } finally {
      setIsLoadingUsage(false);
    }
  };

  useEffect(() => {
    loadUploadUsage();
  }, []);

  const hasReachedUploadLimit = Boolean(
    uploadUsage && !uploadUsage.unlimited && uploadUsage.remaining !== null && uploadUsage.remaining <= 0
  );

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        // Backend only accepts PDF (multer fileFilter rejects other mime types),
        // so restrict the picker to PDF to avoid a round-trip failure.
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size && file.size > MAX_STATEMENT_SIZE_BYTES) {
          Alert.alert('File Too Large', 'Please select a PDF statement smaller than 10 MB.');
          return;
        }
        setSelectedFile(file);
        setStatementResult(null);
      }
    } catch (err) {
      console.log('Error picking document:', err);
      Alert.alert('Error', 'Unable to pick document. Please try again.');
    }
  };

  // Loads the bundled demo statement fixture as if it were picked by the
  // user, so judges/reviewers can test the full flow without a real bank
  // PDF. Asset.fromModule + downloadAsync resolves the bundled require()
  // into a real file:// URI on-device, matching the shape DocumentPicker
  // normally returns (uri/name/mimeType/size).
  const handleUseSampleStatement = async () => {
    try {
      const asset = Asset.fromModule(SAMPLE_STATEMENT_ASSET);
      await asset.downloadAsync();
      setSelectedFile({
        uri: asset.localUri || asset.uri,
        name: SAMPLE_STATEMENT_NAME,
        mimeType: 'application/pdf',
        size: null,
      });
      setStatementResult(null);
    } catch (err) {
      console.log('Error loading sample statement:', err);
      Alert.alert('Error', 'Unable to load the sample statement. Please try again.');
    }
  };

  const handleProcessStatement = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please choose a PDF e-statement first.');
      return;
    }
    if (hasReachedUploadLimit) {
      Alert.alert(
        'Upload Limit Reached',
        `You've used all ${uploadUsage.limit} free statement uploads this month. Upgrade to Business or Enterprise for unlimited uploads.`
      );
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    try {
      const result = await uploadStatement(selectedFile, setUploadProgress);
      setStatementResult(result);
      setCurrentStep('results');
      onStatementProcessed?.(result);
    } catch (error) {
      const message = error?.message || 'Unable to process the statement. Please try again.';
      Alert.alert('Processing Failed', message);
    } finally {
      setIsProcessing(false);
      // Every attempt (success or failure) counts against the monthly
      // limit server-side, so refresh the countdown regardless of outcome.
      loadUploadUsage();
    }
  };


  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  };

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `$${Math.round(amount).toLocaleString('en-US')}`;
  };

  const formatDateShort = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatPeriodLabel = (result) => {
    if (!result) return '';
    const start = formatDateShort(result.periodStart);
    const end = formatDateShort(result.periodEnd);
    const count = result.transactionCount ?? 0;
    if (!start || !end) return `${count} Transaction${count === 1 ? '' : 's'}`;
    return `Period : ${start} - ${end} - ${count} Transaction${count === 1 ? '' : 's'}`;
  };

  const handleBackPress = () => {
    if (currentStep === 'results') {
      setCurrentStep('upload');
    } else if (onBack) {
      onBack();
    } else if (onTabPress) {
      onTabPress('home');
    }
  };

  const fileName = selectedFile?.name || 'BCA_Statement_JanFeb2026.pdf';

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

            <Text style={styles.headerTitle}>
              {currentStep === 'results' ? 'Results' : 'Upload E-statement'}
            </Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* STEP 1: UPLOAD E-STATEMENT VIEW */}
          {currentStep === 'upload' ? (
            <>
              {/* Section Headline */}
              <View style={styles.headlineSection}>
                <Text style={styles.mainTitle}>Automatic Cashflow Parsing</Text>
                <Text style={styles.mainSubtitle}>
                  Upload bank PDF statement to automatically calculate your daily burn rate.
                </Text>
              </View>

              {/* Upload Tries Countdown (free tier only; hidden for unlimited plans) */}
              {!isLoadingUsage && uploadUsage && !uploadUsage.unlimited ? (
                <View
                  style={[
                    styles.usageBadge,
                    hasReachedUploadLimit && styles.usageBadgeExhausted,
                  ]}
                >
                  <Text
                    style={[
                      styles.usageBadgeText,
                      hasReachedUploadLimit && styles.usageBadgeTextExhausted,
                    ]}
                  >
                    {hasReachedUploadLimit
                      ? `You've used all ${uploadUsage.limit} free uploads this month`
                      : `${uploadUsage.remaining} of ${uploadUsage.limit} free uploads left this month`}
                  </Text>
                </View>
              ) : null}

              {/* File Input Box (Dropzone) */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePickDocument}
                disabled={hasReachedUploadLimit}
                style={[
                  styles.dropzoneBox,
                  selectedFile && styles.dropzoneBoxActive,
                  hasReachedUploadLimit && styles.dropzoneBoxDisabled,
                ]}
              >
                {selectedFile ? (
                  <View style={styles.fileSelectedContent}>
                    <View style={styles.checkIconWrapper}>
                      <CheckCircleIcon size={32} color="#1F6F5F" />
                    </View>
                    <Text numberOfLines={1} style={styles.fileNameText}>
                      {selectedFile.name}
                    </Text>
                    <Text style={styles.fileSizeText}>
                      {formatFileSize(selectedFile.size)} • Tap to change file
                    </Text>
                  </View>
                ) : (
                  <View style={styles.dropzoneEmptyContent}>
                    <View style={styles.docIconWrapper}>
                      <DocumentOutlineIcon size={36} color="#1F6F5F" />
                    </View>
                    <Text style={styles.uploadPromptText}>
                      Upload Your E-Statement Here
                    </Text>
                    <Text style={styles.supportedFormatsText}>
                      Supports All Banks (PDF max 10MB)
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Sample Statement Button (for judges/reviewers without a real bank PDF) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleUseSampleStatement}
                disabled={hasReachedUploadLimit}
                style={[styles.sampleButton, hasReachedUploadLimit && styles.sampleButtonDisabled]}
              >
                <DocumentOutlineIcon size={16} color="#1F6F5F" />
                <Text style={styles.sampleButtonText}>Use Sample Statement (Demo)</Text>
              </TouchableOpacity>

              {/* Upload Progress Indicator */}
              {isProcessing ? (
                <View style={styles.progressWrapper}>
                  <CircularProgress percentage={uploadProgress} size={72} strokeWidth={7} />
                  <Text style={styles.progressLabel}>
                    {uploadProgress < 100 ? 'Uploading…' : 'Parsing statement…'}
                  </Text>
                </View>
              ) : null}

              {/* Process Statement Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title={hasReachedUploadLimit ? 'Upload Limit Reached' : 'Process Statement'}
                  variant="primary"
                  fullWidth
                  loading={isProcessing}
                  disabled={!selectedFile || isProcessing || hasReachedUploadLimit}
                  onPress={handleProcessStatement}
                />
              </View>
            </>
          ) : (
            /* STEP 2: STATEMENT RESULTS VIEW (Node 40:237) — populated from the
               real upload-statement response, no hardcoded figures. */
            <>
              {/* File Name Pill Badge */}
              <View style={styles.fileBadge}>
                <DocumentOutlineIcon size={18} color="#1F6F5F" />
                <Text numberOfLines={1} style={styles.fileBadgeText}>
                  {fileName}
                </Text>
              </View>

              {/* Period & Transaction Subtitle */}
              <Text style={styles.periodText}>
                {formatPeriodLabel(statementResult)}
              </Text>

              {/* Metrics Row: Monthly Avg Expense & Monthly Avg Revenue */}
              <View style={styles.metricsRow}>
                {/* Monthly Average Expense (baseline for daily burn) */}
                <View style={styles.metricCard}>
                  <Text style={styles.metricCardTitle}>Avg Monthly Expense</Text>
                  <Text style={styles.metricCardValue}>
                    {formatCurrency(statementResult?.monthlyAvgExpense)}
                  </Text>
                  <Text style={styles.metricCardSubtitle}>/month</Text>
                </View>

                {/* Monthly Average Revenue */}
                <View style={styles.metricCard}>
                  <Text style={styles.metricCardTitle}>Avg Monthly Revenue</Text>
                  <Text style={styles.metricCardValue}>
                    {formatCurrency(statementResult?.monthlyAvgRevenue)}
                  </Text>
                  <Text style={styles.metricCardSubtitle}>/month</Text>
                </View>
              </View>

              {/* Top Expense Categories Section */}
              {statementResult?.topExpenseCategories?.length ? (
                <>
                  <Text style={styles.expenseSectionTitle}>Top Expense Categories</Text>
                  <View style={styles.expenseCategoriesList}>
                    {statementResult.topExpenseCategories.map((item) => (
                      <View key={item.category} style={styles.categoryCard}>
                        {/* Circular Progress Ring */}
                        <CircularProgress percentage={item.percentage} size={60} strokeWidth={6} />

                        {/* Category Label & Amount */}
                        <View style={styles.categoryInfo}>
                          <Text style={styles.categoryName}>{item.category}</Text>
                          <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.resultsButtonGroup}>
                {/* Primary Button: Go to Dashboard */}
                <Button
                  title="Go to Dashboard"
                  variant="primary"
                  fullWidth
                  onPress={() => onTabPress && onTabPress('home')}
                />

                {/* Secondary Button: Simulate What-if Now */}
                <Button
                  title="Simulate What-if Now"
                  variant="outline"
                  fullWidth
                  style={styles.simulateWhatIfButton}
                  onPress={() => onTabPress && onTabPress('prediction', {
                    fromStatement: true,
                    averageMonthlyRevenue: statementResult?.monthlyAvgRevenue,
                    averageMonthlyExpenses: statementResult?.monthlyAvgExpense,
                  })}
                />
              </View>
            </>
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
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 110,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  headerPlaceholder: {
    width: 34,
  },
  headlineSection: {
    width: '100%',
    maxWidth: 353,
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  mainSubtitle: {
    fontSize: 12,
    color: 'rgba(130, 130, 130, 0.95)',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 294,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  dropzoneBox: {
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    width: '100%',
    maxWidth: 353,
    minHeight: 183,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 32,
  },
  dropzoneBoxActive: {
    backgroundColor: '#F0FAF5',
    borderColor: '#1F6F5F',
  },
  dropzoneBoxDisabled: {
    opacity: 0.5,
  },
  usageBadge: {
    width: '100%',
    maxWidth: 353,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6FCF97',
    backgroundColor: '#E8F8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  usageBadgeExhausted: {
    borderColor: '#FFD6D6',
    backgroundColor: '#FFF5F5',
  },
  usageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6F5F',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  usageBadgeTextExhausted: {
    color: '#EB5757',
  },
  dropzoneEmptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconWrapper: {
    marginBottom: 12,
  },
  uploadPromptText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  supportedFormatsText: {
    fontSize: 12,
    color: 'rgba(130, 130, 130, 0.95)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  fileSelectedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  checkIconWrapper: {
    marginBottom: 8,
  },
  fileNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: 260,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  fileSizeText: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 353,
  },
  sampleButton: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6FCF97',
    backgroundColor: '#E8F8F0',
    marginBottom: 16,
  },
  sampleButtonDisabled: {
    opacity: 0.5,
  },
  sampleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  progressWrapper: {
    width: '100%',
    maxWidth: 353,
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },

  // RESULTS VIEW STYLES
  fileBadge: {
    width: '100%',
    maxWidth: 353,
    height: 42,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  fileBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F6F5F',
    maxWidth: 270,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  periodText: {
    fontSize: 11,
    color: '#1F6F5F',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  metricsRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#E8F8F0',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 104,
  },
  metricCardTitle: {
    fontSize: 12,
    color: '#1F6F5F',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  metricCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F6F5F',
    marginVertical: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  metricCardSubtitle: {
    fontSize: 11,
    color: '#1F6F5F',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  expenseSectionTitle: {
    width: '100%',
    maxWidth: 353,
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
  expenseCategoriesList: {
    width: '100%',
    maxWidth: 353,
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6FCF97',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
      },
    }),
  },
  categoryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F6F5F',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  categoryAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  resultsButtonGroup: {
    width: '100%',
    maxWidth: 353,
    gap: 12,
    marginTop: 4,
  },
  simulateWhatIfButton: {
    backgroundColor: '#FFFFFF',
  },
});
