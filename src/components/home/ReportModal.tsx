import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ReportCategory } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: ReportCategory, notes: string) => Promise<void>;
  targetTitle: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetTitle,
}) => {
  const [category, setCategory] = useState<ReportCategory>('spam');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const categories: { id: ReportCategory; label: string; desc: string }[] = [
    { id: 'spam', label: 'Spam ou Propaganda', desc: 'Mensagens repetitivas, bots ou links suspeitos' },
    { id: 'assedio', label: 'Assédio ou Intimidação', desc: 'Ofensas direcionadas ou perseguição a atletas' },
    { id: 'odio', label: 'Discurso de Ódio', desc: 'Discriminação por gênero, raça, orientação ou religião' },
    { id: 'improprio', label: 'Conteúdo Impróprio', desc: 'Imagens ou textos com nudez ou violência' },
    { id: 'fraude', label: 'Fraude ou Golpe', desc: 'Venda ilegal de kits, falsos sorteios ou perfis falsos' },
    { id: 'outro', label: 'Outro Motivo', desc: 'Violação de outras diretrizes da comunidade IPACE' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(category, notes);
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-scale-up">
        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[var(--ipace-text)]">
              Denúncia Enviada
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)]">
              Obrigado por manter o ecossistema IPACE seguro e acolhedor para todos os corredores.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-heading font-extrabold text-lg text-[var(--ipace-text)]">
                Denunciar Publicação
              </h3>
            </div>
            <p className="text-xs text-[var(--ipace-text-2)]">
              Selecione o motivo principal para a denúncia de: <strong>{targetTitle}</strong>
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    category === cat.id
                      ? 'border-[var(--ipace-primary)] bg-red-50/50 dark:bg-red-950/30'
                      : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="report_cat"
                    checked={category === cat.id}
                    onChange={() => setCategory(cat.id)}
                    className="mt-0.5 accent-[var(--ipace-primary)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[var(--ipace-text)]">{cat.label}</div>
                    <div className="text-[10px] text-[var(--ipace-text-2)]">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--ipace-text)] uppercase mb-1">
                Detalhes adicionais (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explique o que aconteceu com mais detalhes..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ipace-text-2)] hover:bg-[var(--ipace-surface-2)]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar Denúncia'}
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
