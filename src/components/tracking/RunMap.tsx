import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface RunMapProps {
  coordinates: [number, number][]; // [lat, lng]
  isLive?: boolean;
  className?: string;
}

export const RunMap: React.FC<RunMapProps> = ({
  coordinates,
  isLive = false,
  className = 'h-64 sm:h-80 w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Default coordinate: São Paulo - Parque Ibirapuera
  const defaultCenter: [number, number] = [-23.5874, -46.6576];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization
    if (!mapInstanceRef.current) {
      const initialCenter = coordinates.length > 0 ? coordinates[coordinates.length - 1] : defaultCenter;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(initialCenter, 15);

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add custom small zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Custom Runner SVG Icon
    const runnerIcon = L.divIcon({
      className: 'custom-runner-pin',
      html: `
        <div style="background-color: #D2262E; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white;">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    // Start Pin Icon
    const startIcon = L.divIcon({
      className: 'custom-start-pin',
      html: `
        <div style="background-color: #1E7E34; width: 22px; height: 22px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
          S
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    if (coordinates.length > 0) {
      const latlngs: L.LatLngExpression[] = coordinates.map((c) => [c[0], c[1]]);

      // Update or create polyline
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: '#D2262E',
          weight: 5,
          opacity: 0.9,
          lineJoin: 'round',
        }).addTo(map);
      }

      // Current location marker
      const currentPos = coordinates[coordinates.length - 1];
      if (markerRef.current) {
        markerRef.current.setLatLng(currentPos);
      } else {
        markerRef.current = L.marker(currentPos, { icon: runnerIcon }).addTo(map);
      }

      // If we have points, center map smoothly
      if (isLive) {
        map.panTo(currentPos, { animate: true });
      } else if (coordinates.length > 1) {
        map.fitBounds(polylineRef.current.getBounds(), { padding: [30, 30] });
      }
    }

    // Fix leaflet container size on resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Map stays until unmount
    };
  }, [coordinates, isLive]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[var(--ipace-border)] shadow-inner ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[220px]" />
      
      {/* Fallback overlay if coordinates are loading */}
      {coordinates.length === 0 && (
        <div className="absolute inset-0 bg-[var(--ipace-surface-2)] flex flex-col items-center justify-center p-4 text-center z-20">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)] animate-pulse mb-2">
            📍
          </div>
          <span className="text-xs font-bold text-[var(--ipace-text)]">
            Aguardando sinal do GPS para traçar rota...
          </span>
          <span className="text-[10px] text-[var(--ipace-text-2)] mt-0.5">
            Mantenha o dispositivo com visão livre para o céu.
          </span>
        </div>
      )}
    </div>
  );
};
