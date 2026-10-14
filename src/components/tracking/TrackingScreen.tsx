import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityType, ActivityMode, Split, RouteItem } from '../../types';
import { RunMap } from './RunMap';
import { RunSummaryModal } from './RunSummaryModal';
import { useAuth } from '../../context/AuthContext';
import { StorageService, formatSeconds } from '../../services/storage';
import {
  Play,
  Pause,
  Square,
  Lock,
  Unlock,
  Radio,
  MapPin,
  Flame,
  Activity as ActivityIcon,
  Navigation,
  Compass,
  Map as MapIcon,
  Plus,
  Upload,
  Download,
  Star,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface TrackingScreenProps {
  initialMode?: ActivityMode;
  initialRouteName?: string;
  onActivitySaved?: (activity: Activity) => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  initialMode = 'free',
  initialRouteName,
  onActivitySaved,
}) => {
  const { user } = useAuth();

  // 3 Primary Modality Cards: 'corrida' | 'caminhada' | 'rota'
  const [selectedModality, setSelectedModality] = useState<'corrida' | 'caminhada' | 'rota'>('corrida');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Routes integration inside tracking
  const [availableRoutes, setAvailableRoutes] = useState<RouteItem[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  const [showRouteCreator, setShowRouteCreator] = useState(false);

  // New Route Form
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteCity, setNewRouteCity] = useState('São Paulo, SP');
  const [drawnPoints] = useState<[number, number][]>([
    [-23.5874, -46.6576],
    [-23.5842, -46.6548],
    [-23.5818, -46.6601],
    [-23.5861, -46.6632],
  ]);

  // Live Tracking State
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [unlockProgress, setUnlockProgress] = useState<number>(0);
  const unlockTimerRef = useRef<any>(null);

  // Live Metrics
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [currentSpeedKmH, setCurrentSpeedKmH] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [cadence, setCadence] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [splits, setSplits] = useState<Split[]>([]);

  // GPS Accuracy status
  const [gpsAccuracy, setGpsAccuracy] = useState<string>('Sinal Forte (±3m)');

  // Summary Modal
  const [completedActivity, setCompletedActivity] = useState<Omit<
    Activity,
    'id' | 'likesCount' | 'likedByMe' | 'commentsCount' | 'savedByMe'
  > | null>(null);

  // Stop confirmation prompt
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Coordinates ref & watch id
  const currentCoordRef = useRef<[number, number]>([-23.5874, -46.6576]);
  const watchIdRef = useRef<number | null>(null);

  // Load community routes
  useEffect(() => {
    const loadRoutes = async () => {
      const data = await StorageService.getRoutes();
      setAvailableRoutes(data);
      if (initialRouteName) {
        const matching = data.find((r) => r.name === initialRouteName);
        if (matching) {
          setSelectedRoute(matching);
          setSelectedModality('rota');
        }
      } else if (data.length > 0) {
        setSelectedRoute(data[0]);
      }
    };
    loadRoutes();
  }, [initialRouteName]);

  // Live Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (trackingStatus === 'running') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        if (isDemoMode) {
          const isWalking = selectedModality === 'caminhada';
          const baseSpeed = isWalking ? 5.8 : 11.4;
          const speedVariation = (Math.random() - 0.5) * 1.2;
          const currentSpeed = Math.max(3.0, baseSpeed + speedVariation);
          setCurrentSpeedKmH(parseFloat(currentSpeed.toFixed(1)));

          const kmPerSecond = currentSpeed / 3600;
          setDistanceKm((prevDist) => {
            const nextDist = prevDist + kmPerSecond;

            // Check if full kilometer completed
            const prevKmInt = Math.floor(prevDist);
            const nextKmInt = Math.floor(nextDist);
            if (nextKmInt > prevKmInt) {
              const splitTime = isWalking ? 620 : 312;
              setSplits((prevSplits) => [
                ...prevSplits,
                {
                  km: nextKmInt,
                  timeSeconds: splitTime,
                  pace: isWalking ? "10'20\"" : "5'12\"",
                  elevationDiff: Math.floor(Math.random() * 6) - 2,
                },
              ]);
            }

            return nextDist;
          });

          // Calories calculation
          const weight = user?.weightKg || 72;
          const met = isWalking ? 3.8 : 9.8;
          setCalories((prev) => {
            const calPerSec = (met * 3.5 * weight) / (200 * 60);
            return Math.round(prev + calPerSec);
          });

          // Cadence
          const baseCadence = isWalking ? 110 : 172;
          setCadence(baseCadence + Math.floor(Math.random() * 6 - 3));

          // Move coordinates slightly
          const angle = Date.now() / 15000;
          const latDelta = Math.sin(angle) * 0.00018;
          const lngDelta = Math.cos(angle) * 0.00018;
          currentCoordRef.current = [
            currentCoordRef.current[0] + latDelta,
            currentCoordRef.current[1] + lngDelta,
          ];
          setCoordinates((prev) => [...prev, [...currentCoordRef.current]]);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trackingStatus, isDemoMode, selectedModality, user?.weightKg]);

  // Real Geolocation Hook
  useEffect(() => {
    if (!isDemoMode && trackingStatus === 'running' && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;
          setGpsAccuracy(`GPS Real (±${Math.round(accuracy)}m)`);
          if (speed && speed > 0) {
            setCurrentSpeedKmH(parseFloat((speed * 3.6).toFixed(1)));
          }
          currentCoordRef.current = [latitude, longitude];
          setCoordinates((prev) => [...prev, [latitude, longitude]]);
        },
        (err) => {
          console.warn('Geolocation error or denied, falling back to Demo Mode', err);
          setGpsAccuracy('GPS Indisponível (Demo Ativado)');
          setIsDemoMode(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isDemoMode, trackingStatus]);

  // Pace calculations
  const calculatePace = (distKm: number, timeSec: number): string => {
    if (distKm <= 0.05 || timeSec < 5) return "--'--\"";
    const paceSecondsPerKm = timeSec / distKm;
    const paceMin = Math.floor(paceSecondsPerKm / 60);
    const paceSec = Math.floor(paceSecondsPerKm % 60);
    if (paceMin > 30) return "--'--\"";
    return `${paceMin}'${paceSec.toString().padStart(2, '0')}"`;
  };

  const avgPace = calculatePace(distanceKm, elapsedSeconds);
  const currentPace =
    currentSpeedKmH > 1.0 ? calculatePace(1, 3600 / currentSpeedKmH) : "--'--\"";

  // Actions
  const handleStart = () => {
    setTrackingStatus('running');
    if (selectedModality === 'rota' && selectedRoute) {
      setCoordinates(selectedRoute.coordinates);
      currentCoordRef.current = selectedRoute.coordinates[0];
    } else if (coordinates.length === 0) {
      setCoordinates([currentCoordRef.current]);
    }
  };

  const handlePause = () => setTrackingStatus('paused');
  const handleResume = () => setTrackingStatus('running');

  const handleConfirmFinish = () => {
    setShowStopConfirm(false);
    setTrackingStatus('finished');

    const activityType: ActivityType = selectedModality === 'caminhada' ? 'walking' : 'running';
    const activityMode: ActivityMode = selectedModality === 'rota' ? 'route' : 'free';

    const titlePrefix =
      selectedModality === 'caminhada'
        ? 'Caminhada'
        : selectedModality === 'rota' && selectedRoute
        ? `Corrida na Rota ${selectedRoute.name}`
        : 'Corrida de Rua';

    const activitySummary: Omit<
      Activity,
      'id' | 'likesCount' | 'likedByMe' | 'commentsCount' | 'savedByMe'
    > = {
      userId: user?.id || 'usr_carlos_01',
      userName: user?.name || 'Carlos Silva',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      title: `${titlePrefix} ao Ar Livre`,
      type: activityType,
      mode: activityMode,
      date: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      avgPace: avgPace.replace(/['"]/g, ':'),
      bestPace: '4:35',
      avgSpeedKmH: currentSpeedKmH || 11.2,
      calories: calories || 180,
      cadenceAvg: cadence || 168,
      elevationGainMeters: selectedRoute ? selectedRoute.elevationGainM : 38,
      sensation: 'moderate',
      notes: `Treino gravado no modo ${selectedModality.toUpperCase()} no IPACE Running App.`,
      coordinates: coordinates.length > 0 ? coordinates : [currentCoordRef.current],
      splits: splits.length > 0 ? splits : [{ km: 1, timeSeconds: elapsedSeconds, pace: avgPace, elevationDiff: 2 }],
    };

    setCompletedActivity(activitySummary);
  };

  const handleSaveActivity = async (
    act: Omit<Activity, 'id' | 'likesCount' | 'likedByMe' | 'commentsCount' | 'savedByMe'>
  ) => {
    const saved = await StorageService.saveActivity(act);
    if (onActivitySaved) onActivitySaved(saved);
    setTrackingStatus('idle');
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCalories(0);
    setCoordinates([]);
    setSplits([]);
    setCompletedActivity(null);
  };

  // Lock hold mechanism
  const startUnlockHold = () => {
    let p = 0;
    unlockTimerRef.current = setInterval(() => {
      p += 20;
      setUnlockProgress(p);
      if (p >= 100) {
        clearInterval(unlockTimerRef.current);
        setIsScreenLocked(false);
        setUnlockProgress(0);
      }
    }, 100);
  };

  const cancelUnlockHold = () => {
    if (unlockTimerRef.current) {
      clearInterval(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
    setUnlockProgress(0);
  };

  const handleSaveNewRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) return;
    const created = await StorageService.saveRoute({
      name: newRouteName.trim(),
      description: 'Rota criada pela comunidade no painel de corrida.',
      distanceKm: 6.2,
      elevationGainM: 35,
      difficulty: 'fácil',
      terrain: 'asfalto',
      city: newRouteCity,
      coordinates: drawnPoints,
      authorName: user?.name || 'Você',
    });
    setAvailableRoutes([created, ...availableRoutes]);
    setSelectedRoute(created);
    setShowRouteCreator(false);
    setNewRouteName('');
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] pb-24 max-w-4xl mx-auto">
      {/* 1. PRE-RUN CONFIGURATION SCREEN (IDLE) */}
      {trackingStatus === 'idle' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--ipace-primary)] shrink-0">
                  Corrida e Atividade
                </span>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                <h2 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-[var(--ipace-text)] truncate">
                  Selecione sua Modalidade
                </h2>
              </div>

              {/* GPS status pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                <span>{gpsAccuracy}</span>
              </div>
            </div>

            {/* 3 INTEGRATED MODALITY CARDS AS REQUESTED: Corrida de Rua, Caminhada, Rota */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
              {/* Card 1: Corrida de Rua */}
              <button
                type="button"
                onClick={() => setSelectedModality('corrida')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  selectedModality === 'corrida'
                    ? 'border-[var(--ipace-primary)] bg-[var(--ipace-soft)] ring-2 ring-[var(--ipace-primary)] shadow-md'
                    : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:border-gray-400'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    selectedModality === 'corrida'
                      ? 'bg-[var(--ipace-primary)] text-white'
                      : 'bg-[var(--ipace-surface)] text-[var(--ipace-primary)]'
                  }`}
                >
                  <ActivityIcon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-base text-[var(--ipace-text)] mb-1">
                  Corrida de Rua
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)] leading-relaxed">
                  Gravação contínua com GPS, ritmo médio, splits por km e queima calórica.
                </p>
                {selectedModality === 'corrida' && (
                  <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[var(--ipace-primary)]" />
                )}
              </button>

              {/* Card 2: Caminhada */}
              <button
                type="button"
                onClick={() => setSelectedModality('caminhada')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  selectedModality === 'caminhada'
                    ? 'border-[var(--ipace-primary)] bg-[var(--ipace-soft)] ring-2 ring-[var(--ipace-primary)] shadow-md'
                    : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:border-gray-400'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    selectedModality === 'caminhada'
                      ? 'bg-[var(--ipace-primary)] text-white'
                      : 'bg-[var(--ipace-surface)] text-[var(--ipace-primary)]'
                  }`}
                >
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-base text-[var(--ipace-text)] mb-1">
                  Caminhada
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)] leading-relaxed">
                  Treino aeróbico, recuperação muscular ativa, ritmo calmo e passos.
                </p>
                {selectedModality === 'caminhada' && (
                  <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[var(--ipace-primary)]" />
                )}
              </button>

              {/* Card 3: Rota */}
              <button
                type="button"
                onClick={() => setSelectedModality('rota')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  selectedModality === 'rota'
                    ? 'border-[var(--ipace-primary)] bg-[var(--ipace-soft)] ring-2 ring-[var(--ipace-primary)] shadow-md'
                    : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:border-gray-400'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    selectedModality === 'rota'
                      ? 'bg-[var(--ipace-primary)] text-white'
                      : 'bg-[var(--ipace-surface)] text-[var(--ipace-primary)]'
                  }`}
                >
                  <MapIcon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-base text-[var(--ipace-text)] mb-1">
                  Seguir Rota
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)] leading-relaxed">
                  Escolha trajetos mapeados, altimetria, importe GPX e corra com guia visual.
                </p>
                {selectedModality === 'rota' && (
                  <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[var(--ipace-primary)]" />
                )}
              </button>
            </div>

            {/* INTEGRATED ROUTE SELECTION DRAWER IF "ROTA" IS SELECTED */}
            {selectedModality === 'rota' && (
              <div className="bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] rounded-3xl p-5 mb-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-black text-sm text-[var(--ipace-text)] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[var(--ipace-primary)]" />
                    Escolher Percurso Comunitário
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowRouteCreator(!showRouteCreator)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--ipace-surface)] border border-[var(--ipace-border)] text-[var(--ipace-primary)] hover:border-[var(--ipace-primary)] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showRouteCreator ? 'Fechar Criador' : 'Criar Nova Rota'}
                  </button>
                </div>

                {/* Inline Route Creator Form */}
                {showRouteCreator && (
                  <form onSubmit={handleSaveNewRoute} className="bg-[var(--ipace-surface)] p-4 rounded-2xl border border-[var(--ipace-border)] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                          Nome da Rota
                        </label>
                        <input
                          type="text"
                          required
                          value={newRouteName}
                          onChange={(e) => setNewRouteName(e.target.value)}
                          placeholder="Ex: Volta no Parque Ibirapuera 6K"
                          className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[var(--ipace-text)] mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={newRouteCity}
                          onChange={(e) => setNewRouteCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] cursor-pointer"
                    >
                      Salvar Rota &amp; Selecionar
                    </button>
                  </form>
                )}

                {/* Route Cards Carousel / Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableRoutes.map((route) => {
                    const isPicked = selectedRoute?.id === route.id;
                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isPicked
                            ? 'border-[var(--ipace-primary)] bg-[var(--ipace-surface)] ring-2 ring-[var(--ipace-primary)]/30 shadow-sm'
                            : 'border-[var(--ipace-border)] bg-[var(--ipace-surface)] hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[var(--ipace-primary)] uppercase flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {route.city}
                          </span>
                          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" /> {route.rating}
                          </span>
                        </div>
                        <h5 className="font-heading font-black text-xs text-[var(--ipace-text)] truncate">
                          {route.name}
                        </h5>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--ipace-text-2)] mt-2">
                          <span className="text-[var(--ipace-text)]">{route.distanceKm} km</span>
                          <span>+{route.elevationGainM}m</span>
                          <span className="capitalize text-[10px] bg-[var(--ipace-surface-2)] px-2 py-0.5 rounded-full">
                            {route.terrain}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GPS Simulation / Demo Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] mb-6">
              <div>
                <span className="text-xs font-bold text-[var(--ipace-text)] block">
                  Simulador de GPS Ativo (Modo Demonstração)
                </span>
                <span className="text-[10px] text-[var(--ipace-text-2)]">
                  Gera deslocamento instantâneo no mapa para testar métricas e splits.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="w-5 h-5 rounded accent-[var(--ipace-primary)] cursor-pointer"
              />
            </div>

            {/* Big Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-5 px-6 rounded-3xl font-heading font-black text-base uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] active:bg-[var(--ipace-active)] transition-all shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Play className="w-6 h-6 fill-current transition-transform group-hover:scale-110" />
              Iniciar {selectedModality === 'corrida' ? 'Corrida de Rua' : selectedModality === 'caminhada' ? 'Caminhada' : `Rota: ${selectedRoute?.name || 'Comunitária'}`}
            </button>
          </div>

          {/* Interactive Map Preview */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-extrabold text-xs text-[var(--ipace-text)]">
                {selectedModality === 'rota' && selectedRoute
                  ? `Traçado da Rota Selecionada: ${selectedRoute.name}`
                  : 'Visão do Ponto de Partida'}
              </span>
              <span className="text-xs text-[var(--ipace-text-2)]">
                {selectedModality === 'rota' && selectedRoute ? `${selectedRoute.distanceKm} km` : 'Parque Ibirapuera, SP'}
              </span>
            </div>
            <RunMap
              coordinates={
                selectedModality === 'rota' && selectedRoute
                  ? selectedRoute.coordinates
                  : [currentCoordRef.current]
              }
              className="h-64 sm:h-72 w-full"
            />
          </div>
        </div>
      )}

      {/* 2. ACTIVE LIVE TRACKING DASHBOARD */}
      {(trackingStatus === 'running' || trackingStatus === 'paused') && (
        <div className="space-y-4 animate-fade-in relative">
          {/* Screen Lock Screen Overlay */}
          {isScreenLocked && (
            <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center text-white select-none">
              <div className="w-16 h-16 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-400 mb-4 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-2xl mb-1">Tela Bloqueada</h3>
              <p className="text-xs text-gray-300 max-w-xs mb-8">
                Toques acidentais bloqueados para você correr livre.
              </p>

              <div className="relative flex flex-col items-center">
                <button
                  type="button"
                  onMouseDown={startUnlockHold}
                  onMouseUp={cancelUnlockHold}
                  onTouchStart={startUnlockHold}
                  onTouchEnd={cancelUnlockHold}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-red-500/50 flex flex-col items-center justify-center font-heading font-black text-xs uppercase tracking-wider bg-red-950/40 text-white cursor-pointer active:scale-95 transition-transform"
                >
                  <Unlock className="w-6 h-6 mb-1 text-red-400" />
                  Segure para Destravar
                </button>

                {unlockProgress > 0 && (
                  <div className="w-48 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-full bg-[var(--ipace-primary)] transition-all duration-100"
                      style={{ width: `${unlockProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Status & Lock Trigger */}
          <div className="flex items-center justify-between bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  trackingStatus === 'running' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                }`}
              />
              <span className="font-heading font-bold text-xs uppercase text-[var(--ipace-text)]">
                {trackingStatus === 'running'
                  ? `Gravando ${selectedModality === 'caminhada' ? 'Caminhada' : 'Corrida'}`
                  : 'Treino em Pausa'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsScreenLocked(true)}
              className="p-1.5 rounded-lg border border-[var(--ipace-border)] text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] text-xs flex items-center gap-1 cursor-pointer"
              title="Bloquear tela contra toques"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Travar Tela</span>
            </button>
          </div>

          {/* Live Metrics Display */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-8 shadow-md text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ipace-text-2)]">
              Distância Percorrida
            </div>
            <div className="font-heading font-black text-6xl sm:text-7xl text-[var(--ipace-primary)] tracking-tight my-2">
              {distanceKm.toFixed(2)}
              <span className="text-2xl text-[var(--ipace-text-2)] font-bold ml-2">km</span>
            </div>

            <div className="inline-block px-5 py-1.5 rounded-full bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] mb-6">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] tracking-wider">
                {formatSeconds(elapsedSeconds)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[var(--ipace-border)]">
              <div className="bg-[var(--ipace-surface-2)] p-3 rounded-2xl">
                <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Pace Atual</div>
                <div className="font-heading font-black text-xl text-[var(--ipace-primary)] mt-0.5">
                  {currentPace}
                  <span className="text-[10px] font-medium text-[var(--ipace-text-2)]">/km</span>
                </div>
              </div>

              <div className="bg-[var(--ipace-surface-2)] p-3 rounded-2xl">
                <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Pace Médio</div>
                <div className="font-heading font-black text-xl text-[var(--ipace-text)] mt-0.5">
                  {avgPace}
                  <span className="text-[10px] font-medium text-[var(--ipace-text-2)]">/km</span>
                </div>
              </div>

              <div className="bg-[var(--ipace-surface-2)] p-3 rounded-2xl">
                <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Velocidade</div>
                <div className="font-heading font-black text-xl text-[var(--ipace-text)] mt-0.5">
                  {currentSpeedKmH.toFixed(1)}
                  <span className="text-[10px] font-medium text-[var(--ipace-text-2)]"> km/h</span>
                </div>
              </div>

              <div className="bg-[var(--ipace-surface-2)] p-3 rounded-2xl">
                <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Calorias</div>
                <div className="font-heading font-black text-xl text-amber-600 mt-0.5">
                  {calories}
                  <span className="text-[10px] font-medium text-[var(--ipace-text-2)]"> kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Map */}
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-heading font-extrabold text-xs text-[var(--ipace-text)] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[var(--ipace-primary)]" />
                Traçado ao Vivo (Leaflet + OpenStreetMap)
              </span>
              <span className="text-[10px] text-[var(--ipace-text-2)]">
                {coordinates.length} pontos gravados
              </span>
            </div>
            <RunMap coordinates={coordinates} isLive={true} className="h-56 sm:h-64 w-full" />
          </div>

          {/* Big Action Controls */}
          <div className="flex items-center gap-3 pt-2">
            {trackingStatus === 'running' ? (
              <button
                type="button"
                onClick={handlePause}
                className="flex-1 py-4 px-6 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-current" />
                Pausar Treino
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResume}
                className="flex-1 py-4 px-6 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Retomar
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowStopConfirm(true)}
              className="py-4 px-8 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Square className="w-5 h-5 fill-current" />
              Finalizar
            </button>
          </div>
        </div>
      )}

      {/* Stop Confirmation Dialog */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center animate-scale-up">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-[var(--ipace-primary)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Square className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-1">
              Finalizar Atividade?
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)] mb-5">
              Você percorreu <strong>{distanceKm.toFixed(2)} km</strong> em{' '}
              <strong>{formatSeconds(elapsedSeconds)}</strong>. Deseja encerrar e ver os splits?
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--ipace-border)] text-xs font-bold text-[var(--ipace-text)] hover:bg-[var(--ipace-surface-2)]"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={handleConfirmFinish}
                className="flex-1 py-2.5 rounded-xl text-xs font-heading font-black uppercase text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md"
              >
                Sim, Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RUN SUMMARY MODAL */}
      {completedActivity && (
        <RunSummaryModal
          activity={completedActivity}
          onSave={handleSaveActivity}
          onClose={() => setCompletedActivity(null)}
        />
      )}
    </div>
  );
};
