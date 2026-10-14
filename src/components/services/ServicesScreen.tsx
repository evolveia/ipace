import React, { useState, useEffect } from 'react';
import { Professional, ServiceBooking } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Briefcase,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Send,
  UserCheck,
  ShieldCheck,
  X,
  CreditCard,
  Check,
} from 'lucide-react';

export const ServicesScreen: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeChatPro, setActiveChatPro] = useState<Professional | null>(null);

  // Simulated Chat messages state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'pro'; text: string; time: string }[]>([
    {
      sender: 'pro',
      text: 'Olá atleta! Como posso te ajudar na sua preparação esportiva hoje? Me conta seus objetivos e se tem alguma queixa ou prova em vista.',
      time: '10:00',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const loadData = async () => {
    const pros = await StorageService.getProfessionals();
    const bks = await StorageService.getBookings();
    setProfessionals(pros);
    setBookings(bks);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPros = professionals.filter((pro) => {
    if (roleFilter !== 'todos' && pro.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pro.name.toLowerCase().includes(q) ||
        pro.role.toLowerCase().includes(q) ||
        pro.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleConfirmBooking = async () => {
    if (!selectedPro || !bookingSlot) return;
    await StorageService.createBooking(selectedPro, bookingSlot);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedPro(null);
      setBookingSlot('');
      loadData();
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatPro) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Simulated reply after 1.2s
    setTimeout(() => {
      const replies = [
        `Excelente ponto! Posso avaliar sua cadência e amplitude de passada para montarmos uma periodização segura.`,
        `Perfeito! Recomendo mantermos o volume controlado nos próximos 10 dias para evitar sobrecarga.`,
        `Com certeza. Durante nossa consulta agendada faremos a análise detalhada dos seus relatórios de treino no IPACE!`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'pro',
          text: randomReply,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ipace-primary)]">
            Marketplace de Especialistas
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-0.5">
            Profissionais &amp; Assessorias
          </h2>
        </div>

        {/* Active Bookings Chip */}
        {bookings.length > 0 && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 self-start">
            <CheckCircle2 className="w-4 h-4" />
            <span>{bookings.length} agendamento(s) ativo(s)</span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ipace-text-2)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, especialidade ou conselho profissional..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'Preparador Físico', label: 'Treinadores' },
            { id: 'Nutricionista', label: 'Nutricionistas' },
            { id: 'Fisioterapeuta', label: 'Fisioterapeutas' },
            { id: 'Psicólogo do Esporte', label: 'Psicólogos' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setRoleFilter(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === cat.id
                  ? 'bg-[var(--ipace-primary)] text-white shadow-xs'
                  : 'bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Professionals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPros.map((pro) => (
          <div
            key={pro.id}
            className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Photo + Info */}
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-[var(--ipace-border)] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-heading font-black text-base text-[var(--ipace-text)] truncate">
                      {pro.name}
                    </h3>
                    {pro.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <ShieldCheck className="w-3 h-3" /> Verificado
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[var(--ipace-primary)] mt-0.5">
                    {pro.role} • {pro.registry}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{pro.rating}</span>
                    <span className="text-[var(--ipace-text-2)] font-normal text-[11px]">
                      ({pro.reviewCount} avaliações)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Specialties */}
              <p className="text-xs text-[var(--ipace-text-2)] leading-relaxed mb-3 line-clamp-2">
                {pro.bio}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {pro.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)] border border-[var(--ipace-border)]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="pt-3 border-t border-[var(--ipace-border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[var(--ipace-text-2)] uppercase block font-bold">
                  Consulta / Sessão
                </span>
                <span className="font-heading font-black text-lg text-[var(--ipace-text)]">
                  R$ {pro.pricePerSession.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Chat button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveChatPro(pro);
                  }}
                  className="p-2.5 rounded-xl border border-[var(--ipace-border)] hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] transition-colors cursor-pointer"
                  title="Abrir Chat com o Especialista"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* Booking button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPro(pro);
                    setBookingSlot(pro.availableSlots[0] || 'Horário livre');
                  }}
                  className="px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer"
                >
                  Agendar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-scale-up">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-xl text-[var(--ipace-text)]">
                  Agendamento Confirmado!
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)]">
                  Você agendou com <strong>{selectedPro.name}</strong> para{' '}
                  <strong>{bookingSlot}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-heading font-black text-xl text-[var(--ipace-text)] mb-1">
                  Agendar com Especialista
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)] mb-4">
                  {selectedPro.name} — {selectedPro.role} ({selectedPro.registry})
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-2">
                      Horários Disponíveis na Agenda
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedPro.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingSlot(slot)}
                          className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            bookingSlot === slot
                              ? 'border-[var(--ipace-primary)] bg-red-50 text-[var(--ipace-primary)] dark:bg-red-950/40 ring-1 ring-[var(--ipace-primary)]'
                              : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)] hover:border-gray-400'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--ipace-primary)]" />
                            {slot}
                          </span>
                          {bookingSlot === slot && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)] flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ipace-text-2)]">Valor Total:</span>
                    <span className="font-heading font-black text-lg text-[var(--ipace-text)]">
                      R$ {selectedPro.pricePerSession.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--ipace-border)]">
                    <button
                      type="button"
                      onClick={() => setSelectedPro(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ipace-text-2)]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md cursor-pointer"
                    >
                      Confirmar Agendamento
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedPro(null)}
              className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* DIRECT CHAT MODAL (SIMULADO) */}
      {activeChatPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl w-full max-w-lg h-[520px] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            {/* Chat Header */}
            <div className="p-4 border-b border-[var(--ipace-border)] flex items-center justify-between bg-[var(--ipace-surface)]">
              <div className="flex items-center gap-3">
                <img
                  src={activeChatPro.avatar}
                  alt={activeChatPro.name}
                  className="w-10 h-10 rounded-full object-cover border border-[var(--ipace-border)]"
                />
                <div>
                  <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                    {activeChatPro.name}
                  </h4>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online agora
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveChatPro(null)}
                className="p-1.5 rounded-full hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--ipace-surface-2)]/40">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[var(--ipace-primary)] text-white rounded-tr-xs'
                        : 'bg-[var(--ipace-surface)] text-[var(--ipace-text)] border border-[var(--ipace-border)] rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[var(--ipace-text-2)] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--ipace-border)] bg-[var(--ipace-surface)] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Mensagem para ${activeChatPro.name}...`}
                className="flex-1 px-4 py-2.5 rounded-full border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-full bg-[var(--ipace-primary)] text-white hover:bg-[var(--ipace-hover)] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
