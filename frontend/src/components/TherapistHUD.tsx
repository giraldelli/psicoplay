import React, { useState, useEffect } from 'react';
import {
  Activity,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Minimize2,
  Maximize2,
  ShieldAlert,
  Brain,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
} from 'lucide-react';
import { Patient, GameMetricRecord } from '@backend/types.ts';
import { evaluateReaction, AutonomyLevel, SensoryState } from '@/utils/psychopedagogyRules.ts';
import { audio } from './AudioService.ts';

interface TherapistHUDProps {
  patient: Patient;
  gameId: string;
  gameTitle: string;
  touchesCount: number;
  mistakesCount: number;
  onSaveMetric: (metric: GameMetricRecord) => void;
  onCloseGame: () => void;
  isPatientMode: boolean;
  onTogglePatientMode: () => void;
}

export const TherapistHUD: React.FC<TherapistHUDProps> = ({
  patient,
  gameId,
  gameTitle,
  touchesCount,
  mistakesCount,
  onSaveMetric,
  onCloseGame,
  isPatientMode,
  onTogglePatientMode,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [autonomy, setAutonomy] = useState<AutonomyLevel>('independente');
  const [sensoryState, setSensoryState] = useState<SensoryState>('calmo');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Timer for session length
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveObservation = () => {
    const evaluation = evaluateReaction({
      timeTakenMs: secondsElapsed * 1000,
      expectedTimeMs: 120000,
      mistakesCount,
      touchesCount,
      autonomy,
      sensoryState,
    });

    const record: GameMetricRecord = {
      id: `m-${Date.now()}`,
      patientId: patient.id,
      gameId,
      gameTitle,
      date: new Date().toISOString().split('T')[0],
      durationSeconds: secondsElapsed,
      score: evaluation.score,
      touchesCount,
      mistakesCount,
      autonomy,
      sensoryState,
      clinicalNotes: clinicalNotes.trim()
        ? `${clinicalNotes.trim()} (${evaluation.clinicalSummary})`
        : evaluation.clinicalSummary,
    };

    audio.playSuccessArpeggio();
    onSaveMetric(record);
    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
      onCloseGame();
    }, 1200);
  };

  // If in pure Patient Mode, show only a discreet floating button to exit or toggle
  if (isPatientMode) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={onTogglePatientMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white backdrop-blur-sm text-[#475569] text-xs font-semibold shadow-xs border border-[#EDE4DA] transition-all opacity-40 hover:opacity-100"
          title="Alternar para Painel do Profissional da Saúde e Educação"
        >
          <Activity className="w-3.5 h-3.5 text-[#3E8EBF]" />
          <span>Modo Profissional</span>
        </button>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-80 bg-white/95 backdrop-blur-md border-l border-[#EDE4DA] flex flex-col justify-between p-4 shadow-lg z-30 transition-all">
      <div className="space-y-4">
        {/* HUD Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E8F8F2] text-[#2D6A4F]">
              <Brain className="w-4 h-4 text-[#4FA88E]" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wide">
                Observação Clínica
              </h3>
              <p className="text-[11px] text-[#64748B] font-medium truncate max-w-[150px]">
                {patient.name}
              </p>
            </div>
          </div>

          <button
            onClick={onTogglePatientMode}
            className="p-1.5 rounded-lg hover:bg-[#F7F3EE] text-[#64748B] hover:text-[#1E293B] transition-colors"
            title="Ocultar painel (Modo Paciente tela cheia)"
            aria-label="Ativar Modo Paciente"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time counters */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#F7F3EE] text-center">
            <div className="flex items-center justify-center text-[#64748B] mb-0.5">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-[10px] font-bold uppercase">Tempo</span>
            </div>
            <span className="text-sm font-extrabold text-[#1E293B]">
              {formatTime(secondsElapsed)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#E8F8F2] text-center">
            <div className="flex items-center justify-center text-[#2D6A4F] mb-0.5">
              <Activity className="w-3 h-3 mr-1 text-[#4FA88E]" />
              <span className="text-[10px] font-bold uppercase">Toques</span>
            </div>
            <span className="text-sm font-extrabold text-[#1B4332]">
              {touchesCount}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EDE7F6] text-center">
            <div className="flex items-center justify-center text-[#5E35B1] mb-0.5">
              <Eye className="w-3 h-3 mr-1 text-[#7E57C2]" />
              <span className="text-[10px] font-bold uppercase">Ajustes</span>
            </div>
            <span className="text-sm font-extrabold text-[#311B92]">
              {mistakesCount}
            </span>
          </div>
        </div>

        {/* Sensory Regulation Rating */}
        <div>
          <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
            Estado de Regulação Sensorial:
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: 'calmo' as SensoryState, label: 'Calmo', icon: Smile, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { id: 'focado' as SensoryState, label: 'Focado', icon: CheckCircle2, color: 'text-blue-700 bg-blue-50 border-blue-200' },
              { id: 'desatento' as SensoryState, label: 'Disperso', icon: Meh, color: 'text-amber-700 bg-amber-50 border-amber-200' },
              { id: 'em_alerta' as SensoryState, label: 'Em Alerta', icon: AlertTriangle, color: 'text-orange-700 bg-orange-50 border-orange-200' },
              { id: 'sobrecarregado' as SensoryState, label: 'Sobrecarga', icon: Frown, color: 'text-rose-700 bg-rose-50 border-rose-200' },
            ].map((state) => {
              const Icon = state.icon;
              const isSelected = sensoryState === state.id;
              return (
                <button
                  key={state.id}
                  onClick={() => {
                    audio.playSoftTap();
                    setSensoryState(state.id);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? `${state.color} ring-2 ring-offset-1 ring-[#3E8EBF]`
                      : 'bg-[#F7F3EE] border-[#EDE4DA] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{state.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Autonomy Level / Mediation required */}
        <div>
          <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
            Nível de Mediação Aplicada:
          </label>
          <select
            value={autonomy}
            onChange={(e) => setAutonomy(e.target.value as AutonomyLevel)}
            className="w-full text-xs font-semibold bg-[#F7F3EE] border border-[#EDE4DA] rounded-xl p-2 text-[#1E293B] outline-none focus:ring-2 focus:ring-[#A8E6CF]"
          >
            <option value="independente">Realização Independente</option>
            <option value="dica_verbal">Com Dica Verbal / Orientação</option>
            <option value="apoio_gestual">Com Apoio Gestual / Apontamento</option>
            <option value="apoio_fisico_leve">Com Apoio Físico Leve (Mão sobre mão)</option>
          </select>
        </div>

        {/* Quick Clinical Notes */}
        <div>
          <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
            Anotações Psicopedagógicas:
          </label>
          <textarea
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            rows={2}
            placeholder="Ex: Teve interesse espontâneo, seguiu instruções visuais, sorriu com reforço..."
            className="w-full text-xs bg-[#FAF8F5] border border-[#EDE4DA] rounded-xl p-2.5 text-[#1E293B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#A8E6CF] resize-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#EDE4DA] space-y-2">
        <button
          onClick={handleSaveObservation}
          disabled={isSavedFeedback}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
        >
          {isSavedFeedback ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Registrado no Prontuário!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Registrar Reação & Finalizar</span>
            </>
          )}
        </button>

        <button
          onClick={onCloseGame}
          className="w-full py-1.5 text-xs font-bold text-[#64748B] hover:text-[#1E293B] transition-colors"
        >
          Sair do Jogo sem salvar
        </button>
      </div>
    </aside>
  );
};
