import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IpaceLogo } from '../IpaceLogo';
import {
  User,
  Mail,
  Lock,
  Target,
  Activity,
  MapPin,
  Bell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basic
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Sports Profile
  const [targetDistance, setTargetDistance] = useState<'5k' | '10k' | '21k' | '42k' | 'saude'>('10k');
  const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado' | 'elite'>('iniciante');
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);

  // Step 3: Permissions
  const [gpsAllowed, setGpsAllowed] = useState(true);
  const [notificationsAllowed, setNotificationsAllowed] = useState(true);

  // Step 4: Terms
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeDataProcessing, setAgreeDataProcessing] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Vazia', color: 'bg-gray-300', percent: 0 };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-red-500', percent: 20 };
    if (score === 2) return { score: 2, label: 'Média', color: 'bg-amber-500', percent: 45 };
    if (score <= 4) return { score: 3, label: 'Forte', color: 'bg-emerald-500', percent: 80 };
    return { score: 4, label: 'Excelente', color: 'bg-green-600', percent: 100 };
  };

  const strength = getPasswordStrength(password);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!name.trim()) return setErrorMsg('Informe seu nome completo.');
      if (!username.trim()) return setErrorMsg('Escolha um nome de usuário.');
      if (!email.trim() || !email.includes('@')) return setErrorMsg('Insira um e-mail válido.');
      if (password.length < 6) return setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      setStep(2);
    } else if (step === 2) {
      if (weightKg < 35 || weightKg > 200) return setErrorMsg('Informe um peso válido (em kg).');
      if (heightCm < 100 || heightCm > 230) return setErrorMsg('Informe uma altura válida (em cm).');
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleFinish = async () => {
    if (!agreeTerms || !agreeDataProcessing) {
      return setErrorMsg('Você deve aceitar os Termos e a Política de Dados para concluir o cadastro.');
    }
    setIsSubmitting(true);
    await register(
      {
        name,
        username: username.replace('@', ''),
        email,
        targetDistance,
        level,
        weightKg,
        heightCm,
      },
      password
    );
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-scale-up">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <IpaceLogo variant="compact" size="sm" />
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-7 bg-[var(--ipace-primary)]'
                    : s < step
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-[var(--ipace-border)]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[var(--ipace-text-2)] uppercase">
            Etapa {step} de 4
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--ipace-text)]">
                Criar seu Perfil de Atleta
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] mt-0.5">
                Comece informando seus dados essenciais de acesso.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Carlos Silva"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Nome de Usuário (@)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: carlos.corre"
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                Senha Segura
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ipace-text-2)]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha forte"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-[var(--ipace-text-2)]">Força da Senha:</span>
                    <span className="uppercase text-[var(--ipace-text)]">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--ipace-border)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <ul className="text-[10px] text-[var(--ipace-text-2)] list-disc pl-4 space-y-0.5 pt-0.5">
                    <li className={password.length >= 8 ? 'text-emerald-500 font-semibold' : ''}>
                      Pelo menos 8 caracteres
                    </li>
                    <li className={/[A-Z]/.test(password) && /[0-9]/.test(password) ? 'text-emerald-500 font-semibold' : ''}>
                      Letras maiúsculas e números
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Sports Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--ipace-text)]">
                Seu Perfil Esportivo
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] mt-0.5">
                Esses dados calibram o cálculo de calorias e os treinos sugeridos pela IA.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1.5">
                Principal Objetivo Atual
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: '5k', label: '5K Rápido' },
                  { id: '10k', label: '10K Sub-50' },
                  { id: '21k', label: 'Meia Maratona' },
                  { id: '42k', label: 'Maratona 42K' },
                  { id: 'saude', label: 'Saúde & Hábito' },
                ].map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setTargetDistance(obj.id as any)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all ${
                      targetDistance === obj.id
                        ? 'border-[var(--ipace-primary)] bg-[var(--ipace-primary)] text-white shadow-sm'
                        : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] hover:border-gray-400'
                    }`}
                  >
                    {obj.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1.5">
                Nível de Corrida
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'iniciante', label: 'Iniciante', desc: 'Começando agora ou voltando a ativa' },
                  { id: 'intermediario', label: 'Intermediário', desc: 'Corre de 10 a 25km semanais regulares' },
                  { id: 'avancado', label: 'Avançado', desc: 'Corre mais de 35km semanais e faz provas' },
                  { id: 'elite', label: 'Elite / Competitivo', desc: 'Busca pódios e índices oficiais' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id as any)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      level === lvl.id
                        ? 'border-[var(--ipace-primary)] bg-red-50 dark:bg-red-950/40 text-[var(--ipace-text)]'
                        : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] hover:border-gray-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl.label}</div>
                    <div className="text-[10px] text-[var(--ipace-text-2)] leading-tight mt-0.5">
                      {lvl.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm font-bold text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-sm font-bold text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Permissions */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--ipace-text)]">
                Permissões do Dispositivo
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] mt-0.5">
                Para gravar percursos precisos e receber avisos dos seus amigos corredores.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ipace-text)]">Acesso ao GPS e Localização</h4>
                    <p className="text-xs text-[var(--ipace-text-2)]">
                      Essencial para calcular distância, ritmo e desenhar percurso no mapa.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={gpsAllowed}
                  onChange={(e) => setGpsAllowed(e.target.checked)}
                  className="w-5 h-5 rounded accent-[var(--ipace-primary)] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ipace-text)]">Notificações e Alertas</h4>
                    <p className="text-xs text-[var(--ipace-text-2)]">
                      Lembretes de treinos agendados, curtidas e largadas de eventos.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsAllowed}
                  onChange={(e) => setNotificationsAllowed(e.target.checked)}
                  className="w-5 h-5 rounded accent-[var(--ipace-primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Terms & Final Acceptance */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--ipace-text)]">
                Quase lá! Aceites Finais
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] mt-0.5">
                Revise os termos de comunidade e segurança física.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--ipace-primary)] shrink-0"
                />
                <span className="text-xs text-[var(--ipace-text)] leading-relaxed">
                  Concordo com os <strong>Termos de Uso</strong> e confirmo que estou apto à prática de
                  atividades físicas moderadas e intensas.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeDataProcessing}
                  onChange={(e) => setAgreeDataProcessing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--ipace-primary)] shrink-0"
                />
                <span className="text-xs text-[var(--ipace-text)] leading-relaxed">
                  Autorizo o processamento dos dados biométricos e percursos para cálculo de métricas e
                  sugestões da <strong>IA Coach do IPACE</strong>.
                </span>
              </label>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
                Aviso: Recomendamos consulta médica prévia antes de iniciar qualquer programa de alta intensidade.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--ipace-border)]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-xs font-bold text-[var(--ipace-primary)] hover:underline cursor-pointer"
            >
              Já tenho conta
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer"
            >
              Avançar
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Criando Perfil...' : 'Concluir Cadastro'}
            </button>
          )}
        </div>

        {/* Close Modal */}
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
