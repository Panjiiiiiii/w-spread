import React, { useState } from 'react';
import {
  HomeScreen,
  PredictionScreen,
  EStatementScreen,
  ProfileScreen,
  MembershipScreen,
} from './screens';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // User Profile & Membership State
  const [membershipInfo, setMembershipInfo] = useState({
    role: 'The Owner',
    validDays: 19,
    totalDays: 365,
    expiryDate: '27 Aug 2027',
  });

  const [predictionParams, setPredictionParams] = useState({
    step: 'simulation',
    cutExpense: 20,
    injectCapital: '10.000',
    freezeHiring: true,
  });

  const handleTabPress = (tabKey, params) => {
    if (tabKey === 'prediction') {
      if (params && params.step) {
        // Explicit step passed (e.g. step='results' from modal simulation)
        setPredictionParams({
          step: params.step,
          cutExpense: params.cutExpense !== undefined ? params.cutExpense : 80,
          injectCapital: params.injectCapital !== undefined ? params.injectCapital : '20.000.000',
          freezeHiring: params.freezeHiring !== undefined ? params.freezeHiring : true,
        });
      } else {
        // Normal navbar tab click: ALWAYS open the first input page ('simulation')
        setPredictionParams({
          step: 'simulation',
          cutExpense: 20,
          injectCapital: '10.000',
          freezeHiring: true,
        });
      }
    }
    setActiveTab(tabKey);
  };

  const handleMembershipUpgraded = (upgradeData) => {
    setMembershipInfo((prev) => ({
      ...prev,
      role: upgradeData.role || 'The Business Owner',
      validDays: 365,
      expiryDate: '31 Aug 2028',
    }));
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'prediction':
        return (
          <PredictionScreen
            key={`prediction-${predictionParams.step}-${predictionParams.cutExpense}-${predictionParams.injectCapital}`}
            activeTab={activeTab}
            onTabPress={handleTabPress}
            initialStep={predictionParams.step}
            initialCutExpense={predictionParams.cutExpense}
            initialInjectCapital={predictionParams.injectCapital}
            initialFreezeHiring={predictionParams.freezeHiring}
          />
        );
      case 'estatement':
        return (
          <EStatementScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      case 'membership':
        return (
          <MembershipScreen
            activeTab="profile"
            onTabPress={handleTabPress}
            onBack={() => setActiveTab('profile')}
            onMembershipUpgraded={handleMembershipUpgraded}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            role={membershipInfo.role}
            validDays={membershipInfo.validDays}
            totalDays={membershipInfo.totalDays}
            expiryDate={membershipInfo.expiryDate}
            onExtendMembership={() => setActiveTab('membership')}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            onSimulateRunway={(params) => handleTabPress('prediction', params)}
          />
        );
    }
  };

  return renderCurrentScreen();
}
