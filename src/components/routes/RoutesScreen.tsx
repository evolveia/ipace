import React, { useState, useEffect } from 'react';
import { RouteItem } from '../../types';
import { StorageService } from '../../services/storage';
import { RunMap } from '../tracking/RunMap';
import {
  Map,
  Plus,
  Heart,
  Share2,
  Download,
  Upload,
  TrendingUp,
  Star,
  Check,
  Play,
  MapPin,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface RoutesScreenProps {
  onStartRouteRun: (route: RouteItem) => void;
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({ onStartRouteRun }) => {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // New Route Form State
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteDesc, setNewRouteDesc] = useState('');
  const [newRouteCity, setNewRouteCity] = useState('São Paulo, SP');
  const [newRouteTerrain, setNewRouteTerrain] = useState<'asfalto' | 'terra' | 'misto' | 'pista'>('asfalto');
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([
    [-23.5874, -46.6576],
    [-23.5842, -46.6548],
    [-23.5818, -46.6601],
  ]);

  useEffect(() => {
    const load = async () => {
      const data = await StorageService.getRoutes();
      setRoutes(data);
      if (data.length > 0) setSelectedRoute(data[0]);
    };
    load();
  }, []);

  const handleToggleFavorite = async (routeId: string) => {
    const fav = await StorageService.toggleFavoriteRoute(routeId);
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, isFavorite: fav } : r))
    );
    if (selectedRoute?.id === routeId) {
      setSelectedRoute((prev) => (prev ? { ...prev, isFavorite: fav } : null));
    }
  };

  const handleExportGPX = (route: RouteItem) => {
    // Generate valid GPX XML content
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="IPACE Running App - https://ipace.app" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${route.name}</name>
    <desc>${route.description}</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${route.name}</name>
    <type>Running</type>
    <trkseg>
      ${route.coordinates
        .map(
          (c) => `<trkpt lat="${c[0]}" lon="${c[1]}">
        <ele>${Math.round(route.elevationGainM / 2)}</ele>
      </trkpt>`
        )
        .join('\n      ')}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${route.name.toLowerCase().replace(/\s+/g, '_')}_ipace.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportGPXMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate GPX import
      const importedRoute: RouteItem = {
        id: `rt_imp_${Date.now()}`,
        name: file.name.replace('.gpx', '') || 'Rota Importada GPX',
        description: 'Rota importada de dispositivo GPS Garmin / Strava.',
        distanceKm: 6.8,
        elevationGainM: 42,
        difficulty: 'moderada',
        terrain: 'asfalto',
        city: 'Importada',
        rating: 5.0,
        reviewsCount: 1,
        coordinates: [
          [-23.5874, -46.6576],
          [-23.5855, -46.6552],
          [-23.5832, -46.6578],
          [-23.5821, -46.6610],
          [-23.5845, -46.6635],
          [-23.5874, -46.6576],
        ],
        isFavorite: true,
        authorName: 'Você (GPX)',
      };
      setRoutes([importedRoute, ...routes]);
      setSelectedRoute(importedRoute);
      alert('Arquivo GPX importado com sucesso!');
    }
  };

  const handleSaveDrawnRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) return;

    const newRoute = await StorageService.saveRoute({
      name: newRouteName.trim(),
      description: newRouteDesc.trim() || 'Percurso traçado na comunidade IPACE.',
      distanceKm: parseFloat((drawnPoints.length * 1.4).toFixed(1)),
      elevationGainM: Math.round(drawnPoints.length * 8.5),
      difficulty: 'fácil',
      terrain: newRouteTerrain,
      city: newRouteCity,
      coordinates: drawnPoints,
      authorName: 'Você',
    });

    setRoutes([newRoute, ...routes]);
    setSelectedRoute(newRoute);
    setIsCreating(false);
    setNewRouteName('');
    setNewRouteDesc('');
  };

  const handleShareRoute = async (route: RouteItem) => {
    const text = `Confira a rota "${route.name}" (${route.distanceKm}km) no IPACE Running App!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: route.name,
          text,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ipace-primary)]">
            Explore Novos Lugares
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-0.5">
            Rotas da Comunidade
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Import GPX hidden file input */}
          <label className="px-3.5 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface)] hover:bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)] flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importar</span> GPX
            <input
              type="file"
              accept=".gpx"
              onChange={handleImportGPXMock}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Criar Rota
          </button>
        </div>
      </div>

      {/* Rota Selecionada: Destaque com Mapa Interativo */}
      {selectedRoute && (
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 sm:p-6 shadow-md">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Map Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-[var(--ipace-primary)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedRoute.city}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{selectedRoute.rating}</span>
                  <span className="text-[var(--ipace-text-2)] font-normal">
                    ({selectedRoute.reviewsCount} avaliações)
                  </span>
                </div>
              </div>

              <h3 className="font-heading font-black text-xl sm:text-2xl text-[var(--ipace-text)] mb-1">
                {selectedRoute.name}
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] mb-4 leading-relaxed">
                {selectedRoute.description}
              </p>

              <RunMap coordinates={selectedRoute.coordinates} className="h-60 sm:h-72 w-full mb-4" />

              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)] text-center">
                <div>
                  <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Extensão</div>
                  <div className="font-heading font-black text-lg text-[var(--ipace-primary)]">
                    {selectedRoute.distanceKm} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Elevação</div>
                  <div className="font-heading font-black text-lg text-[var(--ipace-text)]">
                    +{selectedRoute.elevationGainM}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Dificuldade</div>
                  <div className="font-heading font-black text-xs uppercase text-emerald-600 mt-1">
                    {selectedRoute.difficulty}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions Column */}
            <div className="w-full lg:w-64 flex flex-col justify-between space-y-4 pt-2 lg:pt-8 border-t lg:border-t-0 lg:border-l border-[var(--ipace-border)] lg:pl-6">
              <div className="space-y-3">
                <div className="text-xs text-[var(--ipace-text-2)]">
                  Criada por: <strong className="text-[var(--ipace-text)]">{selectedRoute.authorName}</strong>
                </div>
                <div className="text-xs text-[var(--ipace-text-2)]">
                  Tipo de Piso: <strong className="text-[var(--ipace-text)] capitalize">{selectedRoute.terrain}</strong>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(selectedRoute.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      selectedRoute.isFavorite
                        ? 'border-red-400 bg-red-50 text-[var(--ipace-primary)] dark:bg-red-950/40'
                        : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] hover:border-gray-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${selectedRoute.isFavorite ? 'fill-current' : ''}`} />
                    {selectedRoute.isFavorite ? 'Favorita' : 'Favoritar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareRoute(selectedRoute)}
                    className="p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:bg-[var(--ipace-border)] text-[var(--ipace-text)] transition-colors cursor-pointer"
                    title="Compartilhar Rota"
                  >
                    {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportGPX(selectedRoute)}
                    className="p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:bg-[var(--ipace-border)] text-[var(--ipace-text)] transition-colors cursor-pointer"
                    title="Exportar arquivo GPX"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Run this route primary button */}
              <button
                type="button"
                onClick={() => onStartRouteRun(selectedRoute)}
                className="w-full py-4 px-4 rounded-2xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                Correr Esta Rota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Rotas em Cards */}
      <div className="space-y-3">
        <h3 className="font-heading font-extrabold text-sm text-[var(--ipace-text)] uppercase tracking-wider">
          Todas as Rotas Disponíveis ({routes.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`bg-[var(--ipace-surface)] border rounded-3xl p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
                  isSelected
                    ? 'border-[var(--ipace-primary)] ring-2 ring-[var(--ipace-primary)]/20'
                    : 'border-[var(--ipace-border)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[var(--ipace-primary)] uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {route.city}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{route.rating}</span>
                  </div>
                </div>

                <h4 className="font-heading font-black text-base text-[var(--ipace-text)] mb-1">
                  {route.name}
                </h4>
                <p className="text-xs text-[var(--ipace-text-2)] line-clamp-2 mb-3">
                  {route.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--ipace-border)]">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--ipace-text)]">
                      {route.distanceKm} km
                    </span>
                    <span className="text-[var(--ipace-text-2)]">
                      +{route.elevationGainM}m
                    </span>
                    <span className="capitalize text-[10px] px-2 py-0.5 rounded-full bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] font-bold">
                      {route.terrain}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[var(--ipace-primary)] flex items-center gap-1">
                    Ver no mapa <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Criar Rota no Mapa */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-scale-up">
            <h3 className="font-heading font-black text-xl text-[var(--ipace-text)] mb-1">
              Criar Nova Rota
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)] mb-4">
              Informe os dados da sua rota e compartilhe com a comunidade.
            </p>

            <form onSubmit={handleSaveDrawnRoute} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Nome da Rota
                </label>
                <input
                  type="text"
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  placeholder="Ex: Volta do Parque da Aclimação"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Cidade / Bairro
                </label>
                <input
                  type="text"
                  value={newRouteCity}
                  onChange={(e) => setNewRouteCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Descrição e Dicas do Terreno
                </label>
                <textarea
                  rows={2}
                  value={newRouteDesc}
                  onChange={(e) => setNewRouteDesc(e.target.value)}
                  placeholder="Pontos de hidratação, sombras e altimetria..."
                  className="w-full p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Tipo de Piso
                </label>
                <select
                  value={newRouteTerrain}
                  onChange={(e) => setNewRouteTerrain(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                >
                  <option value="asfalto">Asfalto / Ciclovia</option>
                  <option value="terra">Trilha de Terra / Gramado</option>
                  <option value="misto">Misto (Asfalto + Terra)</option>
                  <option value="pista">Pista de Atletismo (Tartan)</option>
                </select>
              </div>

              {/* Waypoints preview */}
              <div className="pt-1">
                <RunMap coordinates={drawnPoints} className="h-40 w-full" />
                <span className="text-[10px] text-[var(--ipace-text-2)] mt-1 block">
                  Cálculo automático: ~{(drawnPoints.length * 1.4).toFixed(1)} km e +{Math.round(drawnPoints.length * 8.5)}m de elevação
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--ipace-border)]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ipace-text-2)] hover:bg-[var(--ipace-surface-2)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md"
                >
                  Salvar Rota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
