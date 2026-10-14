import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, Share, PlusSquare, Sparkles } from 'lucide-react';
import { IpaceLogo } from '../IpaceLogo';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstalled, isIOS, isNativeInstallable, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // If running in standalone installed app, do not show prompt
    if (isInstalled) {
      setShowModal(false);
      return;
    }

    // Check if dismissed in this session
    const hasDismissed = sessionStorage.getItem('ipace_pwa_prompt_dismissed');
    if (!hasDismissed) {
      // Show prompt after a slight delay (1.2 seconds) so user gets the prompt upon entering
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  const handleDismiss = () => {
    setShowModal(false);
    sessionStorage.setItem('ipace_pwa_prompt_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isNativeInstallable) {
      setIsInstalling(true);
      const accepted = await install();
      setIsInstalling(false);
      if (accepted) {
        setShowModal(false);
      }
    } else {
      // In case beforeinstallprompt has not fired yet or browser lacks native trigger
      // Provide direct instructions
      setShowIOSGuide(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Automatic Welcome Install Modal */}
      {showModal && !showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl relative animate-scale-up overflow-hidden">
            {/* Top decorative gradient splash */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--ipace-splash)]/20 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

            {/* Close button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] rounded-full hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--ipace-primary)] flex items-center justify-center text-white shadow-md shrink-0">
                <Smartphone className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-primary)]">
                  Aplicativo Oficial PWA
                </span>
                <h3 className="font-heading font-black text-lg sm:text-xl text-[var(--ipace-text)] leading-tight">
                  Instalar o IPACE no Celular?
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] mb-4 leading-relaxed">
              Adicione o <strong>IPACE</strong> diretamente à tela inicial do seu celular para ter uma experiência completa de app nativo:
            </p>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2.5 text-xs text-[var(--ipace-text)]">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Acesso instantâneo sem barra de navegador</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[var(--ipace-text)]">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Rastreamento GPS fluido de corridas e caminhadas</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[var(--ipace-text)]">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Notificações de provas, rankings e IA Coach</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] active:bg-[var(--ipace-active)] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'Instalando...' : 'Sim, Instalar no Celular'}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-[var(--ipace-border)] hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] text-xs font-bold transition-colors cursor-pointer"
              >
                Agora Não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Guided Steps Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative animate-scale-up">
            <button
              type="button"
              onClick={() => {
                setShowIOSGuide(false);
                setShowModal(false);
              }}
              className="absolute top-4 right-4 p-2 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] rounded-full hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--ipace-primary)]/10 text-[var(--ipace-primary)] mx-auto flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Instalar no iPhone / Safari
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] mt-1">
                Siga estes 2 passos simples para adicionar o IPACE à sua tela inicial:
              </p>
            </div>

            <div className="space-y-3.5 mb-5 bg-[var(--ipace-surface-2)] p-4 rounded-2xl border border-[var(--ipace-border)]">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div className="text-xs text-[var(--ipace-text)] leading-relaxed">
                  <strong>1.</strong> Toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta) na barra inferior do Safari.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div className="text-xs text-[var(--ipace-text)] leading-relaxed">
                  <strong>2.</strong> Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIOSGuide(false);
                setShowModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-[var(--ipace-primary)] text-white font-bold text-xs uppercase tracking-wider hover:bg-[var(--ipace-hover)] transition-all cursor-pointer"
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const PWAInstallButton: React.FC<{
  variant?: 'compact' | 'full';
  className?: string;
}> = ({ variant = 'compact', className = '' }) => {
  const { isInstalled, isIOS, isNativeInstallable, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowGuide(true);
      return;
    }
    if (isNativeInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          variant === 'full'
            ? 'w-full justify-center py-2.5 bg-[var(--ipace-primary)] text-white hover:bg-[var(--ipace-hover)] shadow-sm'
            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
        } ${className}`}
        title="Instalar IPACE no celular"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-heading font-black text-base text-[var(--ipace-text)] mb-2">
              Instalação do IPACE
            </h4>
            <p className="text-xs text-[var(--ipace-text-2)] leading-relaxed mb-4">
              {isIOS ? (
                <>
                  No Safari, toque no ícone de <strong>Compartilhar</strong> na barra inferior e escolha <strong>Adicionar à Tela de Início</strong>.
                </>
              ) : (
                <>
                  No menu do navegador (três pontinhos no topo/rodapé), selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[var(--ipace-primary)] text-white font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
