/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Preloader } from './components/auth/Preloader';
import { LoginScreen } from './components/auth/LoginScreen';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { PasswordRecoveryModal } from './components/auth/PasswordRecoveryModal';
import { TermsOfUseScreen } from './components/legal/TermsOfUseScreen';
import { PrivacyPolicyScreen } from './components/legal/PrivacyPolicyScreen';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';


// Screens
import { HomeScreen } from './components/home/HomeScreen';
import { TrackingScreen } from './components/tracking/TrackingScreen';
import { EventsScreen } from './components/events/EventsScreen';
import { MarketplaceScreen } from './components/marketplace/MarketplaceScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { AiPanel } from './components/ai/AiPanel';

import { EventItem, RouteItem } from './types';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [hasLoaded, setHasLoaded] = useState(false);
  // Default start at Início
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected route for live tracking
  const [selectedRouteForRun, setSelectedRouteForRun] = useState<RouteItem | null>(null);

  // Legal full screen view: 'terms' | 'privacy' | null
  const [legalView, setLegalView] = useState<'terms' | 'privacy' | null>(null);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // If initial preloader is active
  if (!hasLoaded) {
    return <Preloader onComplete={() => setHasLoaded(true)} />;
  }

  // Full Screen Legal Views (available to both authenticated & unauthenticated states)
  if (legalView === 'terms') {
    return (
      <TermsOfUseScreen
        onBack={() => setLegalView(null)}
        onOpenPrivacy={() => setLegalView('privacy')}
      />
    );
  }

  if (legalView === 'privacy') {
    return (
      <PrivacyPolicyScreen
        onBack={() => setLegalView(null)}
        onOpenTerms={() => setLegalView('terms')}
      />
    );
  }

  // If user is logged out, render the official IPACE Login Screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenForgotPassword={() => setIsForgotOpen(true)}
        onOpenTerms={() => setLegalView('terms')}
        onOpenPrivacy={() => setLegalView('privacy')}
      />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onOpenLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(false);
          }}
        />

        <PasswordRecoveryModal
          isOpen={isForgotOpen}
          onClose={() => setIsForgotOpen(false)}
          onOpenLogin={() => {
            setIsForgotOpen(false);
            setIsLoginOpen(false);
          }}
        />
      </>
    );
  }

  const handleStartRouteRun = (route: RouteItem) => {
    setSelectedRouteForRun(route);
    setCurrentTab('tracking');
  };

  const handleSelectFeaturedEvent = (_event: EventItem) => {
    setCurrentTab('events');
  };

  return (
    <div className="min-h-screen bg-[var(--ipace-bg)] text-[var(--ipace-text)] flex transition-colors duration-200">
      {/* Desktop Sidebar (≥1024px) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLogin={() => setIsLoginOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Screen Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* 1º Início */}
          {currentTab === 'home' && (
            <HomeScreen
              onSelectEvent={handleSelectFeaturedEvent}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {/* 2º Eventos */}
          {currentTab === 'events' && <EventsScreen />}

          {/* 3º Corrida (integrada com rotas) */}
          {currentTab === 'tracking' && (
            <TrackingScreen
              initialMode={selectedRouteForRun ? 'route' : 'free'}
              initialRouteName={selectedRouteForRun?.name}
              onActivitySaved={() => {
                setSelectedRouteForRun(null);
                setCurrentTab('history');
              }}
            />
          )}

          {/* 4º Marketplace (Produtos e Serviços) */}
          {currentTab === 'marketplace' && <MarketplaceScreen />}

          {/* 5º Perfil e Rankings */}
          {currentTab === 'profile' && (
            <ProfileScreen
              onOpenTerms={() => setLegalView('terms')}
              onOpenPrivacy={() => setLegalView('privacy')}
            />
          )}

          {/* Histórico & IA Coach */}
          {currentTab === 'history' && <HistoryScreen />}

          {currentTab === 'ai-panel' && <AiPanel />}
        </main>

        {/* Mobile Bottom Navigation (<1024px) with exact 5 items order */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* Modals for when logged-in user interacts */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onOpenForgotPassword={() => {
          setIsLoginOpen(false);
          setIsForgotOpen(true);
        }}
        onOpenTerms={() => setLegalView('terms')}
        onOpenPrivacy={() => setLegalView('privacy')}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <PasswordRecoveryModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onOpenLogin={() => {
          setIsForgotOpen(false);
          setIsLoginOpen(true);
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
