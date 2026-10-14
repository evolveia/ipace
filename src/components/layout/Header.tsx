import React, { useState } from 'react';
import { IpaceLogo } from '../IpaceLogo';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../pwa/PWAInstallPrompt';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  User,
  LogOut,
  CheckCircle,
  Trophy,
  Flame,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogin,
  searchQuery,
  onSearchChange,
}) => {
  const { user, isAuthenticated, theme, toggleTheme, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Inscrição Confirmada!',
      desc: 'Seu voucher para a Maratona do Rio 2026 já está liberado com QR Code.',
      time: 'Há 15 min',
      unread: true,
      icon: Trophy,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
    },
    {
      id: 'notif_2',
      title: 'Meta Semanal Quase Batida!',
      desc: 'Faltam apenas 6.2 km para atingir seus 35km semanais.',
      time: 'Há 2 horas',
      unread: true,
      icon: Flame,
      color: 'text-[var(--ipace-primary)] bg-red-50 dark:bg-red-950',
    },
    {
      id: 'notif_3',
      title: 'Mariana curtiu sua atividade',
      desc: '"Longão de Sábado — Ibirapuera" recebeu uma curtida.',
      time: 'Há 4 horas',
      unread: false,
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--ipace-surface)]/95 backdrop-blur-md border-b border-[var(--ipace-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Logo (visible on mobile; on desktop sidebar has big logo) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="Ir para a página inicial"
          >
            <IpaceLogo variant="compact" size="sm" />
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar corredores, rotas, eventos ou assessorias..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-medium text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Coach Quick Badge */}
          <button
            type="button"
            onClick={() => onSelectTab('ai-panel')}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              currentTab === 'ai-panel'
                ? 'bg-[var(--ipace-primary)] text-white shadow-sm'
                : 'bg-red-50 dark:bg-red-950/60 text-[var(--ipace-primary)] hover:bg-[var(--ipace-primary)] hover:text-white border border-red-200 dark:border-red-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            IA Coach
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
            aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)] relative transition-colors cursor-pointer"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--ipace-primary)] text-white text-[9px] font-bold flex items-center justify-center animate-scale-up">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl shadow-2xl p-4 z-50 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--ipace-border)]">
                  <div className="font-heading font-extrabold text-sm text-[var(--ipace-text)]">
                    Notificações
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] font-bold text-[var(--ipace-primary)] hover:underline"
                    >
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[var(--ipace-border)] max-h-80 overflow-y-auto mt-1">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`py-3 flex items-start gap-3 transition-colors ${
                          item.unread ? 'bg-red-50/40 dark:bg-red-950/20 -mx-4 px-4' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-xs font-bold text-[var(--ipace-text)] leading-tight">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[var(--ipace-text-2)] mt-0.5 line-clamp-2">
                            {item.desc}
                          </div>
                          <div className="text-[9px] font-medium text-[var(--ipace-text-2)] mt-1">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar / Login */}
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--ipace-primary)] transition-all cursor-pointer"
              aria-label="Acessar Perfil"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-[var(--ipace-border)]"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-sm cursor-pointer"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
