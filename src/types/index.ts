export type ActivityType = 'running' | 'walking';
export type ActivityMode = 'free' | 'route' | 'event';

export interface Split {
  km: number;
  timeSeconds: number;
  pace: string;
  elevationDiff: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  type: ActivityType;
  mode: ActivityMode;
  date: string; // ISO string
  durationSeconds: number;
  distanceKm: number;
  avgPace: string; // e.g. "5:12"
  bestPace: string;
  avgSpeedKmH: number;
  calories: number;
  cadenceAvg: number;
  elevationGainMeters: number;
  sensation: 'easy' | 'moderate' | 'hard' | 'exhausting';
  notes: string;
  coordinates: [number, number][]; // [lat, lng]
  splits: Split[];
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  savedByMe: boolean;
}

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  criteria: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'distance' | 'consistency' | 'events' | 'routes' | 'ai';
  progress: number; // 0 - 100
  currentValue?: number;
  targetValue?: number;
  unit?: string;
}

export interface UserFollowItem {
  id: string;
  name: string;
  username: string;
  avatar: string;
  city: string;
  isFollowing: boolean;
  totalKm: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  gender: 'M' | 'F' | 'Outro';
  targetDistance: '5k' | '10k' | '21k' | '42k' | 'saude';
  level: 'iniciante' | 'intermediario' | 'avancado' | 'elite';
  weightKg: number;
  heightCm: number;
  totalKm: number;
  totalRuns: number;
  totalMinutes: number;
  totalElevationM: number;
  weeklyGoalKm: number;
  yearlyGoalKm: number;
  teams: string[];
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  unlockedAchievements: string[];
  savedRouteIds: string[];
  savedMarketplaceIds: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  date: string;
  time: string;
  location: string;
  isRemote: boolean;
  distances: string[]; // e.g. ["5K", "10K", "21K"]
  price: number;
  spotsTotal: number;
  spotsTaken: number;
  organizer: string;
  rules: string;
  kitDescription: string;
  categories: string[];
  isRegistered?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  isRemote: boolean;
  selectedDistance: string;
  athleteName: string;
  bibNumber: number;
  paymentMethod: 'pix' | 'credit_card';
  paymentStatus: 'confirmed' | 'pending';
  qrCodeToken: string;
  registeredAt: string;
}

export interface RouteItem {
  id: string;
  name: string;
  description: string;
  distanceKm: number;
  elevationGainM: number;
  difficulty: 'fácil' | 'moderada' | 'difícil';
  terrain: 'asfalto' | 'terra' | 'misto' | 'pista';
  city: string;
  rating: number;
  reviewsCount: number;
  coordinates: [number, number][];
  isFavorite: boolean;
  authorName: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorType: 'user' | 'team' | 'pro';
  isFollowingAuthor: boolean;
  content: string;
  imageUrl?: string;
  activityStats?: {
    distanceKm: number;
    durationStr: string;
    paceStr: string;
    type: ActivityType;
  };
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  comments: Comment[];
  savedByMe: boolean;
  routePreviewUrl?: string;
}

export type MarketplaceCategory =
  | 'todos'
  | 'tenis'
  | 'relogios'
  | 'vestuario'
  | 'suplementos'
  | 'acessorios'
  | 'servicos';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  condition: 'novo' | 'seminovo' | 'servico';
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerCity: string;
  sellerContact: string; // WhatsApp or Phone
  isSaved?: boolean;
  createdAt: string;
  badge?: string; // e.g. "Placa de Carbono", "Profissional Verificado", "Destaque"
}

export interface Professional {
  id: string;
  name: string;
  role: 'Preparador Físico' | 'Nutricionista' | 'Fisioterapeuta' | 'Cardiologista' | 'Psicólogo do Esporte';
  verified: boolean;
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  avatar: string;
  bio: string;
  city: string;
  registry: string; // e.g. CREF 049210-G/SP
  specialties: string[];
  availableSlots: string[];
}

export interface ServiceBooking {
  id: string;
  professionalId: string;
  professionalName: string;
  role: string;
  dateTime: string;
  price: number;
  status: 'confirmado' | 'pendente';
}

export interface PersonalRecord {
  category: '1k' | '5k' | '10k' | '21k' | 'maior_distancia' | 'maior_sequencia';
  label: string;
  value: string;
  date: string;
  activityId?: string;
}

export interface RankingAthlete {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatar: string;
  gender: 'M' | 'F';
  city: string;
  state: string;
  country: string;
  distanceKm: number;
  avgPace: string;
  totalTime: string;
  runsCount: number;
  points: number;
  isCurrentUser?: boolean;
}

export type RankingModality = '5k' | '10k' | '21k' | '42k' | 'total_km';
export type RankingPeriod = 'semana' | 'mes' | 'ano' | 'geral';
export type RankingGender = 'todos' | 'M' | 'F';
export type RankingScope = 'todos' | 'municipio' | 'estado' | 'pais';

export type ReportCategory = 'spam' | 'assedio' | 'odio' | 'improprio' | 'fraude' | 'outro';
