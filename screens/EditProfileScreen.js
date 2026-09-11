import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeftIcon, CheckCircleIcon } from '../components';

export default function EditProfileScreen({
  imageUri,
  onSave,
  onBack,
}) {
  const [selectedImageUri, setSelectedImageUri] = useState(imageUri);
  const [selectedImageMetadata, setSelectedImageMetadata] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChooseImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Allow photo library access to choose a profile image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const asset = result.assets[0];
      setSelectedImageUri(asset.uri);
      setSelectedImageMetadata({
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        base64: asset.base64,
      });
    }
  };

  const handleSave = async () => {
    if (!selectedImageUri) {
      Alert.alert('Choose an Image', 'Select a profile image before saving.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave?.(selectedImageUri, selectedImageMetadata);
    } catch (error) {
      Alert.alert('Upload Failed', error.message || 'Unable to update your profile photo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F3F3"
        translucent={Platform.OS === 'android'}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeftIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile Photo</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.photoCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={selectedImageUri ? { uri: selectedImageUri } : require('../assets/avatar.png')}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.title}>Choose your profile image</Text>
          <Text style={styles.subtitle}>
            Use a clear square image so your profile looks consistent across W-Spread.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleChooseImage}
            style={styles.chooseButton}
          >
            <Text style={styles.chooseButtonText}>Choose from Library</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveButton}
        >
          <CheckCircleIcon size={19} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F3F3' },
  content: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    maxWidth: 353,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1F6F5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1F6F5F' },
  headerPlaceholder: { width: 34 },
  photoCard: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 144,
    height: 144,
    borderRadius: 72,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#E8F8F0',
    marginBottom: 20,
  },
  avatarImage: { width: '100%', height: '100%' },
  title: { fontSize: 18, fontWeight: '700', color: '#1F6F5F', marginBottom: 8 },
  subtitle: { fontSize: 12, lineHeight: 18, color: '#6B6B6B', textAlign: 'center' },
  chooseButton: {
    marginTop: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6FCF97',
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  chooseButtonText: { color: '#1F6F5F', fontSize: 13, fontWeight: '600' },
  saveButton: {
    width: '100%',
    maxWidth: 353,
    height: 48,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#1F6F5F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
