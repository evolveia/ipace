import React from 'react';
import { Home, Calendar, Play, ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  // Exact 5 items in the requested order:
  // 1º Início, 2º Eventos, 3º Corrida (central), 4º Marketplace, 5º Perfil & Ranking
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'tracking', label: 'Corrida', icon: Play, isMainAction: true },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--ipace-surface)]/95 backdrop-blur-md border-t border-[var(--ipace-border)] safe-area-pb shadow-lg"
      aria-label="Navegação Principal do Rodapé"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isMainAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className="relative -top-4 flex flex-col items-center group cursor-pointer focus:outline-none"
                aria-label="Iniciar Corrida, Caminhada ou Rota"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${
                    isActive
                      ? 'bg-[var(--ipace-active)] ring-4 ring-red-200 dark:ring-red-950 scale-105'
                      : 'bg-[var(--ipace-primary)]'
                  } text-white`}
                >
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
                <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[var(--ipace-primary)] mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[var(--ipace-primary)] font-bold'
                  : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-semibold tracking-tight mt-1 truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ipace-primary)] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
