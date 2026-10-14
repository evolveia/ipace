import React from 'react';
import { IpaceLogo } from '../IpaceLogo';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Calendar,
  Play,
  ShoppingBag,
  User,
  Sparkles,
  Trophy,
  History,
  LogOut,
  Map,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenLogin }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const mainLinks = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'tracking', label: 'Corrida', icon: Play, highlight: true },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: 'Novo' },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'history', label: 'Histórico de Treinos', icon: History },
    { id: 'ai-panel', label: 'IPACE Coach IA', icon: Sparkles, badge: 'IA' },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 bg-[var(--ipace-surface)] border-r border-[var(--ipace-border)] h-screen sticky top-0 z-30 p-5 justify-between select-none"
      aria-label="Menu Lateral Desktop"
    >
      <div>
        {/* Brand Logo */}
        <div className="pb-5 mb-4 border-b border-[var(--ipace-border)] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="cursor-pointer text-left focus:outline-none"
          >
            <IpaceLogo variant="horizontal" size="md" />
          </button>
        </div>

        {/* Big Action: Iniciar Atividade */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => onSelectTab('tracking')}
            className="w-full py-3.5 px-4 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] active:bg-[var(--ipace-active)] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
            Iniciar Treino
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1" aria-label="Links de Navegação">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onSelectTab(link.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--ipace-soft)] text-[var(--ipace-primary)] font-extrabold shadow-xs'
                    : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[var(--ipace-primary)]' : 'text-[var(--ipace-text-2)]'
                    }`}
                  />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[var(--ipace-primary)] text-white shrink-0">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile summary */}
      <div className="pt-4 border-t border-[var(--ipace-border)]">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2.5 text-left p-1 rounded-xl hover:bg-[var(--ipace-surface-2)] flex-1 min-w-0 transition-colors cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-[var(--ipace-border)] shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-[var(--ipace-text)] truncate">{user.name}</div>
                <div className="text-[10px] text-[var(--ipace-text-2)] truncate">@{user.username}</div>
              </div>
            </button>
            <button
              type="button"
              onClick={logout}
              title="Sair da conta"
              className="p-2 text-[var(--ipace-text-2)] hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenLogin}
            className="w-full py-2 px-3 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)] hover:bg-[var(--ipace-border)] transition-colors cursor-pointer"
          >
            Entrar / Cadastrar
          </button>
        )}
      </div>
    </aside>
  );
};
