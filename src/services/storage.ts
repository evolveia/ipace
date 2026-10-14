import {
  Activity,
  UserProfile,
  EventItem,
  EventRegistration,
  RouteItem,
  Post,
  Professional,
  ServiceBooking,
  PersonalRecord,
  ReportCategory,
  MarketplaceItem,
  RankingAthlete,
  Achievement,
  UserFollowItem,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'ipace_user_profile',
  SESSION: 'ipace_session',
  ACTIVITIES: 'ipace_activities',
  POSTS: 'ipace_posts',
  EVENTS: 'ipace_events',
  REGISTRATIONS: 'ipace_registrations',
  ROUTES: 'ipace_routes',
  PROFESSIONALS: 'ipace_professionals',
  BOOKINGS: 'ipace_bookings',
  MARKETPLACE: 'ipace_marketplace',
  FOLLOWERS: 'ipace_followers',
  FOLLOWING: 'ipace_following',
  ACHIEVEMENTS: 'ipace_achievements',
  BLOCKED_USERS: 'ipace_blocked_users',
  REPORTS: 'ipace_reports',
  THEME: 'ipace_theme',
};

// Artificial latency helper (300–600ms) to satisfy specification 1
export const fakeDelay = async (min = 300, max = 550): Promise<void> => {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// --- Initial Seed Data ---

export const INITIAL_USER: UserProfile = {
  id: 'usr_carlos_01',
  name: 'Carlos Silva',
  username: 'carlos.corre',
  email: 'carlos.silva@email.com',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  bio: 'Corredor amador focado nos 10K sub-48 e na Meia do Rio. Apaixonado por longões de domingo e tecnologia esportiva.',
  city: 'São Paulo',
  state: 'SP',
  country: 'Brasil',
  gender: 'M',
  targetDistance: '10k',
  level: 'intermediario',
  weightKg: 72,
  heightCm: 178,
  totalKm: 486.4,
  totalRuns: 52,
  totalMinutes: 2840,
  totalElevationM: 4120,
  weeklyGoalKm: 35,
  yearlyGoalKm: 1200,
  teams: ['Equipe BHRace SP', 'Pelotão da Madrugada'],
  isPrivate: false,
  followersCount: 142,
  followingCount: 88,
  bookmarksCount: 16,
  unlockedAchievements: ['first_5k', 'route_creator', 'ai_insights', 'century_club'],
  savedRouteIds: ['rt_ibirapuera', 'rt_pampulha'],
  savedMarketplaceIds: ['mkt_1', 'mkt_3'],
};

// ACHIEVEMENTS MASTER DEFINITIONS
export const MASTER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    key: 'first_5k',
    title: 'First 5k Run (Primeiro 5K)',
    description: 'Completou sua primeira corrida contínua de 5 quilômetros gravada no IPACE.',
    criteria: 'Correr uma distância mínima de 5.0 km em um único treino.',
    icon: '🏃‍♂️',
    category: 'distance',
    unlocked: true,
    unlockedAt: '12/01/2026',
    progress: 100,
    currentValue: 5.0,
    targetValue: 5.0,
    unit: 'km',
  },
  {
    id: 'ach_2',
    key: 'consistent_runner',
    title: 'Consistent Runner - 1 Month (Constância Mensal)',
    description: 'Manteve constância exemplar realizando ao menos 12 treinos no mesmo mês.',
    criteria: 'Gravar 12 ou mais treinos em um período de 30 dias corridos.',
    icon: '📅',
    category: 'consistency',
    unlocked: false,
    progress: 75,
    currentValue: 9,
    targetValue: 12,
    unit: 'treinos',
  },
  {
    id: 'ach_3',
    key: 'event_enthusiast',
    title: 'Event Enthusiast - 3 Events (Entusiasta de Provas)',
    description: 'Participou ou garantiu inscrição em 3 eventos oficiais presenciais ou desafios remotos.',
    criteria: 'Realizar inscrição confirmada em 3 eventos no IPACE.',
    icon: '🏅',
    category: 'events',
    unlocked: false,
    progress: 66,
    currentValue: 2,
    targetValue: 3,
    unit: 'provas',
  },
  {
    id: 'ach_4',
    key: 'route_creator',
    title: 'Route Creator (Explorador de Trilhas)',
    description: 'Desenhou e publicou um percurso inovador no mapa da comunidade de corredores.',
    criteria: 'Criar e salvar ao menos 1 rota com pontos de altimetria.',
    icon: '🗺️',
    category: 'routes',
    unlocked: true,
    unlockedAt: '18/02/2026',
    progress: 100,
    currentValue: 1,
    targetValue: 1,
    unit: 'rota',
  },
  {
    id: 'ach_5',
    key: 'ai_insights',
    title: 'AI Insights Follower (Atleta da IA)',
    description: 'Utilizou a inteligência artificial do IPACE Coach para predições de prova e ouviu as orientações por áudio.',
    criteria: 'Gerar análise biomecânica com IA Coach e acionar o áudio TTS.',
    icon: '✨',
    category: 'ai',
    unlocked: true,
    unlockedAt: '02/03/2026',
    progress: 100,
    currentValue: 3,
    targetValue: 3,
    unit: 'interações',
  },
  {
    id: 'ach_6',
    key: 'century_club',
    title: 'Century Club (Clube dos 100K)',
    description: 'Alcançou a marca histórica de mais de 100 km rodados nos treinos registrados.',
    criteria: 'Acumular mais de 100 km totais de corrida ou caminhada.',
    icon: '💯',
    category: 'distance',
    unlocked: true,
    unlockedAt: '25/02/2026',
    progress: 100,
    currentValue: 486.4,
    targetValue: 100,
    unit: 'km',
  },
  {
    id: 'ach_7',
    key: 'sub_50_10k',
    title: 'Speed Demon Sub-50 (10K Veloz)',
    description: 'Quebrou a desejada barreira dos 50 minutos nos 10 quilômetros.',
    criteria: 'Concluir 10km com pace médio menor que 5:00 min/km.',
    icon: '⚡',
    category: 'distance',
    unlocked: true,
    unlockedAt: '22/03/2026',
    progress: 100,
    currentValue: 49.7,
    targetValue: 50.0,
    unit: 'min',
  },
  {
    id: 'ach_8',
    key: 'hill_master',
    title: 'King of the Hill (Monstro da Colina)',
    description: 'Encarou a altimetria acumulando mais de 300 metros de subida em uma única atividade.',
    criteria: 'Completar um treino com altimetria positiva maior que 300m.',
    icon: '⛰️',
    category: 'routes',
    unlocked: false,
    progress: 40,
    currentValue: 120,
    targetValue: 300,
    unit: 'm',
  },
];

