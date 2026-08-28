import React, { useState } from 'react';
import {
  HomeScreen,
  PredictionScreen,
  EStatementScreen,
  ProfileScreen,
} from './screens';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'prediction':
        return (
          <PredictionScreen
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        );
      case 'estatement':
        return (
          <EStatementScreen
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        );
    }
  };

  return renderCurrentScreen();
}
