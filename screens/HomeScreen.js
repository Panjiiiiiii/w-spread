import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Navbar from '../components/Navbar';

export default function HomeScreen({
  activeTab: controlledActiveTab,
  onTabPress,
  navigation,
}) {
  const [internalTab, setInternalTab] = useState('home');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalTab;

  const handleTabPress = (tabKey) => {
    if (onTabPress) {
      onTabPress(tabKey);
    } else {
      setInternalTab(tabKey);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F3F3"
        translucent={Platform.OS === 'android'}
      />

      {/* Main Page Content Area */}
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>
            Your blank home page is ready. Start building your UI here!
          </Text>
        </View>

        {/* Floating Fixed Bottom-Middle Navbar */}
        <Navbar
          activeTab={activeTab}
          onTabPress={handleTabPress}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    // Bottom padding so content is not obscured by the floating navbar
    paddingBottom: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F6F5F',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 14,
    color: '#828282',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Poppins, sans-serif',
    }),
  },
});
