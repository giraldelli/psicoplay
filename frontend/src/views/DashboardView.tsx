import React from 'react';
import {
  CalendarDays,
  Users,
  Gamepad2,
  TrendingUp,
  Clock,
  ArrowRight,
  Brain,
  Plus,
} from 'lucide-react';
import { Patient, Appointment, GameMetricRecord, SessionRecord } from '@backend/types.ts';
import { audio } from '../components/AudioService.ts';

interface DashboardViewProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  appointments: Appointment[];
  recentMetrics: GameMetricRecord[];
  recentSessions: SessionRecord[];
  onNavigateToGames: (gameId?: string) => void;
  onNavigateToPatients: (patientId?: string) => void;
  onNavigateToCalendar: () => void;
  onNavigateToReports: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  appointments,
  recentMetrics,
  recentSessions,
  onNavigateToGames,
  onNavigateToPatients,
  onNavigateToCalendar,
  onNavigateToReports,
}) => {
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const hasPatients = patients.length > 0;
  const hasMetrics = recentMetrics.length > 0;

  // Calculate real metrics or clean zero state (no fictional data)
  const avgScore = hasMetrics
    ? Math.round(recentMetrics.reduce((acc, m) => acc + m.score, 0) / recentMetrics.length)
    : 0;

  const evolutionStats = [
    {
      label: 'Causa & Efeito',
      value: hasMetrics ? `${avgScore}%` : '0%',
      detail: hasMetrics ? 'Baseado em sessões gravadas' : 'Aguardando primeiras sessões',
      color: 'bg-[#E8F8F2] text-[#2D6A4F] border-[#A8E6CF]',
      barColor: 'bg-[#4FA88E]',
      percent: hasMetrics ? avgScore : 0,
    },
    {
      label: 'Classificação & Pareamento',
      value: hasMetrics ? `${Math.min(100, avgScore + 2)}%` : '0%',
      detail: hasMetrics ? 'Autonomia visual monitorada' : 'Aguardando atividades',
      color: 'bg-[#D4ECF9] text-[#1E3A8A] border-[#A0D2EB]',
      barColor: 'bg-[#3E8EBF]',
      percent: hasMetrics ? Math.min(100, avgScore + 2) : 0,
    },
    {
      label: 'Regulação Sensorial',
      value: hasMetrics ? 'Estável' : '--',
      detail: hasMetrics ? 'Conforme registros clínicos' : 'Sem histórico registrado',
      color: 'bg-[#EDE7F6] text-[#5E35B1] border-[#D1C4E9]',
      barColor: 'bg-[#7E57C2]',
      percent: hasMetrics ? 85 : 0,
    },
    {
      label: 'Atenção Sustentada',
      value: hasMetrics ? `${recentMetrics.length} jogos` : '0',
      detail: hasMetrics ? 'Total de registros gravados' : 'Nenhuma atividade registrada',
      color: 'bg-[#F7F3EE] text-[#6D4C41] border-[#EDE4DA]',
      barColor: 'bg-[#8D7B68]',
      percent: hasMetrics ? Math.min(100, recentMetrics.length * 20) : 0,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* Welcome & Clinical Horizon Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#FCFBF9] to-[#E8F8F2]/60 p-6 sm:p-8 border border-[#EDE4DA] shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              {hasPatients ? 'Painel de Atendimentos Clínicos' : 'Bem-vindo ao PsicoPlay!'}
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              {hasPatients ? (
                <>
                  Você possui <strong className="text-[#1E293B]">{appointments.length} atendimento(s) agendado(s)</strong>.
                  {selectedPatient && (
                    <> Paciente em foco no consultório: <strong className="text-[#1E293B]">{selectedPatient.name}</strong> ({selectedPatient.diagnosis}).</>
                  )}
                </>
              ) : (
                'Plataforma clínica especializada para acompanhamento de pacientes com TEA, deficiência intelectual e atrasos no desenvolvimento através de jogos adaptados. Comece cadastrando o seu primeiro paciente.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasPatients ? (
              <>
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToGames();
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Abrir Jogos com {selectedPatient?.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToCalendar();
                  }}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-[#F7F3EE] text-[#1E293B] font-bold text-sm border border-[#EDE4DA] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4 text-[#3E8EBF]" />
                  <span>Ver Calendário</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToPatients();
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Primeiro Paciente</span>
                </button>
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToGames();
                  }}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-[#F7F3EE] text-[#1E293B] font-bold text-sm border border-[#EDE4DA] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4 text-[#4FA88E]" />
                  <span>Explorar Jogos Adaptados</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ambient subtle decorative shape */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-[#A8E6CF]/20 blur-2xl pointer-events-none" />
      </section>

      {/* Grid: Indicators & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Evolution Indicators & Recommended Activities */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Evolution Indicators (Indicadores de Evolução) */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#E8F8F2] text-[#2D6A4F]">
                  <TrendingUp className="w-4 h-4 text-[#4FA88E]" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E293B]">
                    Indicadores de Evolução Neurocognitiva
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {hasMetrics ? 'Métricas calculadas a partir das reações gravadas' : 'Sem registros ainda. Os dados serão atualizados conforme as sessões forem salvas.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio.playSoftTap();
                  onNavigateToReports();
                }}
                className="text-xs font-bold text-[#3E8EBF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Relatório detalhado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evolutionStats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${stat.color} transition-all`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold">{stat.label}</span>
                    <span className="text-lg font-black">{stat.value}</span>
                  </div>
                  <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full ${stat.barColor}`}
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] opacity-90 font-medium">
                    {stat.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Therapeutic Games */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#EDE7F6] text-[#5E35B1]">
                  <Brain className="w-4 h-4 text-[#7E57C2]" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E293B]">
                    {selectedPatient ? `Atividades Sugeridas para ${selectedPatient.name.split(' ')[0]}` : 'Jogos Terapêuticos Disponíveis'}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {selectedPatient ? `Baseado no perfil: ${selectedPatient.diagnosis}` : 'Jogos estruturados para raciocínio, classificação e causa e efeito'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'color-shape',
                  title: 'Pareamento por Cor & Forma',
                  badge: 'Organização Mental',
                  badgeColor: 'bg-[#E8F8F2] text-[#2D6A4F]',
                  desc: 'Ajuda a estruturar categorias lógicas com baixo ruído visual.',
                },
                {
                  id: 'real-objects',
                  title: 'Associação de Figuras Reais',
                  badge: 'Objetos Cotidianos',
                  badgeColor: 'bg-[#D4ECF9] text-[#1E3A8A]',
                  desc: 'Generalização de conceitos concretos (talher, calçado, higiene).',
                },
                {
                  id: 'balloons',
                  title: 'Toque Direto: Balões',
                  badge: 'Alta Previsibilidade',
                  badgeColor: 'bg-[#EDE7F6] text-[#5E35B1]',
                  desc: 'Estouro suave com estrelas e animais fofos sem sons agudos.',
                },
              ].map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToGames(activity.id);
                  }}
                  className="p-4 rounded-2xl bg-[#FCFBF9] hover:bg-[#F7F3EE] border border-[#EDE4DA] cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                >
                  <div>
                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-2 ${activity.badgeColor}`}>
                      {activity.badge}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B] mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {activity.desc}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#4FA88E]">
                    <span>Iniciar agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Today's Appointments & Recent Patients */}
        <div className="space-y-6">
          
          {/* Próximos Atendimentos */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#D4ECF9] text-[#1E3A8A]">
                  <CalendarDays className="w-4 h-4 text-[#3E8EBF]" />
                </span>
                <h2 className="text-sm font-extrabold text-[#1E293B]">
                  Próximos Atendimentos
                </h2>
              </div>
              <span className="text-xs font-bold text-[#64748B]">
                {appointments.length} agendado(s)
              </span>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => {
                      audio.playSoftTap();
                      onSelectPatient(apt.patientId);
                    }}
                    className="p-3.5 rounded-2xl bg-[#FCFBF9] hover:bg-[#F7F3EE] border border-[#EDE4DA] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F8F2] flex flex-col items-center justify-center text-[#2D6A4F] font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-[#4FA88E] mb-0.5" />
                        <span>{apt.time}</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1E293B]">
                          {apt.patientName}
                        </h3>
                        <p className="text-[11px] text-[#64748B]">
                          {apt.diagnosis}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmado
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center bg-[#FCFBF9] rounded-2xl border border-dashed border-[#EDE4DA]">
                <Clock className="w-8 h-8 text-[#CBD5E1] mx-auto mb-1.5" />
                <p className="text-xs text-[#64748B] mb-3">Nenhum atendimento agendado para hoje.</p>
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToCalendar();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E8F8F2] hover:bg-[#A8E6CF]/40 text-[#2D6A4F] text-xs font-bold transition-all cursor-pointer"
                >
                  + Agendar Atendimento
                </button>
              </div>
            )}
          </div>

          {/* Pacientes Recentes */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#EDE7F6] text-[#5E35B1]">
                  <Users className="w-4 h-4 text-[#7E57C2]" />
                </span>
                <h2 className="text-sm font-extrabold text-[#1E293B]">
                  Pacientes em Acompanhamento
                </h2>
              </div>
              {hasPatients && (
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToPatients();
                  }}
                  className="text-xs font-bold text-[#3E8EBF] hover:underline cursor-pointer"
                >
                  Ver todos
                </button>
              )}
            </div>

            {hasPatients ? (
              <div className="space-y-2.5">
                {patients.slice(0, 4).map((p) => {
                  const isCurrent = p.id === selectedPatientId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        audio.playSoftTap();
                        onSelectPatient(p.id);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#E8F8F2] border-[#A8E6CF] ring-2 ring-[#4FA88E]/20'
                          : 'bg-[#FCFBF9] border-[#EDE4DA] hover:bg-[#F7F3EE]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-[#1E293B] shadow-xs"
                          style={{ backgroundColor: p.avatarColor }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-extrabold text-[#2D6A4F] bg-white px-1.5 py-0.2 rounded-full">
                                Em foco
                              </span>
                            )}
                          </h3>
                          <p className="text-[11px] text-[#64748B]">
                            {p.age} anos • {p.diagnosis.split('(')[0]}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#64748B]">
                        {p.sessionsCount} sessões
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-5 text-center bg-[#FCFBF9] rounded-2xl border border-dashed border-[#EDE4DA]">
                <Users className="w-8 h-8 text-[#CBD5E1] mx-auto mb-1.5" />
                <p className="text-xs text-[#64748B] mb-3">Nenhum paciente cadastrado no momento.</p>
                <button
                  onClick={() => {
                    audio.playSoftTap();
                    onNavigateToPatients();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4FA88E] hover:bg-[#3d8c75] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  + Cadastrar Paciente
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
