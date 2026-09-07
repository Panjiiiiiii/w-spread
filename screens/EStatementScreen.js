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
import {
  Navbar,
  Button,
  DocumentOutlineIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CircularProgress,
} from '../components';

const EXPENSE_CATEGORIES = [
  {
    key: 'operations',
    name: 'Operations & Payroll',
    amount: '$ 60.000',
    percentage: 50,
  },
  {
    key: 'marketing',
    name: 'Marketing & Ads',
    amount: '$ 40.000',
    percentage: 30,
  },
  {
    key: 'software',
    name: 'Software & Utilities',
    amount: '$ 20.000',
    percentage: 20,
  },
];

export default function EStatementScreen({
  activeTab = 'estatement',
  onTabPress,
  onBack,
  initialStep = 'upload',
  initialFileName,
  onLogCreated,
}) {
  // 'upload' or 'results' step
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (initialStep) setCurrentStep(initialStep);
  }, [initialStep]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.ms-excel', 'text/csv'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
      }
    } catch (err) {
      console.log('Error picking document:', err);
      Alert.alert('Error', 'Unable to pick document. Please try again.');
    }
  };

  const handleProcessStatement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('results');

      if (onLogCreated) {
        const fileLabel = selectedFile?.name || initialFileName || 'BCA_Statement_JanFeb2026.pdf';
        onLogCreated({
          type: 'estatement',
          title: `Expense Breakdown Analyzed (${fileLabel})`,
          description: 'Calculated burn rate breakdown: Payroll (50%), Marketing (30%), Utilities (20%).',
          params: {
            fileName: fileLabel,
            totalAmount: '$ 120.000',
          },
        });
      }
    }, 1000);
  };


  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
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

              {/* File Input Box (Dropzone) */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePickDocument}
                style={[
                  styles.dropzoneBox,
                  selectedFile && styles.dropzoneBoxActive,
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

              {/* Process Statement Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Process Statement"
                  variant="primary"
                  fullWidth
                  loading={isProcessing}
                  onPress={handleProcessStatement}
                />
              </View>
            </>
          ) : (
            /* STEP 2: STATEMENT RESULTS VIEW (Node 40:237) */
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
                Period : 01 Jan 2026 - 28 Feb 2026 - 240 Transaction
              </Text>

              {/* Metrics Row: Calculated Daily Burn & Detected Cash Balance */}
              <View style={styles.metricsRow}>
                {/* Calculated Daily Burn */}
                <View style={styles.metricCard}>
                  <Text style={styles.metricCardTitle}>Calculated Daily Burn</Text>
                  <Text style={styles.metricCardValue}>$6.000</Text>
                  <Text style={styles.metricCardSubtitle}>/day</Text>
                </View>

                {/* Detected Cash Balance */}
                <View style={styles.metricCard}>
                  <Text style={styles.metricCardTitle}>Detected Cash Balance</Text>
                  <Text style={styles.metricCardValue}>$15.000</Text>
                  <Text style={styles.metricCardSubtitle}>Ending Balance</Text>
                </View>
              </View>

              {/* Top Expense Categories Section */}
              <Text style={styles.expenseSectionTitle}>Top Expense Categories</Text>

              <View style={styles.expenseCategoriesList}>
                {EXPENSE_CATEGORIES.map((item) => (
                  <View key={item.key} style={styles.categoryCard}>
                    {/* Circular Progress Ring */}
                    <CircularProgress percentage={item.percentage} size={60} strokeWidth={6} />

                    {/* Category Label & Amount */}
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{item.name}</Text>
                      <Text style={styles.categoryAmount}>{item.amount}</Text>
                    </View>
                  </View>
                ))}
              </View>

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
                  onPress={() => onTabPress && onTabPress('prediction')}
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