// MARKETPLACE SEED ITEMS (Produtos & Serviços)
export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'mkt_1',
    title: 'Tênis Nike ZoomX Vaporfly Next% 3 — Tam 41',
    description: 'Tênis de competição com placa de carbono integral. Usado apenas em 2 provas de 10km (menos de 25km rodados). Estado impecável, caixa original.',
    price: 890.0,
    category: 'tenis',
    condition: 'seminovo',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    sellerId: 'usr_rodrigo_runner',
    sellerName: 'Rodrigo Medeiros',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.95,
    sellerCity: 'São Paulo, SP',
    sellerContact: '(11) 98452-1190',
    createdAt: 'Há 1 dia',
    badge: 'Placa de Carbono',
    isSaved: true,
  },
  {
    id: 'mkt_2',
    title: 'Relógio GPS Garmin Forerunner 265 Music',
    description: 'Display AMOLED sensacional, métricas avançadas de prontidão de treino, dinâmica de corrida no pulso. 6 meses de uso com película aplicada.',
    price: 2450.0,
    category: 'relogios',
    condition: 'seminovo',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    sellerId: 'usr_mariana_costa',
    sellerName: 'Mariana Costa',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    sellerCity: 'Campinas, SP',
    sellerContact: '(19) 99120-4455',
    createdAt: 'Há 3 dias',
    badge: 'AMOLED & Música',
    isSaved: false,
  },
  {
    id: 'mkt_3',
    title: 'Planilha Mensal de Corrida Personalizada + Feedback Semanal',
    description: 'Periodização individualizada focada em provas de 5K, 10K, Meia Maratona e Maratona. Acompanhamento direto via WhatsApp e métricas integradas no IPACE.',
    price: 130.0,
    category: 'servicos',
    condition: 'servico',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    sellerId: 'pro_marcos_lima',
    sellerName: 'Coach Marcos Lima (CREF 049210-G/SP)',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.98,
    sellerCity: 'Online / Brasil',
    sellerContact: '(11) 97134-8820',
    createdAt: 'Disponível',
    badge: 'Profissional Verificado',
    isSaved: true,
  },
  {
    id: 'mkt_4',
    title: 'Colete de Hidratação Salomon Active Skin 8 (com 2 soft flasks)',
    description: 'Colete novo com etiquetas. Capacidade para 8 litros, tecido elástico respirável Sensifit, acompanha 2 garrafas macias de 500ml.',
    price: 520.0,
    category: 'acessorios',
    condition: 'novo',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    sellerId: 'usr_patricia_walk',
    sellerName: 'Patrícia Albuquerque',
    sellerAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerCity: 'Rio de Janeiro, RJ',
    sellerContact: '(21) 98722-1004',
    createdAt: 'Há 5 dias',
    badge: 'Trail & Longão',
    isSaved: false,
  },
  {
    id: 'mkt_5',
    title: 'Combo Nutricional Maurten Gel 100 (Caixa com 12 unidades)',
    description: 'O gel de carboidrato com tecnologia hidrogel mais consagrado entre maratonistas de elite mundial. Validade para 2027.',
    price: 260.0,
    category: 'suplementos',
    condition: 'novo',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    sellerId: 'pro_dra_camila',
    sellerName: 'Dra. Camila Nogueira (CRN-3 32840)',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    sellerCity: 'São Paulo, SP',
    sellerContact: '(11) 99341-2099',
    createdAt: 'Há 2 dias',
    badge: 'Hidrogel Oficial',
    isSaved: false,
  },
  {
    id: 'mkt_6',
    title: 'Camiseta de Corrida Térmica Proteção UV50+ DryFit',
    description: 'Tecido super leve antifricção que evita assaduras em treinos longos. Diversos tamanhos P, M e G.',
    price: 79.9,
    category: 'vestuario',
    condition: 'novo',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    sellerId: 'team_bhrace',
    sellerName: 'Equipe BHRace Store',
    sellerAvatar: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.88,
    sellerCity: 'Belo Horizonte, MG',
    sellerContact: '(31) 99882-3311',
    createdAt: 'Há 1 semana',
    badge: 'Coleção 2026',
    isSaved: false,
  },
];

