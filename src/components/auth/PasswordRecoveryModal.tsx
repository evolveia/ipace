import React, { useState, useEffect } from 'react';
import { IpaceLogo } from '../IpaceLogo';
import { Mail, KeyRound, CheckCircle2, Lock, ArrowLeft, RefreshCw } from 'lucide-react';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const [step, setStep] = useState<'email' | 'code' | 'new_password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: any;
    if (step === 'code' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      return setErrorMsg('Informe um endereço de e-mail válido.');
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('code');
      setTimer(30);
    }, 600);
  };

  const handleCodeChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...code];
    updated[index] = val;
    setCode(updated);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`recovery-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      return setErrorMsg('Preencha os 6 dígitos do código recebido.');
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('new_password');
    }, 500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return setErrorMsg('A nova senha deve possuir ao menos 6 caracteres.');
    }
    if (newPassword !== confirmPassword) {
      return setErrorMsg('As senhas digitadas não coincidem.');
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
        <div className="flex flex-col items-center text-center mb-6">
          <IpaceLogo variant="compact" size="sm" />
          <h2 className="font-heading font-extrabold text-2xl text-[var(--ipace-text)] mt-3">
            Recuperação de Senha
          </h2>
          <p className="text-xs text-[var(--ipace-text-2)] mt-1">
            {step === 'email' && 'Informe seu e-mail cadastrado para receber o código.'}
            {step === 'code' && `Enviamos um código de 6 dígitos para ${email}`}
            {step === 'new_password' && 'Crie uma nova senha de acesso segura.'}
            {step === 'success' && 'Senha redefinida com sucesso!'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                E-mail da sua conta
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: carlos.silva@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando Código...' : 'Enviar Código de 6 Dígitos'}
            </button>
          </form>
        )}

        {/* STEP 2: 6-DIGIT CODE */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="flex justify-center gap-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`recovery-code-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-black rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] focus:ring-2 focus:ring-[var(--ipace-primary)] focus:outline-none"
                />
              ))}
            </div>

            <div className="text-center text-xs text-[var(--ipace-text-2)]">
              {timer > 0 ? (
                <span>Reenviar código em {timer} segundos</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(30)}
                  className="font-bold text-[var(--ipace-primary)] hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reenviar código agora
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Validando...' : 'Verificar Código'}
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 'new_password' && (
          <form onSubmit={handleResetPassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                Confirme a Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Atualizando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm text-[var(--ipace-text)] font-semibold">
              Sua senha foi redefinida com total segurança. Você já pode acessar sua conta.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full py-3 px-4 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer"
            >
              Fazer Login Agora
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="text-xs font-bold text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Login
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full hover:bg-[var(--ipace-surface-2)]"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
