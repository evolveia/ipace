import React, { useState, useEffect } from 'react';
import { Activity, Split } from '../../types';
import { RunMap } from './RunMap';
import { formatSeconds } from '../../services/storage';
import {
  Trophy,
  CheckCircle2,
  Share2,
  Bookmark,
  Flame,
  Zap,
  Activity as ActivityIcon,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Save,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RunSummaryModalProps {
  activity: Omit<Activity, 'id' | 'likesCount' | 'likedByMe' | 'commentsCount' | 'savedByMe'>;
  onSave: (activity: Omit<Activity, 'id' | 'likesCount' | 'likedByMe' | 'commentsCount' | 'savedByMe'>) => Promise<void>;
  onClose: () => void;
}

export const RunSummaryModal: React.FC<RunSummaryModalProps> = ({
  activity,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(activity.title || 'Treino Finalizado');
  const [notes, setNotes] = useState(activity.notes || '');
  const [sensation, setSensation] = useState<'easy' | 'moderate' | 'hard' | 'exhausting'>(
    activity.sensation || 'moderate'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D2262E', '#E4575E', '#F3BFC3', '#1E7E34', '#FFFFFF'],
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      ...activity,
      title,
      notes,
      sensation,
    });
    setIsSaving(false);
    onClose();
  };

  const handleShareSummary = async () => {
    const text = `Corri ${activity.distanceKm.toFixed(2)} km em ${formatSeconds(
      activity.durationSeconds
    )} com pace médio de ${activity.avgPace}/km no IPACE — Running App! 🏃🔥`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu treino no IPACE Running App',
          text,
          url: window.location.href,
        });
      } catch (err) {
        // user dismissed
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl relative my-auto animate-scale-up">
        {/* Header with Trophy & Congrats */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Treino Concluído com Sucesso!
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)]">
            Resumo do Desempenho
          </h2>
          <p className="text-xs text-[var(--ipace-text-2)] mt-0.5">
            Excelente constância! Seus dados foram computados e comparados com suas metas.
          </p>
        </div>

        {/* Big Metric Display (40-64px) */}
        <div className="bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] rounded-3xl p-4 sm:p-6 mb-5 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ipace-text-2)]">
            Distância Total
          </div>
          <div className="font-heading font-black text-5xl sm:text-6xl text-[var(--ipace-primary)] tracking-tight my-1">
            {activity.distanceKm.toFixed(2)}
            <span className="text-xl sm:text-2xl text-[var(--ipace-text-2)] font-bold ml-1.5">km</span>
          </div>

          {/* Grid of Key Submetrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[var(--ipace-border)]">
            <div>
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Tempo Total</div>
              <div className="font-heading font-black text-base sm:text-lg text-[var(--ipace-text)]">
                {formatSeconds(activity.durationSeconds)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Pace Médio</div>
              <div className="font-heading font-black text-base sm:text-lg text-[var(--ipace-primary)]">
                {activity.avgPace}
                <span className="text-[10px] font-medium text-[var(--ipace-text-2)]">/km</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Calorias</div>
              <div className="font-heading font-black text-base sm:text-lg text-[var(--ipace-text)]">
                {activity.calories}
                <span className="text-[10px] font-medium text-[var(--ipace-text-2)]"> kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Polyline */}
        <div className="mb-5">
          <div className="text-xs font-bold uppercase text-[var(--ipace-text)] mb-1.5 flex items-center justify-between">
            <span>Percurso Percorrido</span>
            <span className="text-[10px] font-medium text-[var(--ipace-text-2)]">
              {activity.coordinates.length} pontos de GPS
            </span>
          </div>
          <RunMap coordinates={activity.coordinates} className="h-48 sm:h-56 w-full" />
        </div>

        {/* Splits Table (km a km) */}
        {activity.splits.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-bold uppercase text-[var(--ipace-text)] mb-2">
              Divisão por Quilômetro (Splits)
            </div>
            <div className="bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)] p-3 max-h-36 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] uppercase font-bold text-[var(--ipace-text-2)] border-b border-[var(--ipace-border)] pb-1">
                    <th className="text-left pb-1">Km</th>
                    <th className="text-center pb-1">Tempo</th>
                    <th className="text-right pb-1">Ritmo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ipace-border)]/50">
                  {activity.splits.map((s) => (
                    <tr key={s.km} className="font-medium text-[var(--ipace-text)]">
                      <td className="py-1 font-bold">Km {s.km}</td>
                      <td className="py-1 text-center text-[var(--ipace-text-2)]">
                        {formatSeconds(s.timeSeconds)}
                      </td>
                      <td className="py-1 text-right font-bold text-[var(--ipace-primary)]">
                        {s.pace}/km
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sensation Picker (Borg scale) */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1.5">
            Sensação do Esforço (Percepção Subjetiva)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'easy', label: 'Leve', icon: Smile, color: 'text-emerald-500' },
              { id: 'moderate', label: 'Moderado', icon: Meh, color: 'text-blue-500' },
              { id: 'hard', label: 'Forte', icon: Frown, color: 'text-amber-500' },
              { id: 'exhausting', label: 'Exaustivo', icon: Flame, color: 'text-red-500' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = sensation === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSensation(item.id as any)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--ipace-primary)] bg-red-50/60 dark:bg-red-950/40 shadow-xs ring-1 ring-[var(--ipace-primary)]'
                      : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:border-gray-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.color} mb-1`} />
                  <span className="text-[11px] font-bold text-[var(--ipace-text)]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title and Notes */}
        <div className="space-y-2 mb-5">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
              Título da Atividade
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-[var(--ipace-text)] mb-1">
              Notas do Treino (clima, sensação, tênis)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Treino progressivo no asfalto, vento contra no retorno..."
              className="w-full p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] resize-none"
            />
          </div>
        </div>

        {/* Actions: Save & Share */}
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--ipace-border)]">
          <button
            type="button"
            onClick={handleShareSummary}
            className="flex-1 py-3 px-4 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:bg-[var(--ipace-border)] text-[var(--ipace-text)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" /> Copiado!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> Compartilhar
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 px-4 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar no Histórico'}
          </button>
        </div>
      </div>
    </div>
  );
};
