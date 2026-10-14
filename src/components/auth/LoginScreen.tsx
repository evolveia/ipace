import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IpaceLogo } from '../IpaceLogo';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface LoginScreenProps {
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onOpenRegister,
  onOpenForgotPassword,
}) => {
  const {
    login,
    loginWithGoogle,
    failedAttempts,
    isLockedOut,
    resetLockout,
  } = useAuth();

  const [identifier, setIdentifier] = useState('carlos.corre');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(identifier, password, true);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Credenciais inválidas.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsSubmitting(true);
    await login('carlos.corre', '123456', true);
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--ipace-bg)] text-[var(--ipace-text)] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in relative selection:bg-red-500 selection:text-white">
      {/* Main Login Card Section - Without top logo and without light/dark switch */}
      <main className="max-w-md w-full mx-auto my-auto py-2">
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle decorative background splash */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--ipace-splash)]/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

          {/* Card Header with Logo */}
          <div className="text-center mb-6 relative z-10 pt-2 flex flex-col items-center">
            <div className="mb-3">
              <IpaceLogo variant="horizontal" size="lg" />
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] tracking-tight">
              Entrar no IPACE
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ipace-text-2)] mt-1.5 max-w-xs mx-auto">
              Sincronize seus treinos, acompanhe rankings e conecte-se com sua assessoria.
            </p>
          </div>

          {/* Lockout Warning */}
          {isLockedOut && (
            <div className="bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-2xl p-4 mb-5 text-left animate-scale-up">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm mb-1">
                <AlertCircle className="w-5 h-5 shrink-0" />
                Conta Bloqueada por Segurança
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                Foram registradas 5 tentativas incorretas consecutivas. Para sua proteção, o acesso foi temporariamente suspenso.
              </p>
              <button
                type="button"
                onClick={resetLockout}
                className="mt-2.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
              >
                Resetar Bloqueio (Modo Teste)
              </button>
            </div>
          )}

          {/* Global Error Banner */}
          {errorMessage && !isLockedOut && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ipace-text)] mb-1.5">
                E-mail, CPF ou Nome de Usuário
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
                  placeholder="ex: carlos.corre ou atleta@ipace.app"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm font-medium bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] transition-all ${
                    fieldErrors.identifier ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--ipace-border)]'
                  }`}
                />
              </div>
              {fieldErrors.identifier && (
                <span className="text-xs text-red-500 mt-1 block font-medium">{fieldErrors.identifier}</span>
              )}
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ipace-text)]">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs font-bold text-[var(--ipace-primary)] hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
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
                  placeholder="Digite sua senha"
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl border text-sm font-medium bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] placeholder-[var(--ipace-text-2)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] transition-all ${
                    fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--ipace-border)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] cursor-pointer"
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

            {/* Remember me */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--ipace-primary)] focus:ring-[var(--ipace-primary)] accent-[var(--ipace-primary)] cursor-pointer"
                />
                <span className="text-xs text-[var(--ipace-text-2)] leading-tight">
                  Manter conectado neste dispositivo
                </span>
              </label>
            </div>

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={isLockedOut || isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] active:bg-[var(--ipace-active)] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no IPACE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-emerald-500" />
              <span>Entrar com Acesso Rápido de Atleta (Demo)</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--ipace-border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--ipace-surface)] px-3 text-[var(--ipace-text-2)] font-semibold">
                ou continue com
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl font-semibold text-xs border border-[var(--ipace-border)] bg-[var(--ipace-surface)] hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
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
            <span>Conta Google</span>
          </button>

          {/* Register Prompt */}
          <div className="mt-6 pt-5 border-t border-[var(--ipace-border)] text-center text-xs text-[var(--ipace-text-2)]">
            Ainda não faz parte da comunidade?{' '}
            <button
              type="button"
              onClick={onOpenRegister}
              className="font-bold text-[var(--ipace-primary)] hover:underline ml-1 cursor-pointer"
            >
              Cadastre-se gratuitamente
            </button>
          </div>
        </div>
      </main>
      {/* Footer strictly removed as requested: no Termos de Uso, Políticas de Privacidade, Suporte ou Contato */}
    </div>
  );
};