// RANKING ATHLETES SEED
export const INITIAL_RANKING_DATA: RankingAthlete[] = [
  {
    id: 'ath_1',
    rank: 1,
    name: 'Gabriel Siqueira',
    username: 'gabriel.ultra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    gender: 'M',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    distanceKm: 84.5,
    avgPace: "4'12\"",
    totalTime: '5h 54m',
    runsCount: 7,
    points: 1420,
  },
  {
    id: 'ath_2',
    rank: 2,
    name: 'Juliana Ferreira',
    username: 'ju.corredora',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    gender: 'F',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    distanceKm: 76.2,
    avgPace: "4'28\"",
    totalTime: '5h 40m',
    runsCount: 6,
    points: 1310,
  },
  {
    id: 'ath_3',
    rank: 3,
    name: 'Felipe Fontana',
    username: 'felipe.maratona',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    gender: 'M',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'Brasil',
    distanceKm: 68.8,
    avgPace: "4'45\"",
    totalTime: '5h 26m',
    runsCount: 5,
    points: 1180,
  },
  {
    id: 'ath_4',
    rank: 4,
    name: 'Camila Barros',
    username: 'camila.ritmo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    gender: 'F',
    city: 'Curitiba',
    state: 'PR',
    country: 'Brasil',
    distanceKm: 59.4,
    avgPace: "4'50\"",
    totalTime: '4h 48m',
    runsCount: 5,
    points: 1040,
  },
  {
    id: 'usr_carlos_01',
    rank: 5,
    name: 'Carlos Silva',
    username: 'carlos.corre',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    gender: 'M',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    distanceKm: 48.6,
    avgPace: "5'15\"",
    totalTime: '4h 15m',
    runsCount: 4,
    points: 920,
    isCurrentUser: true,
  },
  {
    id: 'ath_6',
    rank: 6,
    name: 'Mariana Costa',
    username: 'mari.running',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    gender: 'F',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    distanceKm: 42.1,
    avgPace: "5'22\"",
    totalTime: '3h 46m',
    runsCount: 4,
    points: 840,
  },
  {
    id: 'ath_7',
    rank: 7,
    name: 'Rodrigo Medeiros',
    username: 'rodrigo.maratonas',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    gender: 'M',
    city: 'Porto Alegre',
    state: 'RS',
    country: 'Brasil',
    distanceKm: 38.2,
    avgPace: "4'58\"",
    totalTime: '3h 10m',
    runsCount: 3,
    points: 790,
  },
  {
    id: 'ath_8',
    rank: 8,
    name: 'Patrícia Albuquerque',
    username: 'patricia.ativo',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    gender: 'F',
    city: 'Brasília',
    state: 'DF',
    country: 'Brasil',
    distanceKm: 32.5,
    avgPace: "6'10\"",
    totalTime: '3h 20m',
    runsCount: 4,
    points: 680,
  },
];

