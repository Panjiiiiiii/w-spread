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
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  Navbar,
  Button,
  DocumentOutlineIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '../components';

export default function EStatementScreen({
  activeTab = 'estatement',
  onTabPress,
  onBack,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (!selectedFile) {
      Alert.alert(
        'No File Selected',
        'Please upload an e-statement PDF first before processing.'
      );
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Statement Processed! 🎉',
        `Successfully analyzed ${selectedFile.name}. Cashflow and burn rate have been updated.`,
        [
          {
            text: 'View Results',
            onPress: () => {
              if (onTabPress) onTabPress('home');
            },
          },
        ]
      );
    }, 1500);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else if (onTabPress) {
      onTabPress('home');
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

            <Text style={styles.headerTitle}>Upload E-statement</Text>
            <View style={styles.headerPlaceholder} />
          </View>

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
    marginBottom: 32,
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
});
