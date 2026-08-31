import React, { useState } from 'react';
import {
  HomeScreen,
  PredictionScreen,
  EStatementScreen,
  ProfileScreen,
} from './screens';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
      case 'profile':
        return (
          <ProfileScreen
            activeTab={activeTab}
            onTabPress={handleTabPress}
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
