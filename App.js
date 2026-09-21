import React, { useState } from 'react';
import {
  AuthScreen,
  HomeScreen,
  PredictionScreen,
  EStatementScreen,
  ProfileScreen,
  MembershipScreen,
  LogHistoryScreen,
  EditProfileScreen,
} from './screens';
import Purchases from 'react-native-purchases';
import {
  clearSession,
  createPrediction,
  getMyMembership,
  getPredictionHistory,
  linkRevenueCatUser,
  updateProfileImage,
} from './services/api';
import {
  configureRevenueCat,
  getSubscriptionTier,
} from './services/revenueCat';

// Tier ranking used to decide whether the RevenueCat SDK's live entitlement
// should win over whatever the backend reports (see refreshMembership below).
const TIER_RANK = { enterprise: 2, business: 1 };
const tierRank = (tier) => TIER_RANK[tier] || 0;

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: 'Adam Ghosling',
    email: 'adam@example.com',
  });

  const [activeTab, setActiveTab] = useState('home');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);

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
    averageMonthlyRevenue: null,
    averageMonthlyExpenses: null,
  });

  // E-Statement Parameters
  const [estatementParams, setEstatementParams] = useState({
    step: 'upload',
    fileName: 'BCA_Statement_JanFeb2026.pdf',
  });

  // Activity Logs State
  const [activityLogs, setActivityLogs] = useState([]);

  const loadPredictionHistory = async () => {
    try {
      const predictions = await getPredictionHistory();
      const logs = predictions.map((prediction) => ({
        id: prediction.id,
        type: 'prediction',
        title: `Projected Balance: Rp${Number(prediction.predictedBalance || 0).toLocaleString('id-ID')}`,
        description: `${prediction.timeframeMonths}-month forecast with ${prediction.riskLevel} risk.`,
        timestamp: new Date(prediction.createdAt).toLocaleString(),
        params: { prediction },
      }));
      setActivityLogs(logs);
      if (predictions[0]) setLatestPrediction(predictions[0]);
    } catch (error) {
      setActivityLogs([]);
      console.warn('Prediction history refresh failed:', error.message);
    }
  };

  const handlePredictionCreated = async (prediction) => {
    setLatestPrediction(prediction);
    await loadPredictionHistory();
  };

  // Derives "days of runway" from the latest server prediction so the Home
  // screen's Hero Runway Card reflects real data instead of a static
  // placeholder. Runway = current balance / average daily burn, where daily
  // burn is the shortfall between average monthly expenses and revenue.
  const getRunwayFromPrediction = (prediction) => {
    if (!prediction) return null;
    const currentBalance = Number(prediction.currentBalance || 0);
    const monthlyBurn = Math.max(
      0,
      Number(prediction.averageMonthlyExpenses || 0) - Number(prediction.averageMonthlyRevenue || 0)
    );
    if (monthlyBurn <= 0) return { days: 999, statusText: 'Safe zone (profitable)', statusType: 'safe' };

    const dailyBurn = monthlyBurn / 30.4375;
    const days = Math.max(0, Math.round(currentBalance / dailyBurn));
    if (days < 30) return { days, statusText: `Danger zone (< 30 Days)`, statusType: 'danger' };
    if (days < 90) return { days, statusText: `Caution zone (< 90 Days)`, statusType: 'warning' };
    return { days, statusText: 'Safe zone (> 90 Days)', statusType: 'safe' };
  };

  // Called right after EStatementScreen successfully parses a PDF upload.
  // The parsed transactions are already persisted server-side (feeding the
  // same `Transaction` table the prediction engine reads), so triggering a
  // fresh prediction here immediately reflects the new statement data in the
  // Home screen's balance breakdown and the Prediction engine's baseline,
  // without waiting for the user to manually revisit either screen.
  const handleStatementProcessed = async (statementResult) => {
    setPredictionParams((prev) => ({
      ...prev,
      averageMonthlyRevenue: statementResult?.monthlyAvgRevenue ?? prev.averageMonthlyRevenue,
      averageMonthlyExpenses: statementResult?.monthlyAvgExpense ?? prev.averageMonthlyExpenses,
    }));
    try {
      const prediction = await createPrediction({ timeframeMonths: 12, payrollImpact: 0, vendorImpact: 0 });
      await handlePredictionCreated(prediction);
    } catch (error) {
      console.warn('Auto-prediction after statement upload failed:', error.message);
    }
  };

  // Login handler -> direct to Home / Dashboard
  const handleLoginSuccess = async (userData) => {
    setProfileImageUri(userData?.imageUrl || null);
    if (userData?.name) {
      setUser((prev) => ({ ...prev, ...userData }));
    }
    try {
      const customerInfo = await configureRevenueCat(userData?.id || userData?.email);
      await linkRevenueCatUser(userData?.id || userData?.email);
      setSubscriptionTier(getSubscriptionTier(customerInfo));
    } catch (error) {
      console.warn('RevenueCat initialization failed:', error.message);
      setSubscriptionTier(null);
    }
    await refreshMembership(3);
    await loadPredictionHistory();
    setIsAuthenticated(true);
    setIsOnboarding(false);
    setActiveTab('home');
  };

  // Register handler -> redirect to Membership page (with skip option)
  const handleRegisterSuccess = async (userData) => {
    setProfileImageUri(userData?.imageUrl || null);
    if (userData?.name) {
      setUser((prev) => ({ ...prev, ...userData }));
    }
    try {
      const customerInfo = await configureRevenueCat(userData?.id || userData?.email);
      await linkRevenueCatUser(userData?.id || userData?.email);
      setSubscriptionTier(getSubscriptionTier(customerInfo));
    } catch (error) {
      console.warn('RevenueCat initialization failed:', error.message);
      setSubscriptionTier(null);
    }
    await refreshMembership(3);
    await loadPredictionHistory();
    setIsAuthenticated(true);
    setIsOnboarding(true);
    setActiveTab('membership');
  };

  // RevenueCat's own CustomerInfo is the source of truth for what a user is
  // currently entitled to on their device (see
  // https://www.revenuecat.com/docs/getting-started/entitlements). The
  // backend's /memberships/me is populated asynchronously by RevenueCat's
  // webhook and can lag or be empty (misconfigured secret, delivery delay,
  // webhook never fired in sandbox, etc). So: fetch both, and let a live SDK
  // entitlement win over a null/lower tier from the backend. Only the
  // backend's role/day-count metadata is used for display details.
  const refreshMembership = async (retries = 0) => {
    let liveTier = null;
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      liveTier = getSubscriptionTier(customerInfo);
    } catch (error) {
      console.warn('Live RevenueCat entitlement check failed:', error.message);
    }

    try {
      const membership = await getMyMembership();
      const backendTier = membership?.tier || null;

      if (!backendTier && !liveTier && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return refreshMembership(retries - 1);
      }

      // Live RevenueCat entitlement wins over a null/lower backend tier.
      const resolvedTier = tierRank(liveTier) > tierRank(backendTier) ? liveTier : backendTier;
      setSubscriptionTier(resolvedTier || null);

      setMembershipInfo((prev) => {
        if (resolvedTier && resolvedTier !== backendTier) {
          // Backend hasn't caught up yet (webhook/sync still pending) —
          // keep an optimistic role for the tier we already know is active
          // instead of wiping it out with the backend's stale/empty data.
          return {
            ...prev,
            role: resolvedTier === 'enterprise' ? 'The Enterprise' : 'The Business Owner',
          };
        }
        return {
          ...prev,
          role: membership?.role || 'The Owner',
          validDays: membership?.validDays || 0,
          totalDays: membership?.totalDays || 0,
          expiryDate: membership?.expiresAt
            ? new Date(membership.expiresAt).toLocaleDateString()
            : 'No active membership',
        };
      });
    } catch (error) {
      console.warn('Membership refresh failed:', error.message);
      // Backend call failed entirely — still trust a live entitlement if we have one.
      if (liveTier) {
        setSubscriptionTier((prev) => (tierRank(liveTier) > tierRank(prev) ? liveTier : prev));
      }
    }
  };

  // Log Out handler -> back to AuthScreen
  const handleLogOut = () => {
    clearSession();
    setIsAuthenticated(false);
    setSubscriptionTier(null);
    setLatestPrediction(null);
    setActivityLogs([]);
    setMembershipInfo((prev) => ({ ...prev, role: 'The Owner', validDays: 0, totalDays: 0, expiryDate: 'No active membership' }));
    setIsOnboarding(false);
    setActiveTab('home');
  };

  const handleSaveProfileImage = async (imageUri, imageMetadata) => {
    const userData = await updateProfileImage(imageUri, imageMetadata);
    const imageUrl = userData?.imageUrl || imageUri;
    setProfileImageUri(imageUrl);
    if (userData) {
      setUser((prev) => ({ ...prev, ...userData }));
    }
    setActiveTab('profile');
  };

  const handleTabPress = (tabKey, params) => {
    if (tabKey === 'prediction') {
      const isViewingSavedResult = params?.step === 'results';
      if (!subscriptionTier && !isViewingSavedResult) {
        setIsOnboarding(false);
        setActiveTab('membership');
        return;
      }
      if (params && params.step) {
        setPredictionParams((prev) => ({
          step: params.step,
          cutExpense: params.cutExpense !== undefined ? params.cutExpense : 80,
          injectCapital: params.injectCapital !== undefined ? params.injectCapital : '20.000.000',
          freezeHiring: params.freezeHiring !== undefined ? params.freezeHiring : true,
          prediction: params.prediction,
          averageMonthlyRevenue: params.averageMonthlyRevenue ?? prev.averageMonthlyRevenue,
          averageMonthlyExpenses: params.averageMonthlyExpenses ?? prev.averageMonthlyExpenses,
        }));
      } else if (params?.fromStatement) {
        // Navigated from EStatementScreen's "Simulate What-if Now" — keep the
        // statement-derived averages already stashed in predictionParams,
        // just reset the step to the simulation form.
        setPredictionParams((prev) => ({
          ...prev,
          step: 'simulation',
          averageMonthlyRevenue: params.averageMonthlyRevenue ?? prev.averageMonthlyRevenue,
          averageMonthlyExpenses: params.averageMonthlyExpenses ?? prev.averageMonthlyExpenses,
        }));
      } else {
        setPredictionParams((prev) => ({
          step: 'simulation',
          cutExpense: 20,
          injectCapital: '10.000',
          freezeHiring: true,
          prediction: null,
          averageMonthlyRevenue: prev.averageMonthlyRevenue,
          averageMonthlyExpenses: prev.averageMonthlyExpenses,
        }));
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
    const tier = upgradeData.tier || subscriptionTier;
    setMembershipInfo((prev) => ({
      ...prev,
      role: tier === 'enterprise' ? 'The Enterprise' : tier === 'business' ? 'The Business Owner' : 'The Owner',
      validDays: 365,
      expiryDate: '31 Aug 2028',
    }));
    setIsOnboarding(false);
    void refreshMembership(3);
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
            onPredictionCreated={handlePredictionCreated}
            initialPrediction={predictionParams.prediction}
            initialAverageMonthlyRevenue={predictionParams.averageMonthlyRevenue}
            initialAverageMonthlyExpenses={predictionParams.averageMonthlyExpenses}
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
            onStatementProcessed={handleStatementProcessed}
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
            subscriptionTier={subscriptionTier}
            onSubscriptionChanged={setSubscriptionTier}
            onManageSubscription={async () => {
                      await refreshMembership();
            }}
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
                if (log.params?.prediction) {
                  setLatestPrediction(log.params.prediction);
                }
                handleTabPress('prediction', {
                  step: 'results',
                  cutExpense: log.params?.cutExpense ?? 20,
                  injectCapital: log.params?.injectCapital ?? '10.000',
                  freezeHiring: log.params?.freezeHiring ?? true,
                  simulatedDays: log.params?.simulatedDays ?? 162,
                  prediction: log.params?.prediction,
                });
              } else if (log.type === 'estatement') {
                handleTabPress('estatement', {
                  step: 'results',
                  fileName: log.params?.fileName || 'BCA_Statement_JanFeb2026.pdf',
                });
              }
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userName={user.name}
            profileImageUri={profileImageUri}
            role={membershipInfo.role}
            validDays={membershipInfo.validDays}
            totalDays={membershipInfo.totalDays}
            expiryDate={membershipInfo.expiryDate}
            onExtendMembership={() => {
              setIsOnboarding(false);
              setActiveTab('membership');
            }}
            onViewLogs={() => setActiveTab('logs')}
            onEditProfile={() => setActiveTab('edit-profile')}
            onLogOut={handleLogOut}
          />
        );
      case 'edit-profile':
        return (
          <EditProfileScreen
            imageUri={profileImageUri}
            onBack={() => setActiveTab('profile')}
            onSave={handleSaveProfileImage}
          />
        );
      case 'home': {
        const runway = getRunwayFromPrediction(latestPrediction);
        return (
          <HomeScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userName={user.name}
            profileImageUri={profileImageUri}
            cashAmount={latestPrediction ? Number(latestPrediction.predictedBalance || 0).toLocaleString('id-ID') : undefined}
            runwayDays={runway ? runway.days : undefined}
            runwayStatusText={runway ? runway.statusText : undefined}
            runwayStatusType={runway ? runway.statusType : undefined}
            onSimulateRunway={(params) => handleTabPress('prediction', params)}
          />
        );
      }
      default:
        return (
          <HomeScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
            userName={user.name}
            profileImageUri={profileImageUri}
            cashAmount={latestPrediction ? Number(latestPrediction.predictedBalance || 0).toLocaleString('id-ID') : undefined}
            onSimulateRunway={(params) => handleTabPress('prediction', params)}
          />
        );
    }
  };

  return renderCurrentScreen();
}
