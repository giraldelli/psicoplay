import React, { useState } from 'react';
import {
  TrendingUp,
  FileCheck,
  Printer,
  Activity,
  Users,
} from 'lucide-react';
import { Patient, GameMetricRecord } from '@backend/types.ts';
import { audio } from '../components/AudioService.ts';

interface ReportsViewProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  metrics: GameMetricRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  metrics,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const hasPatient = Boolean(currentPatient);
  const patientMetrics = currentPatient ? metrics.filter((m) => m.patientId === currentPatient.id) : [];
  const hasMetrics = patientMetrics.length > 0;

  const avgScore = hasMetrics
    ? Math.round(patientMetrics.reduce((acc, m) => acc + m.score, 0) / patientMetrics.length)
    : 0;

  const skillsAssessment = [
    {
      skill: 'Organização e Pareamento de Formas/Cores',
      domain: 'Raciocínio Lógico-Visual',
      score: hasMetrics ? avgScore : 0,
      trend: hasMetrics ? `${patientMetrics.length} atividade(s) gravada(s)` : 'Sem registros ainda',
      description: 'Capacidade de separar blocos e associar objetos à mesma classe funcional.',
      color: 'bg-[#4FA88E]',
    },
    {
      skill: 'Percepção de Causa e Efeito',
      domain: 'Neurocognição',
      score: hasMetrics ? Math.min(100, avgScore + 4) : 0,
      trend: hasMetrics ? 'Resposta aos estímulos táteis' : 'Sem registros ainda',
      description: 'Atenção e resposta voluntária ao toque direto e estouro suave de balões.',
      color: 'bg-[#3E8EBF]',
    },
    {
      skill: 'Regulação Sensorial em Atividades Lúdicas',
      domain: 'Processamento Sensorial',
      score: hasMetrics ? 85 : 0,
      trend: hasMetrics ? 'Ambiente sensorial equilibrado' : 'Sem registros ainda',
      description: 'Comportamento e tolerância sensorial durante as atividades digitais.',
      color: 'bg-[#7E57C2]',
    },
    {
      skill: 'Autonomia sem Necessidade de Mediação Física',
      domain: 'Funções Executivas',
      score: hasMetrics ? Math.max(50, avgScore - 5) : 0,
      trend: hasMetrics ? 'Grau de independência monitorado' : 'Sem registros ainda',
      description: 'Iniciativa para tentar de forma independente antes de solicitar ajuda.',
      color: 'bg-[#D97706]',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  if (!hasPatient) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        <div className="pb-4 border-b border-[#EDE4DA]">
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Relatórios de Evolução Psicopedagógica
          </h1>
          <p className="text-xs text-[#64748B]">
            Indicadores de aprendizagem, respostas a estímulos e parecer técnico
          </p>
        </div>

        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EDE4DA]">
          <Users className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-[#1E293B] mb-1">
            Nenhum Paciente Cadastrado
          </h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto mb-4 leading-relaxed">
            Cadastre seus pacientes para registrar os atendimentos, aplicar os jogos adaptados e visualizar os relatórios evolutivos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Relatórios de Evolução Psicopedagógica
          </h1>
          <p className="text-xs text-[#64748B]">
            Indicadores de aprendizagem, respostas a estímulos e parecer técnico
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              audio.playSoftTap();
              onSelectPatient(e.target.value);
            }}
            className="text-xs font-bold bg-white border border-[#EDE4DA] rounded-xl px-3 py-2 text-[#1E293B] shadow-xs outline-none focus:ring-2 focus:ring-[#A8E6CF]"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                Paciente: {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              audio.playSoftTap();
              setIsReportModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-xs shadow-xs hover:opacity-95 flex items-center gap-2 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Emitir Laudo / Parecer</span>
          </button>
        </div>
      </div>

      {/* Patient Snapshot Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#EDE4DA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-[#1E293B] shadow-xs"
            style={{ backgroundColor: currentPatient?.avatarColor || '#A8E6CF' }}
          >
            {currentPatient?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1E293B]">
              {currentPatient?.name}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {currentPatient?.age} anos • {currentPatient?.diagnosis} {currentPatient?.cid ? `(CID ${currentPatient.cid})` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="text-center p-2.5 rounded-xl bg-[#F7F3EE] border border-[#EDE4DA]">
            <span className="text-[10px] uppercase text-[#64748B] block">Sessões Realizadas</span>
            <span className="text-base font-extrabold text-[#1E293B]">{currentPatient?.sessionsCount || 0}</span>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-[#E8F8F2] border border-[#A8E6CF]">
            <span className="text-[10px] uppercase text-[#2D6A4F] block">Índice Evolutivo</span>
            <span className="text-base font-extrabold text-[#2D6A4F]">
              {hasMetrics ? `${avgScore}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Domain Evolution Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillsAssessment.map((skill, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white border border-[#EDE4DA] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#F7F3EE] text-[#64748B] border border-[#EDE4DA]">
                {skill.domain}
              </span>
              <span className="text-sm font-black text-[#1E293B]">
                {skill.score}%
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">
                {skill.skill}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {skill.description}
              </p>
            </div>

            <div className="w-full bg-[#F7F3EE] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${skill.color}`}
                style={{ width: `${skill.score}%` }}
              />
            </div>

            <span className="text-[11px] font-bold text-[#2D6A4F] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {skill.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Recorded Game Metrics Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
          <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#4FA88E]" />
            <span>Registro Histórico de Reações nos Jogos</span>
          </h2>
          <span className="text-xs font-bold text-[#64748B]">
            {patientMetrics.length} atividade(s) gravada(s)
          </span>
        </div>

        {patientMetrics.length > 0 ? (
          <div className="space-y-3">
            {patientMetrics.map((metric) => (
              <div
                key={metric.id}
                className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1E293B] text-sm">
                      {metric.gameTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F2] text-[#2D6A4F]">
                      Score: {metric.score}%
                    </span>
                  </div>
                  <p className="text-[#64748B] mt-1">
                    {metric.date} • Duração: {metric.durationSeconds}s • Toques: {metric.touchesCount} • Ajustes: {metric.mistakesCount}
                  </p>
                  <p className="text-[#475569] font-medium mt-1">
                    &quot;{metric.clinicalNotes}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-[#EDE4DA] font-semibold text-[#1E293B]">
                    Autonomia: {metric.autonomy.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#EDE7F6] text-[#5E35B1] font-bold border border-[#D1C4E9]">
                    Estado: {metric.sensoryState}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#64748B] bg-[#FCFBF9] rounded-2xl border border-dashed border-[#EDE4DA]">
            Ainda não há jogos gravados para este paciente. Inicie uma atividade na aba &quot;Jogos&quot; para registrar reações e compor a evolução!
          </div>
        )}
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3E50]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EDE4DA] shadow-2xl relative">

            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE4DA] mb-6">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#4FA88E]" />
                <h3 className="text-base font-extrabold text-[#1E293B]">
                  Parecer Psicopedagógico Formativo • PsicoPlay
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl border border-[#EDE4DA] hover:bg-[#F7F3EE] text-xs font-bold text-[#1E293B] flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#3E8EBF]" />
                  <span>Imprimir / PDF</span>
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-[#F7F3EE] text-[#64748B]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Document Content */}
            <div className="space-y-4 text-xs text-[#1E293B] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA]">
                <div className="grid grid-cols-2 gap-2">
                  <p><strong>Paciente:</strong> {currentPatient?.name}</p>
                  <p><strong>Idade:</strong> {currentPatient?.age} anos ({currentPatient?.birthDate || 'Não informada'})</p>
                  <p><strong>Hipótese Diagnóstica:</strong> {currentPatient?.diagnosis}</p>
                  <p><strong>Classificação CID:</strong> {currentPatient?.cid || 'Não informada'}</p>
                  <p><strong>Responsável:</strong> {currentPatient?.guardianName || 'Não informado'}</p>
                  <p><strong>Data da Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-sm mb-1 text-[#2D6A4F]">
                  1. Perfil de Aprendizagem & Resposta aos Estímulos Digitais
                </h4>
                <p className="text-[#475569]">
                  O paciente realizou atividades adaptadas na plataforma PsicoPlay. Observou-se que telas com paleta suave em tons de verde-menta, bege e azul-claro favoreceram a autorregulação e a sustentação atencional, sem sobrecarga sensorial.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-sm mb-1 text-[#2D6A4F]">
                  2. Causa e Efeito & Raciocínio Visual
                </h4>
                <p className="text-[#475569]">
                  Nas tarefas lúdicas e interações adaptadas, as respostas voluntárias e o tempo de reação foram monitorados clinicamente, servindo de base para o plano de intervenção psicopedagógica individualizado.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-sm mb-1 text-[#2D6A4F]">
                  3. Encaminhamentos para Família e Escola
                </h4>
                <p className="text-[#475569]">
                  Recomenda-se a continuidade de tarefas de rotina com suporte visual, respeitando as pausas sensoriais quando houver sinais de fadiga cognitiva.
                </p>
              </div>

              <div className="pt-8 border-t border-[#EDE4DA] flex flex-col items-center justify-center text-center">
                <div className="w-48 border-b border-[#1E293B] mb-1" />
                <p className="font-bold">Profissional Responsável</p>
                <p className="text-[#64748B]">Saúde & Educação</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
