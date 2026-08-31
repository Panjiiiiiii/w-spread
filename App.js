import React, { useState } from 'react';
import {
  AuthScreen,
  HomeScreen,
  PredictionScreen,
  EStatementScreen,
  ProfileScreen,
  MembershipScreen,
} from './screens';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: 'Adam Ghosling',
    email: 'adam@example.com',
  });

  const [activeTab, setActiveTab] = useState('home');
  const [isOnboarding, setIsOnboarding] = useState(false);

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

  // Login handler -> direct to Home / Dashboard
  const handleLoginSuccess = (userData) => {
    if (userData?.name) {
      setUser((prev) => ({ ...prev, ...userData }));
    }
    setIsAuthenticated(true);
    setIsOnboarding(false);
    setActiveTab('home');
  };

  // Register handler -> redirect to Membership page (with skip option)
  const handleRegisterSuccess = (userData) => {
    if (userData?.name) {
      setUser((prev) => ({ ...prev, ...userData }));
    }
    setIsAuthenticated(true);
    setIsOnboarding(true);
    setActiveTab('membership');
  };

  // Log Out handler -> back to AuthScreen
  const handleLogOut = () => {
    setIsAuthenticated(false);
    setIsOnboarding(false);
    setActiveTab('home');
  };

  const handleTabPress = (tabKey, params) => {
    if (tabKey === 'prediction') {
      if (params && params.step) {
        setPredictionParams({
          step: params.step,
          cutExpense: params.cutExpense !== undefined ? params.cutExpense : 80,
          injectCapital: params.injectCapital !== undefined ? params.injectCapital : '20.000.000',
          freezeHiring: params.freezeHiring !== undefined ? params.freezeHiring : true,
        });
      } else {
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
    setIsOnboarding(false);
  };

  // If not authenticated, render AuthScreen
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

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
            onBack={() => {
              setIsOnboarding(false);
              setActiveTab('profile');
            }}
            isOnboarding={isOnboarding}
            onSkipToDashboard={() => {
              setIsOnboarding(false);
              setActiveTab('home');
            }}
            onMembershipUpgraded={handleMembershipUpgraded}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userName={user.name}
            role={membershipInfo.role}
            validDays={membershipInfo.validDays}
            totalDays={membershipInfo.totalDays}
            expiryDate={membershipInfo.expiryDate}
            onExtendMembership={() => {
              setIsOnboarding(false);
              setActiveTab('membership');
            }}
            onLogOut={handleLogOut}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userName={user.name}
            onSimulateRunway={(params) => handleTabPress('prediction', params)}
          />
        );
    }
  };

  return renderCurrentScreen();
}
