import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

interface FeaturedEventsCarouselProps {
  events: EventItem[]; // EXATAMENTE 3 eventos
  onSelectEvent: (event: EventItem) => void;
}

export const FeaturedEventsCarousel: React.FC<FeaturedEventsCarouselProps> = ({
  events,
  onSelectEvent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-[var(--ipace-border)] bg-[var(--ipace-surface)] transition-all">
      {/* Background Image with Dark Gradient Vignette */}
      <div className="relative h-72 sm:h-80 md:h-88 w-full overflow-hidden">
        <img
          src={currentEvent.bannerUrl}
          alt={currentEvent.title}
          className="w-full h-full object-cover transform scale-102 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30" />
      </div>

      {/* Foreground Content */}
      <div className="absolute inset-0 p-4 sm:p-6 md:p-7 flex flex-col justify-between text-white pointer-events-none">
        {/* Top Badges */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[var(--ipace-primary)] text-white shadow-md flex items-center gap-1 badge-tilt">
              <Trophy className="w-3 h-3" />
              Destaque IPACE
            </span>

            {/* Presencial / Remoto badge with subtle -3° tilt */}
            <span
              className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                currentEvent.isRemote ? 'bg-blue-600/90 text-white' : 'bg-emerald-600/90 text-white'
              } -rotate-3`}
            >
              {currentEvent.isRemote ? '🌐 Desafio Remoto' : '📍 Prova Presencial'}
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            {events.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                  idx === currentIndex ? 'w-5 bg-[var(--ipace-primary)]' : 'w-1.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Ir para evento ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Details & CTA */}
        <div className="pointer-events-auto max-w-2xl">
          {/* Distances chips */}
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {currentEvent.distances.map((dist) => (
              <span
                key={dist}
                className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white/20 backdrop-blur-md text-white border border-white/30"
              >
                {dist}
              </span>
            ))}
          </div>

          {/* Refined Event Title font size */}
          <h2 className="font-heading font-black text-lg sm:text-2xl md:text-3xl text-white tracking-tight drop-shadow-md line-clamp-1 leading-tight">
            {currentEvent.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] sm:text-xs text-gray-200">
            <span className="flex items-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#F3BFC3]" />
              {currentEvent.date} • {currentEvent.time}
            </span>
            <span className="flex items-center gap-1 font-medium line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-[#F3BFC3]" />
              {currentEvent.location}
            </span>
          </div>

          {/* Price & CTA Button */}
          <div className="flex items-center justify-between sm:justify-start gap-4 mt-3 pt-2 border-t border-white/15">
            <div>
              <span className="text-[9px] text-gray-300 uppercase block font-bold tracking-wider">
                A partir de
              </span>
              <span className="font-heading font-black text-lg sm:text-2xl text-white">
                R$ {currentEvent.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectEvent(currentEvent)}
              className="py-2.5 px-5 sm:px-7 rounded-2xl font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] active:bg-[var(--ipace-active)] transition-all shadow-md hover:shadow-red-500/30 hover:scale-[1.02] cursor-pointer"
            >
              Inscreva-se Agora
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Controls */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer hidden sm:flex items-center justify-center"
        aria-label="Evento anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer hidden sm:flex items-center justify-center"
        aria-label="Próximo evento"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </section>
  );
};
