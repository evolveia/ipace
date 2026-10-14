import React, { useState, useEffect } from 'react';
import { EventItem, EventRegistration } from '../../types';
import { StorageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  MapPin,
  Trophy,
  Tag,
  CheckCircle2,
  QrCode,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  Shirt,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

export const EventsScreen: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'descobrir' | 'remotos' | 'inscricoes' | 'criar'>('descobrir');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Registration Checkout Modal
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [confirmedRegistration, setConfirmedRegistration] = useState<EventRegistration | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Create Event Form
  const [createTitle, setCreateTitle] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createLocation, setCreateLocation] = useState('');
  const [createIsRemote, setCreateIsRemote] = useState(false);
  const [createDistances, setCreateDistances] = useState('5K, 10K');
  const [createPrice, setCreatePrice] = useState('99.90');
  const [createRules, setCreateRules] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const loadData = async () => {
    const evts = await StorageService.getEvents();
    const regs = await StorageService.getRegistrations();
    setEvents(evts);
    setRegistrations(regs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartRegistration = (event: EventItem) => {
    setRegisteringEvent(event);
    setSelectedDistance(event.distances[0] || '5K');
    setConfirmedRegistration(null);
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;
    setIsProcessing(true);
    const reg = await StorageService.registerEvent(
      registeringEvent.id,
      selectedDistance,
      paymentMethod
    );
    setIsProcessing(false);
    setConfirmedRegistration(reg);
    loadData();
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    await StorageService.createEvent({
      title: createTitle,
      description: 'Evento organizado através da plataforma IPACE Running.',
      bannerUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=80',
      date: createDate || 'A definir',
      time: '07:00',
      location: createIsRemote ? 'Remoto (Todo o Brasil)' : createLocation || 'São Paulo, SP',
      isRemote: createIsRemote,
      distances: createDistances.split(',').map((d) => d.trim()),
      price: parseFloat(createPrice) || 89.9,
      spotsTotal: 1000,
      organizer: user?.name || 'Organizador IPACE',
      rules: createRules || 'Regulamento oficial da prova aferido conforme diretrizes CBAt.',
      kitDescription: 'Camiseta técnica oficial de poliamida, número de peito com chip e medalha de finisher.',
      categories: ['Geral', 'Faixa Etária'],
    });

    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('descobrir');
      loadData();
    }, 1500);
  };

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'remotos') return e.isRemote;
    if (activeTab === 'descobrir') return !e.isRemote;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ipace-primary)]">
            Corridas &amp; Provas
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-0.5">
            Calendário de Eventos
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[var(--ipace-surface)] p-1 rounded-2xl border border-[var(--ipace-border)] shadow-xs overflow-x-auto">
          {[
            { id: 'descobrir', label: 'Presenciais' },
            { id: 'remotos', label: 'Virtuais / Remotos' },
            { id: 'inscricoes', label: `Minhas Inscrições (${registrations.length})` },
            { id: 'criar', label: 'Organizar Evento' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[var(--ipace-primary)] text-white shadow-sm'
                  : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. DISCOVER & REMOTE EVENTS LIST */}
      {(activeTab === 'descobrir' || activeTab === 'remotos') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((event) => {
            const spotsLeft = event.spotsTotal - event.spotsTaken;
            const percentTaken = Math.round((event.spotsTaken / event.spotsTotal) * 100);

            return (
              <div
                key={event.id}
                className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge: Presencial / Remoto tilted -3° to -6° */}
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md -rotate-3 ${
                        event.isRemote ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}
                    >
                      {event.isRemote ? '🌐 Desafio Remoto' : '📍 Presencial'}
                    </span>

                    {/* Date Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-heading font-black flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F3BFC3]" />
                        {event.date}
                      </span>
                      <span className="font-bold text-[11px] bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {event.time}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {event.distances.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[var(--ipace-surface-2)] text-[var(--ipace-primary)] border border-[var(--ipace-border)]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-1 group-hover:text-[var(--ipace-primary)] transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-xs text-[var(--ipace-text-2)] flex items-center gap-1.5 mb-3 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--ipace-primary)]" />
                      {event.location}
                    </p>

                    <p className="text-xs text-[var(--ipace-text-2)] line-clamp-2 leading-relaxed mb-4">
                      {event.description}
                    </p>

                    {/* Spots remaining progress */}
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-[11px] font-semibold text-[var(--ipace-text-2)]">
                        <span>{spotsLeft} vagas restantes</span>
                        <span>{percentTaken}% preenchido</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--ipace-border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--ipace-primary)] transition-all"
                          style={{ width: `${percentTaken}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Action */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-[var(--ipace-border)] mt-2">
                  <div>
                    <span className="text-[10px] text-[var(--ipace-text-2)] uppercase block font-bold">
                      Valor
                    </span>
                    <span className="font-heading font-black text-xl text-[var(--ipace-text)]">
                      R$ {event.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="px-3 py-2 rounded-xl border border-[var(--ipace-border)] hover:bg-[var(--ipace-surface-2)] text-xs font-bold text-[var(--ipace-text)] transition-colors cursor-pointer"
                    >
                      Regulamento
                    </button>

                    {event.isRegistered ? (
                      <span className="px-4 py-2 rounded-xl text-xs font-black uppercase text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Inscrito
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartRegistration(event)}
                        className="px-4 py-2 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer"
                      >
                        Inscrever-se
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. MINHAS INSCRIÇÕES & VOUCHERS */}
      {activeTab === 'inscricoes' && (
        <div className="space-y-4">
          {registrations.length === 0 ? (
            <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-8 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-[var(--ipace-primary)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-lg text-[var(--ipace-text)] mb-1">
                Nenhuma inscrição ativa
              </h3>
              <p className="text-xs text-[var(--ipace-text-2)] max-w-sm mx-auto mb-4">
                Você ainda não se inscreveu em nenhuma prova. Escolha um evento no calendário e garanta seu kit de atleta!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('descobrir')}
                className="px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase text-white bg-[var(--ipace-primary)]"
              >
                Descobrir Eventos
              </button>
            </div>
          ) : (
            registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Inscrição Confirmada
                    </span>
                    <span className="text-xs font-bold text-[var(--ipace-text-2)]">
                      {reg.isRemote ? 'Remoto' : 'Presencial'}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-[var(--ipace-text)]">
                    {reg.eventTitle}
                  </h3>

                  <div className="text-xs text-[var(--ipace-text-2)] space-y-0.5">
                    <div>Atleta: <strong>{reg.athleteName}</strong></div>
                    <div>Data: <strong>{reg.eventDate}</strong></div>
                    <div>Distância Escolhida: <strong className="text-[var(--ipace-primary)]">{reg.selectedDistance}</strong></div>
                    <div>Número de Peito (BIB): <strong className="text-base text-[var(--ipace-text)] font-heading">#{reg.bibNumber}</strong></div>
                  </div>
                </div>

                {/* QR Code Pass Box */}
                <div className="bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center shrink-0 w-44">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto shadow-xs border border-gray-200 flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="text-[10px] font-mono text-[var(--ipace-text-2)] mt-2 font-bold truncate">
                    {reg.qrCodeToken}
                  </div>
                  <div className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">
                    Apresentar na retirada do Kit
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. CRIAR EVENTO (FORMULÁRIO DO ORGANIZADOR) */}
      {activeTab === 'criar' && (
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 shadow-sm">
          <h3 className="font-heading font-black text-xl text-[var(--ipace-text)] mb-1">
            Cadastrar Prova ou Corrida Virtual
          </h3>
          <p className="text-xs text-[var(--ipace-text-2)] mb-5">
            Crie sua prova oficial no ecossistema IPACE e alcance milhares de corredores ativos.
          </p>

          {createSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-black text-lg text-[var(--ipace-text)]">
                Evento Publicado com Sucesso!
              </h4>
              <p className="text-xs text-[var(--ipace-text-2)]">
                Seu evento já está disponível no calendário nacional.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Nome Oficial do Evento
                  </label>
                  <input
                    type="text"
                    required
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="Ex: Meia Maratona das Pontes 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Data da Largada
                  </label>
                  <input
                    type="text"
                    required
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    placeholder="Ex: 25 Outubro 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Local de Largada / Cidade
                  </label>
                  <input
                    type="text"
                    value={createLocation}
                    disabled={createIsRemote}
                    onChange={(e) => setCreateLocation(e.target.value)}
                    placeholder="Ex: Parque Ibirapuera, São Paulo - SP"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Formato
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createIsRemote}
                      onChange={(e) => setCreateIsRemote(e.target.checked)}
                      className="accent-[var(--ipace-primary)]"
                    />
                    <span className="text-xs font-bold text-[var(--ipace-text)]">Desafio Remoto</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Distâncias (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={createDistances}
                    onChange={(e) => setCreateDistances(e.target.value)}
                    placeholder="5K, 10K, 21K"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                    Valor da Inscrição (R$)
                  </label>
                  <input
                    type="text"
                    value={createPrice}
                    onChange={(e) => setCreatePrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1">
                  Resumo do Regulamento Oficial
                </label>
                <textarea
                  rows={3}
                  value={createRules}
                  onChange={(e) => setCreateRules(e.target.value)}
                  placeholder="Informações sobre hidratação, chip de cronometragem, guarda-volumes..."
                  className="w-full p-2.5 rounded-xl border border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-xs text-[var(--ipace-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ipace-primary)] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] transition-all shadow-md cursor-pointer"
              >
                Publicar Prova no IPACE
              </button>
            </form>
          )}
        </div>
      )}

      {/* EVENT DETAIL / REGULAMENTO MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 max-w-lg w-full shadow-2xl relative my-auto animate-scale-up">
            <h3 className="font-heading font-black text-2xl text-[var(--ipace-text)] mb-1">
              {selectedEvent.title}
            </h3>
            <p className="text-xs text-[var(--ipace-text-2)] mb-4">
              Organizado por: <strong>{selectedEvent.organizer}</strong>
            </p>

            <div className="space-y-4 text-xs text-[var(--ipace-text)]">
              <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)]">
                <div className="font-bold uppercase text-[10px] text-[var(--ipace-text-2)] mb-1 flex items-center gap-1.5">
                  <Shirt className="w-4 h-4 text-[var(--ipace-primary)]" /> Kit do Corredor
                </div>
                <p className="text-[var(--ipace-text)] leading-relaxed">
                  {selectedEvent.kitDescription}
                </p>
              </div>

              <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)]">
                <div className="font-bold uppercase text-[10px] text-[var(--ipace-text-2)] mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--ipace-primary)]" /> Regulamento Geral
                </div>
                <p className="text-[var(--ipace-text)] leading-relaxed">
                  {selectedEvent.rules}
                </p>
              </div>

              <div>
                <span className="font-bold uppercase text-[10px] text-[var(--ipace-text-2)] block mb-1">
                  Categorias Premiadas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.categories.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full bg-red-50 text-[var(--ipace-primary)] text-[11px] font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--ipace-border)]">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ipace-text-2)]"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedEvent(null);
                  handleStartRegistration(selectedEvent);
                }}
                className="px-6 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md"
              >
                Inscrever-se Agora
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MOCK MODAL (PIX / CARTÃO + QR CODE ATLETA) */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative my-auto animate-scale-up">
            {confirmedRegistration ? (
              // Confirmação de Sucesso com Voucher & QR Code
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[var(--ipace-text)]">
                  Inscrição Confirmada!
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)]">
                  Parabéns, {confirmedRegistration.athleteName}! Seu número oficial foi gerado:
                </p>

                {/* Voucher Box */}
                <div className="bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] rounded-3xl p-5 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ipace-text-2)]">
                    Número de Peito (BIB)
                  </div>
                  <div className="font-heading font-black text-4xl text-[var(--ipace-primary)] my-1">
                    #{confirmedRegistration.bibNumber}
                  </div>
                  <div className="text-xs font-bold text-[var(--ipace-text)]">
                    Distância: {confirmedRegistration.selectedDistance}
                  </div>

                  <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto shadow-xs border border-gray-200 mt-3 flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="text-[9px] font-mono text-[var(--ipace-text-2)] mt-1.5 font-bold">
                    {confirmedRegistration.qrCodeToken}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRegisteringEvent(null);
                    setConfirmedRegistration(null);
                    setActiveTab('inscricoes');
                  }}
                  className="w-full py-3 px-4 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)]"
                >
                  Ver em Minhas Inscrições
                </button>
              </div>
            ) : (
              // Formulário de Inscrição e Pagamento Mock
              <form onSubmit={handleConfirmCheckout} className="space-y-4">
                <h3 className="font-heading font-black text-xl text-[var(--ipace-text)]">
                  Inscrição Oficial
                </h3>
                <p className="text-xs text-[var(--ipace-text-2)]">
                  {registeringEvent.title} — {registeringEvent.date}
                </p>

                {/* Distance Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1.5">
                    Escolha a Distância
                  </label>
                  <div className="flex gap-2">
                    {registeringEvent.distances.map((dist) => (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => setSelectedDistance(dist)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedDistance === dist
                            ? 'border-[var(--ipace-primary)] bg-[var(--ipace-primary)] text-white shadow-sm'
                            : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)]'
                        }`}
                      >
                        {dist}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ipace-text)] mb-1.5">
                    Forma de Pagamento (Mock)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-[var(--ipace-primary)] bg-red-50/50 dark:bg-red-950/40 text-[var(--ipace-text)]'
                          : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)]'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold">PIX Instantâneo</div>
                        <div className="text-[10px] text-[var(--ipace-text-2)]">Aprovação em 2 seg</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-[var(--ipace-primary)] bg-red-50/50 dark:bg-red-950/40 text-[var(--ipace-text)]'
                          : 'border-[var(--ipace-border)] bg-[var(--ipace-surface-2)] text-[var(--ipace-text)]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs font-bold">Cartão de Crédito</div>
                        <div className="text-[10px] text-[var(--ipace-text-2)]">Até 3x sem juros</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* PIX Mock Code Display */}
                {paymentMethod === 'pix' && (
                  <div className="p-3 bg-[var(--ipace-surface-2)] rounded-2xl border border-[var(--ipace-border)] text-center">
                    <div className="w-20 h-20 bg-white p-2 rounded-xl mx-auto shadow-xs border border-gray-200 mb-2 flex items-center justify-center">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    <div className="text-[10px] font-mono text-[var(--ipace-text-2)] truncate bg-[var(--ipace-surface)] p-2 rounded-xl border border-[var(--ipace-border)] mb-2">
                      00020126580014br.gov.bcb.pix0136ipace-maratona-pix-mock-key52040000
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136ipace-maratona-pix-mock-key52040000');
                        setCopiedPix(true);
                        setTimeout(() => setCopiedPix(false), 2000);
                      }}
                      className="text-xs font-bold text-[var(--ipace-primary)] hover:underline inline-flex items-center gap-1"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedPix ? 'Chave Copiada!' : 'Copiar Código PIX'}
                    </button>
                  </div>
                )}

                {/* Total and CTA */}
                <div className="pt-2 border-t border-[var(--ipace-border)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--ipace-text-2)] uppercase block font-bold">Total a Pagar</span>
                    <span className="font-heading font-black text-2xl text-[var(--ipace-primary)]">
                      R$ {registeringEvent.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisteringEvent(null)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[var(--ipace-text-2)]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider text-white bg-[var(--ipace-primary)] hover:bg-[var(--ipace-hover)] shadow-md disabled:opacity-50"
                    >
                      {isProcessing ? 'Confirmando...' : 'Pagar & Confirmar'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setRegisteringEvent(null);
                setConfirmedRegistration(null);
              }}
              className="absolute top-4 right-4 text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)] p-2 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
