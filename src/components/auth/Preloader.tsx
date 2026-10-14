import React, { useState, useEffect } from 'react';
import { IpaceLogo } from '../IpaceLogo';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [statusText, setStatusText] = useState('Verificando sessão e dados de treino...');

  const startLoading = () => {
    setHasError(false);
    setProgress(0);
    setStatusText('Conectando ao ecossistema IPACE...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 20) + 12;
        if (next > 40 && next < 70) {
          setStatusText('Carregando mapa e rotas da comunidade...');
        } else if (next >= 70 && next < 95) {
          setStatusText('Preparando métricas e IA Coach...');
        } else if (next >= 95) {
          setStatusText('Pronto para correr!');
        }

        return next > 100 ? 100 : next;
      });
    }, 150);
  };

  useEffect(() => {
    startLoading();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-colors duration-300"
      style={{ backgroundColor: 'var(--ipace-bg)' }}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated pulsating watercolor glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#D2262E] opacity-20 blur-2xl rounded-full scale-125 animate-pulse" />
          <div className="relative animate-bounce" style={{ animationDuration: '2.5s' }}>
            <IpaceLogo variant="stacked" size="lg" />
          </div>
        </div>

        {hasError ? (
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-6 shadow-md w-full animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-3 text-[var(--ipace-primary)]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[var(--ipace-text)] mb-1">
              Falha ao sincronizar
            </h3>
            <p className="text-sm text-[var(--ipace-text-2)] mb-4">
              Não foi possível sincronizar o estado da sessão. Verifique sua conexão e tente novamente.
            </p>
            <button
              onClick={startLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="w-full mt-4 flex flex-col items-center">
            {/* Progress bar container */}
            <div className="w-64 h-2.5 bg-[var(--ipace-border)] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#E4575E] via-[#D2262E] to-[#8F171D] rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between w-64 mt-2.5 text-xs font-semibold text-[var(--ipace-text-2)]">
              <span>{statusText}</span>
              <span>{progress}%</span>
            </div>

            {/* Test network error affordance */}
            <button
              type="button"
              onClick={() => setHasError(true)}
              className="mt-8 text-[11px] text-[var(--ipace-text-2)] hover:text-[var(--ipace-primary)] underline opacity-60 hover:opacity-100 transition-opacity"
            >
              Simular falha de conexão
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