// FOLLOWERS & FOLLOWING SEED
export const INITIAL_FOLLOWERS: UserFollowItem[] = [
  { id: 'f1', name: 'Juliana Mendes', username: 'ju.corredora', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', city: 'São Paulo, SP', isFollowing: true, totalKm: 284 },
  { id: 'f2', name: 'Rodrigo Medeiros', username: 'rodrigo.maratonas', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', city: 'Porto Alegre, RS', isFollowing: true, totalKm: 612 },
  { id: 'f3', name: 'Mariana Costa', username: 'mari.running', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', city: 'Campinas, SP', isFollowing: false, totalKm: 145 },
  { id: 'f4', name: 'Gabriel Siqueira', username: 'gabriel.ultra', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', city: 'São Paulo, SP', isFollowing: true, totalKm: 980 },
];

export const INITIAL_FOLLOWING: UserFollowItem[] = [
  { id: 'fl1', name: 'Coach Marcos Lima', username: 'coach.marcoslima', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', city: 'São Paulo, SP', isFollowing: true, totalKm: 1420 },
  { id: 'fl2', name: 'Dra. Camila Nogueira', username: 'nutri.camilanogueira', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', city: 'São Paulo, SP', isFollowing: true, totalKm: 310 },
  { id: 'fl3', name: 'Equipe BHRace SP', username: 'bhrace.oficial', avatar: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=200&q=80', city: 'São Paulo, SP', isFollowing: true, totalKm: 4500 },
];

// Preserved Event Seeds
export { FEATURED_EVENTS, OTHER_EVENTS, INITIAL_POSTS, INITIAL_ROUTES, INITIAL_PROFESSIONALS, INITIAL_ACTIVITIES, INITIAL_RECORDS } from './storage_base';

import { FEATURED_EVENTS, OTHER_EVENTS, INITIAL_POSTS, INITIAL_ROUTES, INITIAL_PROFESSIONALS, INITIAL_ACTIVITIES, INITIAL_RECORDS } from './storage_base';

// Helper to get from local storage or initialize
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
}

export const StorageService = {
  // --- Profile & Session ---
  async getProfile(): Promise<UserProfile> {
    await fakeDelay(150, 300);
    const profile = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const maleRunnerAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';
    if (
      !profile.avatar ||
      profile.avatar.includes('photo-1534528741775-53994a69daeb') ||
      profile.avatar.includes('photo-1494790108377') ||
      profile.avatar.includes('photo-1544005313') ||
      profile.avatar.includes('photo-1573496359') ||
      profile.avatar.includes('photo-1567532939')
    ) {
      profile.avatar = maleRunnerAvatar;
      setStored(STORAGE_KEYS.USER_PROFILE, profile);
    }
    return profile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await fakeDelay(200, 400);
    const current = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  async updateAvatar(newAvatarUrl: string): Promise<UserProfile> {
    await fakeDelay(200, 350);
    const current = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const updated = { ...current, avatar: newAvatarUrl };
    setStored(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  // --- Achievements System ---
  async getAchievements(): Promise<Achievement[]> {
    await fakeDelay(100, 250);
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const stored = getStored<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, MASTER_ACHIEVEMENTS);
    // sync with user.unlockedAchievements
    return stored.map((ach) => ({
      ...ach,
      unlocked: user.unlockedAchievements?.includes(ach.key) || ach.unlocked,
    }));
  },

  async unlockAchievement(achievementKey: string): Promise<boolean> {
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    if (!user.unlockedAchievements.includes(achievementKey)) {
      user.unlockedAchievements.push(achievementKey);
      setStored(STORAGE_KEYS.USER_PROFILE, user);
      return true;
    }
    return false;
  },

  // --- Social Followers / Following ---
  async getFollowers(): Promise<UserFollowItem[]> {
    await fakeDelay(150, 300);
    return getStored<UserFollowItem[]>(STORAGE_KEYS.FOLLOWERS, INITIAL_FOLLOWERS);
  },

  async getFollowing(): Promise<UserFollowItem[]> {
    await fakeDelay(150, 300);
    return getStored<UserFollowItem[]>(STORAGE_KEYS.FOLLOWING, INITIAL_FOLLOWING);
  },

  async toggleFollowUser(userId: string): Promise<boolean> {
    await fakeDelay(150, 300);
    const following = getStored<UserFollowItem[]>(STORAGE_KEYS.FOLLOWING, INITIAL_FOLLOWING);
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    let isNowFollowing = false;

    const exists = following.find((f) => f.id === userId);
    if (exists) {
      const updated = following.filter((f) => f.id !== userId);
      setStored(STORAGE_KEYS.FOLLOWING, updated);
      user.followingCount = Math.max(0, user.followingCount - 1);
      isNowFollowing = false;
    } else {
      const followers = getStored<UserFollowItem[]>(STORAGE_KEYS.FOLLOWERS, INITIAL_FOLLOWERS);
      const target = followers.find((f) => f.id === userId);
      if (target) {
        following.push({ ...target, isFollowing: true });
        setStored(STORAGE_KEYS.FOLLOWING, following);
        user.followingCount += 1;
        isNowFollowing = true;
      }
    }
    setStored(STORAGE_KEYS.USER_PROFILE, user);
    return isNowFollowing;
  },

  // --- Marketplace ---
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    await fakeDelay(200, 400);
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const items = getStored<MarketplaceItem[]>(STORAGE_KEYS.MARKETPLACE, INITIAL_MARKETPLACE);
    return items.map((item) => ({
      ...item,
      isSaved: user.savedMarketplaceIds?.includes(item.id) || item.isSaved,
    }));
  },

  async saveMarketplaceItem(item: Omit<MarketplaceItem, 'id' | 'createdAt'>): Promise<MarketplaceItem> {
    await fakeDelay(400, 650);
    const items = getStored<MarketplaceItem[]>(STORAGE_KEYS.MARKETPLACE, INITIAL_MARKETPLACE);
    const newItem: MarketplaceItem = {
      ...item,
      id: `mkt_${Date.now()}`,
      createdAt: 'Agora mesmo',
    };
    const updated = [newItem, ...items];
    setStored(STORAGE_KEYS.MARKETPLACE, updated);
    return newItem;
  },

  async toggleSaveMarketplaceItem(itemId: string): Promise<boolean> {
    await fakeDelay(150, 300);
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    let saved = false;
    if (user.savedMarketplaceIds?.includes(itemId)) {
      user.savedMarketplaceIds = user.savedMarketplaceIds.filter((id) => id !== itemId);
      saved = false;
    } else {
      if (!user.savedMarketplaceIds) user.savedMarketplaceIds = [];
      user.savedMarketplaceIds.push(itemId);
      saved = true;
    }
    user.bookmarksCount = (user.savedMarketplaceIds?.length || 0) + (user.savedRouteIds?.length || 0);
    setStored(STORAGE_KEYS.USER_PROFILE, user);
    return saved;
  },

  // --- Rankings ---
  async getRankingAthletes(filters: {
    gender?: string;
    modality?: string;
    city?: string;
    state?: string;
    country?: string;
    period?: string;
  }): Promise<RankingAthlete[]> {
    await fakeDelay(250, 450);
    let list = [...INITIAL_RANKING_DATA];

    if (filters.gender && filters.gender !== 'todos') {
      list = list.filter((a) => a.gender === filters.gender);
    }
    if (filters.state && filters.state !== 'todos') {
      list = list.filter((a) => a.state === filters.state);
    }
    if (filters.city && filters.city !== 'todos') {
      list = list.filter((a) => a.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    // Re-rank
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  },

  // --- Activities ---
  async getActivities(): Promise<Activity[]> {
    await fakeDelay(150, 300);
    const acts = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    return acts.map((act) => {
      if (act.userId === 'usr_carlos_01' && (!act.userAvatar || act.userAvatar.includes('photo-1534528741775-53994a69daeb'))) {
        return { ...act, userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' };
      }
      return act;
    });
  },

  async saveActivity(activity: Omit<Activity, 'id' | 'likesCount' | 'likedByMe' | 'commentsCount' | 'savedByMe'>): Promise<Activity> {
    await fakeDelay(400, 650);
    const activities = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}`,
      likesCount: 0,
      likedByMe: false,
      commentsCount: 0,
      savedByMe: false,
    };
    const updated = [newActivity, ...activities];
    setStored(STORAGE_KEYS.ACTIVITIES, updated);

    // Update user accumulated stats
    const profile = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    profile.totalKm = parseFloat((profile.totalKm + newActivity.distanceKm).toFixed(1));
    profile.totalRuns += 1;
    profile.totalMinutes += Math.round(newActivity.durationSeconds / 60);
    profile.totalElevationM += newActivity.elevationGainMeters;

    // Check achievement unlock: first 5k
    if (newActivity.distanceKm >= 5.0 && !profile.unlockedAchievements.includes('first_5k')) {
      profile.unlockedAchievements.push('first_5k');
    }
    setStored(STORAGE_KEYS.USER_PROFILE, profile);

    return newActivity;
  },

  // --- Social Feed ---
  async getPosts(): Promise<Post[]> {
    await fakeDelay(150, 300);
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    return posts.map((post) => {
      if (post.authorId === 'usr_carlos_01' && (!post.authorAvatar || post.authorAvatar.includes('photo-1534528741775-53994a69daeb'))) {
        return { ...post, authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' };
      }
      return post;
    });
  },

  async toggleLikePost(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    await fakeDelay(150, 300);
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    let result = { liked: false, likesCount: 0 };
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.likedByMe;
        const nextCount = nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
        result = { liked: nextLiked, likesCount: nextCount };
        return { ...p, likedByMe: nextLiked, likesCount: nextCount };
      }
      return p;
    });
    setStored(STORAGE_KEYS.POSTS, updated);
    return result;
  },

  async addComment(postId: string, text: string): Promise<Post> {
    await fakeDelay(200, 350);
    const profile = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    let updatedPost: Post | null = null;
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const newComment = {
          id: `cmt_${Date.now()}`,
          authorId: profile.id,
          authorName: profile.name,
          authorAvatar: profile.avatar,
          content: text,
          createdAt: 'Agora mesmo',
        };
        const next = { ...p, comments: [...p.comments, newComment] };
        updatedPost = next;
        return next;
      }
      return p;
    });
    setStored(STORAGE_KEYS.POSTS, updated);
    return updatedPost || posts[0];
  },

  async toggleSavePost(postId: string): Promise<boolean> {
    await fakeDelay(150, 300);
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    let saved = false;
    const updated = posts.map((p) => {
      if (p.id === postId) {
        saved = !p.savedByMe;
        return { ...p, savedByMe: saved };
      }
      return p;
    });
    setStored(STORAGE_KEYS.POSTS, updated);
    return saved;
  },

  async toggleFollowAuthor(authorId: string): Promise<boolean> {
    await fakeDelay(150, 300);
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    let isFollowing = false;
    const updated = posts.map((p) => {
      if (p.authorId === authorId) {
        isFollowing = !p.isFollowingAuthor;
        return { ...p, isFollowingAuthor: isFollowing };
      }
      return p;
    });
    setStored(STORAGE_KEYS.POSTS, updated);
    return isFollowing;
  },

  async reportPost(postId: string, category: ReportCategory, notes: string): Promise<boolean> {
    await fakeDelay(250, 400);
    const reports = getStored<any[]>(STORAGE_KEYS.REPORTS, []);
    reports.push({ postId, category, notes, date: new Date().toISOString() });
    setStored(STORAGE_KEYS.REPORTS, reports);
    return true;
  },

  async blockUser(userId: string): Promise<boolean> {
    await fakeDelay(200, 350);
    const blocked = getStored<string[]>(STORAGE_KEYS.BLOCKED_USERS, []);
    if (!blocked.includes(userId)) {
      blocked.push(userId);
      setStored(STORAGE_KEYS.BLOCKED_USERS, blocked);
    }
    const posts = getStored<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    const filtered = posts.filter((p) => p.authorId !== userId);
    setStored(STORAGE_KEYS.POSTS, filtered);
    return true;
  },

  // --- Events & Registrations ---
  async getEvents(): Promise<EventItem[]> {
    await fakeDelay(150, 300);
    const all = [...FEATURED_EVENTS, ...OTHER_EVENTS];
    const registered = getStored<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const regIds = new Set(registered.map((r) => r.eventId));
    return all.map((evt) => ({
      ...evt,
      isRegistered: regIds.has(evt.id),
    }));
  },

  async getRegistrations(): Promise<EventRegistration[]> {
    await fakeDelay(150, 300);
    return getStored<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
  },

  async registerEvent(
    eventId: string,
    distance: string,
    paymentMethod: 'pix' | 'credit_card'
  ): Promise<EventRegistration> {
    await fakeDelay(400, 650);
    const profile = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    const allEvents = [...FEATURED_EVENTS, ...OTHER_EVENTS];
    const event = allEvents.find((e) => e.id === eventId) || allEvents[0];
    const registrations = getStored<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);

    const newReg: EventRegistration = {
      id: `reg_${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      isRemote: event.isRemote,
      selectedDistance: distance,
      athleteName: profile.name,
      bibNumber: Math.floor(1000 + Math.random() * 9000),
      paymentMethod,
      paymentStatus: 'confirmed',
      qrCodeToken: `IPACE-REG-${event.id}-${Date.now().toString(36).toUpperCase()}`,
      registeredAt: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.REGISTRATIONS, [newReg, ...registrations]);
    return newReg;
  },

  async createEvent(eventData: Omit<EventItem, 'id' | 'spotsTaken'>): Promise<EventItem> {
    await fakeDelay(450, 700);
    const newEvent: EventItem = {
      ...eventData,
      id: `evt_custom_${Date.now()}`,
      spotsTaken: 1,
    };
    OTHER_EVENTS.unshift(newEvent);
    return newEvent;
  },

  // --- Routes ---
  async getRoutes(): Promise<RouteItem[]> {
    await fakeDelay(150, 300);
    return getStored<RouteItem[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
  },

  async toggleFavoriteRoute(routeId: string): Promise<boolean> {
    await fakeDelay(150, 300);
    const routes = getStored<RouteItem[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
    let fav = false;
    const updated = routes.map((r) => {
      if (r.id === routeId) {
        fav = !r.isFavorite;
        return { ...r, isFavorite: fav };
      }
      return r;
    });
    setStored(STORAGE_KEYS.ROUTES, updated);

    // Sync in user savedRouteIds
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    if (!user.savedRouteIds) user.savedRouteIds = [];
    if (fav) {
      if (!user.savedRouteIds.includes(routeId)) user.savedRouteIds.push(routeId);
    } else {
      user.savedRouteIds = user.savedRouteIds.filter((id) => id !== routeId);
    }
    user.bookmarksCount = (user.savedMarketplaceIds?.length || 0) + (user.savedRouteIds?.length || 0);
    setStored(STORAGE_KEYS.USER_PROFILE, user);

    return fav;
  },

  async saveRoute(route: Omit<RouteItem, 'id' | 'rating' | 'reviewsCount' | 'isFavorite'>): Promise<RouteItem> {
    await fakeDelay(350, 550);
    const routes = getStored<RouteItem[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
    const newRoute: RouteItem = {
      ...route,
      id: `rt_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isFavorite: true,
    };
    setStored(STORAGE_KEYS.ROUTES, [newRoute, ...routes]);

    // Unlock achievement route_creator
    const user = getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    if (!user.unlockedAchievements.includes('route_creator')) {
      user.unlockedAchievements.push('route_creator');
      setStored(STORAGE_KEYS.USER_PROFILE, user);
    }

    return newRoute;
  },

  // --- Services & Professionals ---
  async getProfessionals(): Promise<Professional[]> {
    await fakeDelay(150, 300);
    return getStored<Professional[]>(STORAGE_KEYS.PROFESSIONALS, INITIAL_PROFESSIONALS);
  },

  async getBookings(): Promise<ServiceBooking[]> {
    await fakeDelay(150, 300);
    return getStored<ServiceBooking[]>(STORAGE_KEYS.BOOKINGS, []);
  },

  async createBooking(pro: Professional, slot: string): Promise<ServiceBooking> {
    await fakeDelay(350, 600);
    const bookings = getStored<ServiceBooking[]>(STORAGE_KEYS.BOOKINGS, []);
    const newBooking: ServiceBooking = {
      id: `bk_${Date.now()}`,
      professionalId: pro.id,
      professionalName: pro.name,
      role: pro.role,
      dateTime: slot,
      price: pro.pricePerSession,
      status: 'confirmado',
    };
    setStored(STORAGE_KEYS.BOOKINGS, [newBooking, ...bookings]);
    return newBooking;
  },

  // --- Records ---
  async getRecords(): Promise<PersonalRecord[]> {
    return INITIAL_RECORDS;
  },
};

export function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
