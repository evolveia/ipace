import React, { useState, useEffect } from 'react';
import { Activity, PersonalRecord, ActivityType } from '../../types';
import { StorageService, formatSeconds } from '../../services/storage';
import {
  Calendar as CalendarIcon,
  Trophy,
  Filter,
  TrendingUp,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity as ActivityIcon,
  Users,
} from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'running' | 'walking'>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      const acts = await StorageService.getActivities();
      const recs = await StorageService.getRecords();
      setActivities(acts);
      setRecords(recs);
    };
    load();
  }, []);

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === 'all') return true;
    return act.type === selectedFilter;
  });

  // Calculate totals
  const totalKm = filteredActivities.reduce((acc, a) => acc + a.distanceKm, 0);
  const totalSeconds = filteredActivities.reduce((acc, a) => acc + a.durationSeconds, 0);
  const totalCalories = filteredActivities.reduce((acc, a) => acc + a.calories, 0);

  // Calendar logic for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Find which days had workouts
  const activeDays = new Set(
    activities.map((a) => {
      const d = new Date(a.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        return d.getDate();
      }
      return null;
    }).filter(Boolean)
  );

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ipace-primary)]">
            Evolução Esportiva
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-0.5">
            Histórico &amp; Desempenho
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[var(--ipace-surface)] p-1 rounded-2xl border border-[var(--ipace-border)] shadow-xs">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'running', label: 'Corridas' },
            { id: 'walking', label: 'Caminhadas' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-[var(--ipace-primary)] text-white shadow-sm'
                  : 'text-[var(--ipace-text-2)] hover:text-[var(--ipace-text)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Total Percorrido</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-primary)] mt-1">
            {totalKm.toFixed(1)} <span className="text-xs text-[var(--ipace-text-2)] font-bold">km</span>
          </div>
        </div>

        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Tempo em Movimento</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[var(--ipace-text)] mt-1">
            {Math.floor(totalSeconds / 3600)}h {Math.floor((totalSeconds % 3600) / 60)}m
          </div>
        </div>

        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Calorias Queimadas</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-amber-600 mt-1">
            {totalCalories.toLocaleString()} <span className="text-xs font-bold text-[var(--ipace-text-2)]">kcal</span>
          </div>
        </div>

        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 text-center">
          <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Média Semanal</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600 mt-1">
            28.4 <span className="text-xs font-bold text-[var(--ipace-text-2)]">km/sem</span>
          </div>
        </div>
      </div>

      {/* Interactive Calendar & Community Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calendar Card */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-extrabold text-sm text-[var(--ipace-text)] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[var(--ipace-primary)]" />
              Calendário de Treinos — {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                className="p-1 rounded-lg hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                className="p-1 rounded-lg hover:bg-[var(--ipace-surface-2)] text-[var(--ipace-text-2)]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--ipace-text-2)] mb-2">
            <span>D</span>
            <span>S</span>
            <span>T</span>
            <span>Q</span>
            <span>Q</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 rounded-lg" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasWorkout = activeDays.has(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={day}
                  className={`h-8 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    hasWorkout
                      ? 'bg-[var(--ipace-primary)] text-white shadow-xs scale-105'
                      : isToday
                      ? 'border border-[var(--ipace-primary)] text-[var(--ipace-primary)]'
                      : 'bg-[var(--ipace-surface-2)] text-[var(--ipace-text)]'
                  }`}
                >
                  <span>{day}</span>
                  {hasWorkout && <span className="w-1 h-1 rounded-full bg-white mt-0.5" />}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-4 text-[11px] text-[var(--ipace-text-2)] justify-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ipace-primary)]" /> Treino Concluído
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)]" /> Dia de Descanso
            </span>
          </div>
        </div>

        {/* Community Comparison & Consistency */}
        <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-sm text-[var(--ipace-text)] flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Comparativo com a Comunidade IPACE
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Top 15%
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Metric 1: Pace médio */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[var(--ipace-text)]">Seu Pace Médio: 5:15/km</span>
                <span className="text-[var(--ipace-text-2)]">Média Geral: 6:04/km</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--ipace-border)] overflow-hidden">
                <div className="h-full bg-[var(--ipace-primary)] rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            {/* Metric 2: Frequência semanal */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[var(--ipace-text)]">Sua Frequência: 4.2 treinos/sem</span>
                <span className="text-[var(--ipace-text-2)]">Média Geral: 2.8 treinos/sem</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--ipace-border)] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Metric 3: Volume mensal */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[var(--ipace-text)]">Seu Volume: 112 km/mês</span>
                <span className="text-[var(--ipace-text-2)]">Média Geral: 65 km/mês</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--ipace-border)] overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          <div className="bg-[var(--ipace-surface-2)] p-3 rounded-2xl text-[11px] text-[var(--ipace-text-2)] leading-relaxed">
            💡 <strong>Insight da Comunidade:</strong> Atletas com sua consistência no mês de março
            reduziram seu tempo nos 10K em média 2min14s na primeira prova oficial.
          </div>
        </div>
      </div>

      {/* Personal Records Cards (Melhor 1k, 5k, 10k, 21k, etc) */}
      <div className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-extrabold text-sm text-[var(--ipace-text)] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Quadro de Recordes Pessoais (PRs)
          </h3>
          <span className="text-xs text-[var(--ipace-text-2)]">Atualizado automaticamente</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {records.map((rec) => (
            <div
              key={rec.category}
              className="bg-[var(--ipace-surface-2)] border border-[var(--ipace-border)] rounded-2xl p-3 text-center transition-all hover:scale-102"
            >
              <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)] truncate">
                {rec.label}
              </div>
              <div className="font-heading font-black text-lg sm:text-xl text-[var(--ipace-primary)] my-0.5">
                {rec.value}
              </div>
              <div className="text-[9px] text-[var(--ipace-text-2)]">{rec.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtered Activities List */}
      <div className="space-y-3">
        <h3 className="font-heading font-extrabold text-sm text-[var(--ipace-text)] uppercase tracking-wider">
          Lista de Atividades Realizadas ({filteredActivities.length})
        </h3>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 bg-[var(--ipace-surface)] rounded-2xl border border-[var(--ipace-border)] text-xs text-[var(--ipace-text-2)]">
            Nenhuma atividade gravada para este filtro.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-[var(--ipace-surface)] border border-[var(--ipace-border)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[var(--ipace-primary)] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-[var(--ipace-primary)] shrink-0">
                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-[var(--ipace-text)]">
                    {act.title}
                  </h4>
                  <div className="text-xs text-[var(--ipace-text-2)] flex items-center gap-2 mt-0.5">
                    <span>{new Date(act.date).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span className="capitalize">{act.type === 'running' ? 'Corrida' : 'Caminhada'}</span>
                    <span>•</span>
                    <span className="capitalize">Sensação: {act.sensation}</span>
                  </div>
                </div>
              </div>

              {/* Stats Numbers */}
              <div className="flex items-center gap-4 sm:gap-6 text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--ipace-border)]">
                <div>
                  <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Distância</div>
                  <div className="font-heading font-black text-base text-[var(--ipace-primary)]">
                    {act.distanceKm.toFixed(2)} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Tempo</div>
                  <div className="font-heading font-extrabold text-sm text-[var(--ipace-text)]">
                    {formatSeconds(act.durationSeconds)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[var(--ipace-text-2)]">Pace</div>
                  <div className="font-heading font-extrabold text-sm text-[var(--ipace-text)]">
                    {act.avgPace}/km
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
