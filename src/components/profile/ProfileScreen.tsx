import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import {
  UserProfile,
  RankingAthlete,
  Achievement,
  UserFollowItem,
  RankingModality,
  RankingPeriod,
  RankingGender,
} from '../../types';
import {
  User,
  Settings,
  Trophy,
  Target,
  Users,
  Shield,
  Moon,
  Sun,
  LogOut,
  Edit3,
  Check,
  Flame,
  Award,
  Activity as ActivityIcon,
  Clock,
  TrendingUp,
  Camera,
  Bookmark,
  UserPlus,
  UserCheck,
  Search,
  Filter,
  Medal,
  MapPin,
  Globe,
  Sparkles,
  Calendar,
  X,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileScreen: React.FC<{
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}> = ({ onOpenTerms, onOpenPrivacy }) => {
  const { user, updateUser, theme, toggleTheme, logout } = useAuth();

  // Tab: 'perfil' | 'ranking' | 'conquistas'
  const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'ranking' | 'conquistas'>('perfil');

  // Edit Profile Drawer
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [bioInput, setBioInput] = useState(user?.bio || '');
  const [cityInput, setCityInput] = useState(user?.city || 'São Paulo');
  const [stateInput, setStateInput] = useState(user?.state || 'SP');
  const [weightInput, setWeightInput] = useState(user?.weightKg || 72);
  const [heightInput, setHeightInput] = useState(user?.heightCm || 178);
  const [weeklyGoalInput, setWeeklyGoalInput] = useState(user?.weeklyGoalKm || 35);

  // Photo change modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Modals for Followers, Following, Bookmarks
  const [activeModal, setActiveModal] = useState<'followers' | 'following' | 'bookmarks' | null>(null);
  const [followersList, setFollowersList] = useState<UserFollowItem[]>([]);
  const [followingList, setFollowingList] = useState<UserFollowItem[]>([]);

  // Ranking Filters
  const [rankingGender, setRankingGender] = useState<RankingGender>('todos');
  const [rankingModality, setRankingModality] = useState<RankingModality>('10k');
  const [rankingState, setRankingState] = useState<string>('todos');
  const [rankingCity, setRankingCity] = useState<string>('todos');
  const [rankingCountry, setRankingCountry] = useState<string>('Brasil');
  const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>('mes');
  const [rankings, setRankings] = useState<RankingAthlete[]>([]);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementFilter, setAchievementFilter] = useState<'todos' | 'unlocked' | 'locked'>('todos');

  // Logout confirm
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const loadData = async () => {
    const fws = await StorageService.getFollowers();
    const flw = await StorageService.getFollowing();
    const achs = await StorageService.getAchievements();
    const rk = await StorageService.getRankingAthletes({
      gender: rankingGender,
      modality: rankingModality,
      state: rankingState,
      city: rankingCity,
      country: rankingCountry,
      period: rankingPeriod,
    });
    setFollowersList(fws);
    setFollowingList(flw);
    setAchievements(achs);
    setRankings(rk);
  };

  useEffect(() => {
    loadData();
  }, [rankingGender, rankingModality, rankingState, rankingCity, rankingCountry, rankingPeriod]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name: nameInput,
      bio: bioInput,
      city: cityInput,
      state: stateInput,
      weightKg: Number(weightInput),
      heightCm: Number(heightInput),
      weeklyGoalKm: Number(weeklyGoalInput),
    });
    setIsEditing(false);
  };

  // Avatar change handler
  const handleSelectPresetAvatar = async (url: string) => {
    await StorageService.updateAvatar(url);
    await updateUser({ avatar: url });
    setIsAvatarModalOpen(false);
  };

  const handleFileUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          await StorageService.updateAvatar(reader.result);
          await updateUser({ avatar: reader.result });
          setIsAvatarModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFollow = async (userId: string) => {
    await StorageService.toggleFollowUser(userId);
    loadData();
  };

  // Preset athletic avatar choices (athletic male runners)
  const presetAvatars = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  ];

  const filteredAchievements = achievements.filter((ach) => {
    if (achievementFilter === 'unlocked') return ach.unlocked;
    if (achievementFilter === 'locked') return !ach.unlocked;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in">
      {/* Perfil & Ranking Tabs Header - Single line title above full-width tabs */}
      <div className="space-y-3 border-b border-[var(--ipace-border)] pb-3">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--ipace-primary)] shrink-0">
            Perfil
          </span>
          <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
          <h2 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-[var(--ipace-text)] truncate">
            Meu Perfil e Rankings
          </h2>
        </div>

        {/* Full-width 3-column grid for mobile & desktop to prevent clipping */}
        <div className="w-full grid grid-cols-3 gap-1.5 bg-[var(--ipace-surface)] p-1 rounded-2xl border border-[var(--ipace-border)] shadow-xs">
          {[
            { id: 'perfil', label: 'Visão Geral' },
            { id: 'ranking', label: 'Ranking' },
            { id: 'conquistas', label: 'Conquistas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-bold text-center transition-all cursor-pointer truncate ${
                activeSubTab === tab.id
                  ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                  : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: PERFIL GERAL */}
      {activeSubTab === 'perfil' && (
        <div className="space-y-6">
          {/* Main User Card with Avatar Changer & Counters */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
              {/* Photo with Change Icon Button */}
              <div className="relative group">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[var(--ipace-surface)] shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute inset-0 bg-black/45 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                  title="Trocar Foto de Perfil"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  Trocar Foto
                </button>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="sm:hidden absolute -bottom-1 -right-1 p-2 rounded-full bg-[var(--ipace-primary)] text-white shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info & Social Counters */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-heading font-black text-2xl text-[var(--ipace-text)]">
                      {user.name}
                    </h2>
                    <div className="text-xs text-[var(--ipace-text-2)] font-semibold mt-0.5">
                      @{user.username} • {user.city}, {user.state}{user.country ? ` • ${user.country}` : ''}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="self-center sm:self-start px-3.5 py-1.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)] hover:border-gray-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isEditing ? 'Cancelar' : 'Editar Dados'}
                  </button>
                </div>

                <p className="text-xs text-[var(--ipace-text-2)] leading-relaxed mt-2.5 max-w-xl">
                  {user.bio}
                </p>

                {/* SOCIAL COUNTERS: SEGUIDORES, SEGUIDOS E MARCADORES */}
                <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 pt-3 border-t border-[var(--ipace-border)]">
                  <button
                    type="button"
                    onClick={() => setActiveModal('followers')}
                    className="text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="font-heading font-black text-lg text-[var(--ipace-text)] group-hover:text-[var(--ipace-primary)] block">
                      {user.followersCount}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--ipace-text-2)] uppercase">
                      Seguidores
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('following')}
                    className="text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="font-heading font-black text-lg text-[var(--ipace-text)] group-hover:text-[var(--ipace-primary)] block">
                      {user.followingCount}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--ipace-text-2)] uppercase">
                      Seguindo
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('bookmarks')}
                    className="text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="font-heading font-black text-lg text-[var(--ipace-primary)] group-hover:underline block">
                      {user.bookmarksCount}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--ipace-text-2)] uppercase flex items-center gap-1">
                      <Bookmark className="w-3 h-3" /> Marcadores
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Profile Edit Form */}
            {isEditing && (
              <form onSubmit={handleSaveProfile} className="mt-6 pt-5 border-t border-[var(--ipace-border)] space-y-4 animate-fade-in text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      value={stateInput}
                      onChange={(e) => setStateInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Biografia
                  </label>
                  <textarea
                    rows={2}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={weightInput}
                      onChange={(e) => setWeightInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={heightInput}
                      onChange={(e) => setHeightInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                      Meta Semanal (km)
                    </label>
                    <input
                      type="number"
                      value={weeklyGoalInput}
                      onChange={(e) => setWeeklyGoalInput(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-primary)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md"
                >
                  Salvar Informações
                </button>
              </form>
            )}
          </div>

          {/* Metric cards (refined font sizes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Total Acumulado</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-primary)] mt-1">
                {user.totalKm.toFixed(1)} <span className="text-xs font-bold text-[var(--ipace-text-2)]">km</span>
              </div>
            </div>
            <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Treinos Gravados</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-1">
                {user.totalRuns}
              </div>
            </div>
            <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Tempo de Corrida</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-1">
                {Math.floor(user.totalMinutes / 60)}h
              </div>
            </div>
            <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Elevação Total</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600 mt-1">
                {user.totalElevationM}m
              </div>
            </div>
          </div>

          {/* Achievements Summary Banner */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                  {user.unlockedAchievements?.length || 4} Conquistas Desbloqueadas
                </h4>
                <p className="text-xs text-[var(--ipace-text-2)]">
                  Continue acumulando quilômetros e participando de provas para novas insígnias.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('conquistas')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--ipace-surface-2)] text-[var(--ipace-primary)] hover:bg-[var(--ipace-border)]"
            >
              Ver Todas
            </button>
          </div>

          {/* Preferences & Logout */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[var(--ipace-text-2)]">
              Preferências do App
            </h4>
            <div className="flex items-center justify-between py-2 border-b border-[var(--ipace-border)]">
              <div>
                <span className="text-xs font-bold text-[var(--ipace-text)] block">Tema Visual</span>
                <span className="text-[10px] text-[var(--ipace-text-2)]">Modo Claro ou Escuro</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3.5 py-1.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold flex items-center gap-2"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
                {theme === 'light' ? 'Escuro' : 'Claro'}
              </button>
            </div>
            {/* Legal Documents */}
            <div className="pt-1 pb-1 border-b border-[var(--ipace-border)] flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--ipace-text)]">Políticas &amp; Diretrizes</span>
              <div className="flex items-center gap-2 font-bold text-[var(--ipace-primary)]">
                {onOpenTerms && (
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="hover:underline cursor-pointer"
                  >
                    Termos de Uso
                  </button>
                )}
                <span>•</span>
                {onOpenPrivacy && (
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="hover:underline cursor-pointer"
                  >
                    Privacidade
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair da Conta
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 2: RANKINGS ORGANIZADOS CONFORME SOLICITADO */}
      {/* (Sexo, Modalidade, Município, Estado, País, Período) */}
      {activeSubTab === 'ranking' && (
        <div className="space-y-5 animate-fade-in">
          {/* Filter Bar */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-base text-[var(--ipace-text)] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Filtros Oficiais de Classificação
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Sua Posição: 5º Lugar Geral
              </span>
            </div>

            {/* Row 1: Sexo & Modalidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)] mb-1">
                  1. Sexo
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'M', label: 'Masculino' },
                    { id: 'F', label: 'Feminino' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setRankingGender(g.id as any)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        rankingGender === g.id
                          ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                          : 'bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)] mb-1">
                  2. Modalidade / Prova
                </label>
                <div className="flex gap-1 overflow-x-auto pb-0.5">
                  {[
                    { id: '5k', label: '5K' },
                    { id: '10k', label: '10K' },
                    { id: '21k', label: '21K' },
                    { id: '42k', label: '42K' },
                    { id: 'total_km', label: 'Km Total' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRankingModality(m.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        rankingModality === m.id
                          ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                          : 'bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Município, Estado, País & Período */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--ipace-border)]">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)] mb-1">
                  3. Município
                </label>
                <select
                  value={rankingCity}
                  onChange={(e) => setRankingCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                >
                  <option value="todos">Todos os Municípios</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                  <option value="Belo Horizonte">Belo Horizonte</option>
                  <option value="Curitiba">Curitiba</option>
                  <option value="Porto Alegre">Porto Alegre</option>
                  <option value="Brasília">Brasília</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)] mb-1">
                  4. Estado
                </label>
                <select
                  value={rankingState}
                  onChange={(e) => setRankingState(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                >
                  <option value="todos">Todos os Estados</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="RJ">Rio de Janeiro (RJ)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                  <option value="PR">Paraná (PR)</option>
                  <option value="RS">Rio Grande do Sul (RS)</option>
                  <option value="DF">Distrito Federal (DF)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)] mb-1">
                  5. País
                </label>
                <select
                  value={rankingCountry}
                  onChange={(e) => setRankingCountry(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                >
                  <option value="Brasil">🇧🇷 Brasil</option>
                  <option value="Global">🌐 Global</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)] mb-1">
                  6. Período
                </label>
                <select
                  value={rankingPeriod}
                  onChange={(e) => setRankingPeriod(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                >
                  <option value="semana">Esta Semana</option>
                  <option value="mes">Este Mês</option>
                  <option value="ano">Ano 2026</option>
                  <option value="geral">Geral (All-Time)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ranking Leaderboard Table */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="font-heading font-black text-sm text-[var(--ipace-text)] uppercase tracking-wider mb-2">
              Classificação ({rankings.length} Atletas)
            </h4>

            <div className="space-y-2">
              {rankings.map((ath) => {
                const isPodium = ath.rank <= 3;
                const podiumColor =
                  ath.rank === 1
                    ? 'text-amber-500 bg-amber-100 dark:bg-amber-950'
                    : ath.rank === 2
                    ? 'text-gray-400 bg-gray-200 dark:bg-gray-800'
                    : 'text-amber-700 bg-amber-50 dark:bg-amber-950/40';

                return (
                  <div
                    key={ath.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      ath.isCurrentUser
                        ? 'border-[var(--ipace-primary)] bg-[var(--ipace-soft)] ring-2 ring-[var(--ipace-primary)]/20 shadow-xs'
                        : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Position */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                          isPodium ? podiumColor : 'text-[var(--ipace-text-2)] bg-[var(--ipace-surface)]'
                        }`}
                      >
                        {ath.rank}º
                      </div>

                      {/* Avatar */}
                      <img
                        src={ath.avatar}
                        alt={ath.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-[var(--ipace-border)]"
                      />

                      {/* Name & Location */}
                      <div className="truncate">
                        <div className="font-heading font-black text-xs text-[var(--ipace-text)] flex items-center gap-1.5 truncate">
                          {ath.name}
                          {ath.isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[var(--ipace-primary)] text-white">
                              Você
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--ipace-text-2)] truncate">
                          @{ath.username} • {ath.city}, {ath.state}
                        </div>
                      </div>
                    </div>

                    {/* Performance metrics */}
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Distância</div>
                        <div className="font-heading font-black text-sm text-[var(--ipace-primary)]">
                          {ath.distanceKm} km
                        </div>
                      </div>

                      <div className="hidden sm:block">
                        <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Pace</div>
                        <div className="font-heading font-bold text-xs text-[var(--ipace-text)]">
                          {ath.avgPace}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONQUISTAS (ACHIEVEMENT SYSTEM ROBUSTO) */}
      {activeSubTab === 'conquistas' && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                  Sistema de Conquistas &amp; Insígnias
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)]">
                  Metas gamificadas para elevar sua performance e constância atlética.
                </p>
              </div>

              {/* Filter */}
              <div className="flex gap-1 bg-[var(--ipace-surface-2)] p-1 rounded-xl">
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'unlocked', label: 'Desbloqueadas' },
                  { id: 'locked', label: 'Em Progresso' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAchievementFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      achievementFilter === f.id
                        ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                        : 'text-[var(--ipace-text-2)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievement Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    ach.unlocked
                      ? 'bg-[var(--ipace-surface-2)] border-[var(--ipace-border)] shadow-xs'
                      : 'bg-[var(--ipace-surface-2)]/40 border-dashed border-[var(--ipace-border)] opacity-70'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${
                      ach.unlocked
                        ? 'bg-amber-100 dark:bg-amber-950 border border-amber-300'
                        : 'bg-gray-200 dark:bg-gray-800 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                        {ach.title}
                      </h4>
                      {ach.unlocked && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Conquistada
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--ipace-text-2)] mt-0.5 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="mt-2 text-[10px] text-[var(--ipace-text-2)]">
                      Critério: <strong className="text-[var(--ipace-text)]">{ach.criteria}</strong>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-[var(--ipace-text-2)]">Progresso</span>
                        <span className={ach.unlocked ? 'text-emerald-600' : 'text-[var(--ipace-primary)]'}>
                          {ach.unlocked ? '100%' : `${ach.progress}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--ipace-border)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ach.unlocked ? 'bg-emerald-500' : 'bg-[var(--ipace-primary)]'
                          }`}
                          style={{ width: `${ach.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AVATAR CHANGE MODAL */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-scale-up">
            <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-1">
              Alterar Foto de Perfil
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)] mb-4">
              Escolha uma imagem esportiva da galeria ou faça upload do seu dispositivo.
            </p>

            {/* Presets */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">
                Opções da Galeria Esportiva
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(url)}
                    className="aspect-square rounded-2xl overflow-hidden border-2 border-[var(--ipace-border)] hover:border-[var(--ipace-primary)] transition-all cursor-pointer group"
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover group-hover:scale-105" />
                  </button>
                ))}
              </div>

              {/* Upload from device */}
              <div className="pt-2">
                <label className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:border-[var(--ipace-primary)] text-xs font-bold text-[var(--ipace-text)] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[var(--ipace-primary)]" />
                  Enviar Imagem do Dispositivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadAvatar}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* FOLLOWERS / FOLLOWING / BOOKMARKS MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-scale-up">
            <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-3 capitalize">
              {activeModal === 'followers'
                ? 'Seguidores'
                : activeModal === 'following'
                ? 'Seguindo'
                : 'Meus Marcadores'}
            </h3>

            {/* Content for Followers / Following */}
            {(activeModal === 'followers' || activeModal === 'following') && (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(activeModal === 'followers' ? followersList : followingList).map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-[var(--ipace-text)] truncate">{f.name}</div>
                        <div className="text-[10px] text-[var(--ipace-text-2)] truncate">@{f.username} • {f.city}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFollow(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        f.isFollowing
                          ? 'border border-[var(--ipace-border)] text-[var(--ipace-text-2)]'
                          : 'bg-[var(--ipace-primary)] text-white shadow-xs'
                      }`}
                    >
                      {f.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Content for Bookmarks */}
            {activeModal === 'bookmarks' && (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
                <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--ipace-primary)] block mb-0.5">
                    Rota Salva
                  </span>
                  <div className="font-bold text-[var(--ipace-text)]">Volta Completa Parque Ibirapuera (5.8 km)</div>
                  <div className="text-[11px] text-[var(--ipace-text-2)]">São Paulo, SP</div>
                </div>

                <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--ipace-primary)] block mb-0.5">
                    Produto Marcado
                  </span>
                  <div className="font-bold text-[var(--ipace-text)]">Tênis Nike ZoomX Vaporfly Next% 3</div>
                  <div className="text-[11px] text-[var(--ipace-text-2)]">R$ 890,00 • Rodrigo Medeiros</div>
                </div>

                <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--ipace-primary)] block mb-0.5">
                    Post Salvo
                  </span>
                  <div className="font-bold text-[var(--ipace-text)]">Dica da semana do Treinador: Cadência e impacto</div>
                  <div className="text-[11px] text-[var(--ipace-text-2)]">Coach Marcos Lima</div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center animate-scale-up">
            <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-2">
              Deseja sair do IPACE?
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)] mb-5">
              Seus dados, conquistas e treinos permanecerão salvos com segurança.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--ipace-border)] text-xs font-bold text-[var(--ipace-text)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-heading font-black uppercase text-white bg-[var(--ipace-primary)]"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
