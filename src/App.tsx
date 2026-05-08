/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Shell from './components/layout/Shell';
import Hero from './components/home/Hero';
import Assistant from './components/chat/Assistant';
import HealthMap from './components/maps/HealthMap';
import Appointments from './components/appointments/Appointments';
import History from './components/history/History';
import TriageChecker from './components/triage/TriageChecker';
import MessagingSimulation from './components/chat/MessagingSimulation';
import { Profile } from './components/profile/Profile';
import { Settings } from './components/profile/Settings';

import Search from './components/search/Search';
import EntityRegistration from './components/registration/EntityRegistration';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [regType, setRegType] = useState<'doctor' | 'clinic' | 'lab_pharmacy'>('lab_pharmacy');

  const openRegistration = (type: 'doctor' | 'clinic' | 'lab_pharmacy' = 'lab_pharmacy') => {
    setRegType(type);
    setActiveTab('registration');
  };

  useEffect(() => {
    const handleTabChange = (e: any) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Hero 
            onStartAssistant={() => setActiveTab('triage')} 
            onViewMap={() => setActiveTab('map')} 
            onOpenRegistration={(type) => openRegistration(type)}
          />
        );
      case 'triage':
        return <TriageChecker />;
      case 'assistant':
        return <Assistant />;
      case 'search':
        return <Search onOpenRegistration={(type) => openRegistration(type)} />;
      case 'map':
        return <HealthMap />;
      case 'appointments':
        return <Appointments />;
      case 'messages':
        return <MessagingSimulation />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'registration':
        return <EntityRegistration initialType={regType} onBack={() => setActiveTab('home')} />;
      default:
        return (
          <Hero 
            onStartAssistant={() => setActiveTab('triage')} 
            onViewMap={() => setActiveTab('map')} 
            onOpenRegistration={(type) => openRegistration(type)}
          />
        );
    }
  };

  return (
    <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}

