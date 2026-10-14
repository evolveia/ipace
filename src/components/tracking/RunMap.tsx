import React, { useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

interface RunMapProps {
  coordinates: [number, number][]; // [lat, lng]
  isLive?: boolean;
  className?: string;
}

const MapController: React.FC<{ center: { lat: number; lng: number }; isLive: boolean }> = ({ center, isLive }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (isLive) {
      map.panTo(center);
    }
  }, [map, center, isLive]);
  return null;
};

const MapContent: React.FC<RunMapProps> = ({ coordinates, isLive, className }) => {
  const defaultCenter = { lat: -23.5874, lng: -46.6576 };
  const currentPos = coordinates.length > 0
    ? { lat: coordinates[coordinates.length - 1][0], lng: coordinates[coordinates.length - 1][1] }
    : defaultCenter;

  const startPos = coordinates.length > 0
    ? { lat: coordinates[0][0], lng: coordinates[0][1] }
    : defaultCenter;

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[var(--ipace-border)] shadow-inner ${className}`}>
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={currentPos}
        defaultZoom={15}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        className="w-full h-full min-h-[220px]"
      >
        <MapController center={currentPos} isLive={!!isLive} />

        {/* Start Marker */}
        {coordinates.length > 0 && (
          <AdvancedMarker position={startPos} title="Início">
            <div className="bg-emerald-600 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              S
            </div>
          </AdvancedMarker>
        )}

        {/* Current Runner Marker */}
        {coordinates.length > 0 && (
          <AdvancedMarker position={currentPos} title="Sua Localização GPS Google Maps">
            <div className="bg-[var(--ipace-primary)] text-white w-7 h-7 rounded-full flex items-center justify-center border-3 border-white shadow-lg animate-pulse">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          </AdvancedMarker>
        )}
      </Map>

      {/* Fallback overlay if coordinates are loading */}
      {coordinates.length === 0 && (
        <div className="absolute inset-0 bg-[var(--ipace-surface-2)] flex flex-col items-center justify-center p-4 text-center z-20">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)] animate-pulse mb-2">
            📍
          </div>
          <span className="text-xs font-bold text-[var(--ipace-text)]">
            Aguardando sinal do GPS do Google Maps para rastreamento em tempo real...
          </span>
          <span className="text-[10px] text-[var(--ipace-text-2)] mt-0.5">
            Mantenha a permissão de localização ativada no navegador.
          </span>
        </div>
      )}
    </div>
  );
};

export const RunMap: React.FC<RunMapProps> = (props) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBldLdefZ0SJwGUDHAuUv1Uq30V35_IIS0';

  return (
    <APIProvider apiKey={apiKey}>
      <MapContent {...props} />
    </APIProvider>
  );
};
