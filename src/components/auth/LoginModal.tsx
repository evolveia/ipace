import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IpaceLogo } from '../IpaceLogo';
import { Eye, EyeOff, Lock, User, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onOpenForgotPassword,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const { login, loginWithGoogle, failedAttempts, isLockedOut, resetLockout } = useAuth();

  const [identifier, setIdentifier] = useState('carlos.corre');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false); // oculta por padrão
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = 'Informe seu e-mail, CPF ou nome de usuário.';
    }
    if (!password) {
      errors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve possuir ao menos 6 caracteres.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    if (!acceptTerms) {
      setErrorMessage('Você deve aceitar os Termos de Uso e Política de Privacidade para entrar.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(identifier, password, acceptTerms);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Credenciais inválidas.');
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptTerms) {
      setErrorMessage('Você deve aceitar os Termos de Uso e Política de Privacidade para entrar.');
      return;
    }
    setIsSubmitting(true);
    await loginWithGoogle();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="mb-3">
            <IpaceLogo variant="horizontal" size="md" />
          </div>
          <h2 id="login-title" className="font-heading font-extrabold text-2xl text-[var(--ipace-text)]">
            Entrar no IPACE
          </h2>
          <p className="text-sm text-[var(--ipace-text-2)] mt-1">
            Entre para sincronizar suas corridas, rotas e comunidade.
          </p>
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-2xl p-4 mb-5 text-left">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Conta Bloqueada por Segurança
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              Foram registradas 5 tentativas incorretas consecutivas. Para sua proteção, o acesso foi suspenso.
            </p>
            <button
              type="button"
              onClick={resetLockout}
              className="mt-2 text-xs font-bold text-red-800 dark:text-red-200 underline hover:no-underline"
            >
              Resetar bloqueio (Modo Demonstração)
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && !isLockedOut && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-red-600 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-mail / CPF / Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ipace-text)] mb-1.5">
              E-mail, CPF ou Usuário
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={identifier}
                disabled={isLockedOut || isSubmitting}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: undefined });
                }}
                placeholder="ex: carlos.corre ou 000.000.000-00"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] transition-all ${
                  fieldErrors.identifier ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--ipace-border)]'
                }`}
              />
            </div>
            {fieldErrors.identifier && (
              <span className="text-xs text-red-500 mt-1 block font-medium">{fieldErrors.identifier}</span>
            )}
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ipace-text)]">
                Senha de Acesso
              </label>
              <button
                type="button"
                onClick={onOpenForgotPassword}
                className="text-xs font-semibold text-[var(--ipace-primary)] hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={isLockedOut || isSubmitting}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                }}
                placeholder="Mínimo de 6 caracteres"
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm font-medium bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] transition-all ${
                  fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--ipace-border)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="text-xs text-red-500 mt-1 block font-medium">{fieldErrors.password}</span>
            )}
            {failedAttempts > 0 && failedAttempts < 5 && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block font-medium">
                Tentativa {failedAttempts} de 5 antes do bloqueio da conta.
              </span>
            )}
          </div>

          {/* Terms Acceptance (Compulsory) */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[var(--ipace-primary)] focus:ring-[var(--ipace-primary)] accent-[var(--ipace-primary)]"
              />
              <span className="text-xs text-[var(--ipace-text-2)] leading-tight">
                Li e concordo com os{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenTerms) {
                      onClose();
                      onOpenTerms();
                    }
                  }}
                  className="text-[var(--ipace-primary)] font-bold underline hover:no-underline cursor-pointer"
                >
                  Termos de Uso
                </button>{' '}
                e a{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPrivacy) {
                      onClose();
                      onOpenPrivacy();
                    }
                  }}
                  className="text-[var(--ipace-primary)] font-bold underline hover:no-underline cursor-pointer"
                >
                  Política de Privacidade
                </button>{' '}
                do IPACE.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLockedOut || isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl font-heading font-extrabold text-sm uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] active:bg-[var(--ipace-active)] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Verificando...' : 'Entrar no IPACE'}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--ipace-border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--ipace-surface)] px-3 text-[var(--ipace-text-2)] font-semibold">
              ou
            </span>
          </div>
        </div>

        {/* Google Login Mock */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs border border-[var(--ipace-border)] bg-[var(--ipace-surface)] hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continuar com Google
        </button>

        {/* Footer Link to Register */}
        <div className="mt-6 text-center text-xs text-[var(--ipace-text-2)]">
          Ainda não faz parte da comunidade?{' '}
          <button
            type="button"
            onClick={onOpenRegister}
            className="font-bold text-[var(--ipace-primary)] hover:underline ml-1 cursor-pointer"
          >
            Criar conta grátis
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full hover:bg-[var(--ipace-surface-2)] transition-colors"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
