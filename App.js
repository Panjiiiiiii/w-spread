import React, { useState } from 'react';
import {
  AuthScreen,
  HomeScreen,
  PredictionScreen,
  EStatementScreen,
  ProfileScreen,
  MembershipScreen,
  LogHistoryScreen,
} from './screens';

const INITIAL_LOGS = [
  {
    id: 'log-1',
    type: 'prediction',
    title: 'Runway Extended: 162 Days (+20 days)',
    description: 'Scenario test: Cut expenses by 20%, injected $10.000 capital, and paused hiring.',
    timestamp: 'Today, 14:32',
    params: {
      cutExpense: 20,
      injectCapital: '10.000',
      freezeHiring: true,
      simulatedDays: 162,
      diffDays: 20,
    },
  },
  {
    id: 'log-2',
    type: 'estatement',
    title: 'Expense Breakdown Analyzed (BCA_JanFeb2026.pdf)',
    description: 'Categorized $120.000 total burn rate across Operations, Marketing, and Software.',
    timestamp: 'Yesterday, 10:15',
    params: {
      fileName: 'BCA_Statement_JanFeb2026.pdf',
      totalAmount: '$ 120.000',
    },
  },
  {
    id: 'log-3',
    type: 'prediction',
    title: 'Runway Extended: 194 Days (+52 days)',
    description: 'Aggressive burn reduction: Cut expenses by 80% with $20.000.000 capital infusion.',
    timestamp: '02 Sep 2026, 16:40',
    params: {
      cutExpense: 80,
      injectCapital: '20.000.000',
      freezeHiring: true,
      simulatedDays: 194,
      diffDays: 52,
    },
  },
  {
    id: 'log-4',
    type: 'estatement',
    title: 'Expense Breakdown Analyzed (Mandiri_Corporate_Q3.pdf)',
    description: 'Analyzed corporate burn: Identified 50% allocation to payroll and operations.',
    timestamp: '28 Aug 2026, 11:20',
    params: {
      fileName: 'Mandiri_Corporate_Q3.pdf',
      totalAmount: '$ 85.000',
    },
  },
];

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

  // Prediction Parameters
  const [predictionParams, setPredictionParams] = useState({
    step: 'simulation',
    cutExpense: 20,
    injectCapital: '10.000',
    freezeHiring: true,
  });

  // E-Statement Parameters
  const [estatementParams, setEstatementParams] = useState({
    step: 'upload',
    fileName: 'BCA_Statement_JanFeb2026.pdf',
  });

  // Activity Logs State
  const [activityLogs, setActivityLogs] = useState(INITIAL_LOGS);

  const handleAddLog = (newLog) => {
    const logItem = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      ...newLog,
    };
    setActivityLogs((prev) => [logItem, ...prev]);
  };

  const handleClearLogs = () => {
    setActivityLogs([]);
  };

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
    } else if (tabKey === 'estatement') {
      if (params && params.step) {
        setEstatementParams({
          step: params.step,
          fileName: params.fileName || 'BCA_Statement_JanFeb2026.pdf',
        });
      } else {
        setEstatementParams({
          step: 'upload',
          fileName: 'BCA_Statement_JanFeb2026.pdf',
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
            onLogCreated={handleAddLog}
          />
        );
      case 'estatement':
        return (
          <EStatementScreen
            key={`estatement-${estatementParams.step}-${estatementParams.fileName}`}
            activeTab={activeTab}
            onTabPress={handleTabPress}
            initialStep={estatementParams.step}
            initialFileName={estatementParams.fileName}
            onLogCreated={handleAddLog}
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
      case 'logs':
        return (
          <LogHistoryScreen
            activeTab="profile"
            onTabPress={handleTabPress}
            onBack={() => setActiveTab('profile')}
            logs={activityLogs}
            onSelectLog={(log) => {
              if (log.type === 'prediction') {
                handleTabPress('prediction', {
                  step: 'results',
                  cutExpense: log.params?.cutExpense ?? 20,
                  injectCapital: log.params?.injectCapital ?? '10.000',
                  freezeHiring: log.params?.freezeHiring ?? true,
                  simulatedDays: log.params?.simulatedDays ?? 162,
                });
              } else if (log.type === 'estatement') {
                handleTabPress('estatement', {
                  step: 'results',
                  fileName: log.params?.fileName || 'BCA_Statement_JanFeb2026.pdf',
                });
              }
            }}
            onClearLogs={handleClearLogs}
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
            onViewLogs={() => setActiveTab('logs')}
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

