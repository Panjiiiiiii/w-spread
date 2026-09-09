import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  AppLogo,
  Button,
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
} from '../components';
import { loginWithEmail, registerWithEmail } from '../services/api';

export default function AuthScreen({
  onLoginSuccess,
  onRegisterSuccess,
}) {
  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Validation & Submission
  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert('Incomplete Form', 'Please enter your email and password.');
      return;
    }

    if (authMode === 'register') {
      if (!fullName.trim()) {
        Alert.alert('Incomplete Form', 'Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Password Mismatch', 'Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const userData = authMode === 'register'
        ? await registerWithEmail(trimmedEmail, password, fullName.trim())
        : await loginWithEmail(trimmedEmail, password);
      setIsLoading(false);
      if (authMode === 'register') {
        onRegisterSuccess?.(userData);
      } else {
        onLoginSuccess?.(userData);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Authentication Failed', error.message);
    }
  };

  // Google Sign-In Simulation
  const handleGoogleSignIn = () => {
    Alert.alert(
      'Google Sign-In',
      'Google Identity Services is not configured yet. Use email and password for now.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F3F3"
        translucent={Platform.OS === 'android'}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand Logo & App Name */}
          <View style={styles.brandHeader}>
            <View style={styles.logoWrapper}>
              <AppLogo size={80} borderRadius={20} />
            </View>

            <Text style={styles.appName}>W-Spread</Text>
            <Text style={styles.appTagline}>
              Financial Decision Support System for Runway & Cashflow
            </Text>
          </View>

          {/* Auth Card Container */}
          <View style={styles.authCard}>
            {/* Segmented Mode Switcher */}
            <View style={styles.modeSwitcher}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setAuthMode('login')}
                style={[
                  styles.modeOption,
                  authMode === 'login' && styles.modeOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.modeOptionText,
                    authMode === 'login' && styles.modeOptionTextActive,
                  ]}
                >
                  Log In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setAuthMode('register')}
                style={[
                  styles.modeOption,
                  authMode === 'register' && styles.modeOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.modeOptionText,
                    authMode === 'register' && styles.modeOptionTextActive,
                  ]}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Full Name (Only on Register) */}
              {authMode === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <UserIcon size={18} color="#1F6F5F" />
                    <TextInput
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="e.g. Adam Ghosling"
                      placeholderTextColor="#A0A0A0"
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <MailIcon size={18} color="#1F6F5F" />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <LockIcon size={18} color="#1F6F5F" />
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={authMode === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} color="#828282" />
                    ) : (
                      <EyeIcon size={18} color="#828282" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password (Only on Register) */}
              {authMode === 'register' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <LockIcon size={18} color="#1F6F5F" />
                    <TextInput
                      style={styles.textInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

              {/* Submit Button */}
              <View style={styles.submitBtnWrapper}>
                <Button
                  title={authMode === 'login' ? 'Log In' : 'Create Account'}
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  onPress={handleSubmit}
                />
              </View>
            </View>

            {/* Or Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              style={styles.googleButton}
            >
              <GoogleIcon size={20} />
              <Text style={styles.googleButtonText}>
                {authMode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}
              </Text>
            </TouchableOpacity>

            {/* Bottom Toggle Prompt */}
            <View style={styles.bottomPromptRow}>
              <Text style={styles.promptMutedText}>
                {authMode === 'login'
                  ? "Don't have an account yet?"
                  : 'Already have an account?'}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setAuthMode(authMode === 'login' ? 'register' : 'login')
                }
              >
                <Text style={styles.promptActionText}>
                  {authMode === 'login' ? ' Register' : ' Log In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms / Footer */}
          <Text style={styles.termsText}>
            By continuing, you agree to W-Spread Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1F6F5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 14px rgba(31, 111, 95, 0.15)',
      },
    }),
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F6F5F',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  appTagline: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  authCard: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E8F8F0',
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6FCF97',
  },
  modeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeOptionActive: {
    backgroundColor: '#1F6F5F',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  modeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F6F5F',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  modeOptionTextActive: {
    color: '#FFFFFF',
  },
  formFields: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6F5F',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: '#1F6F5F',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F6F5F',
    fontWeight: '500',
    padding: 0,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  eyeBtn: {
    padding: 4,
  },
  submitBtnWrapper: {
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#828282',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    gap: 10,
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
  googleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  bottomPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  promptMutedText: {
    fontSize: 12,
    color: '#828282',
  },
  promptActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F6F5F',
  },
  termsText: {
    fontSize: 10,
    color: '#A0A0A0',
    textAlign: 'center',
    maxWidth: 290,
    marginTop: 20,
    lineHeight: 15,
  },
});
