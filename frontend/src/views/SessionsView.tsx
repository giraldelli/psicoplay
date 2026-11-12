import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Calendar,
  Clock,
  User,
  Brain,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  FileText,
  X,
  Search,
} from 'lucide-react';
import { Patient, SessionRecord } from '@backend/types.ts';
import { audio } from '../components/AudioService.ts';

interface SessionsViewProps {
  sessions: SessionRecord[];
  patients: Patient[];
  onSaveSession: (session: SessionRecord) => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  patients,
  onSaveSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New session state
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    durationMinutes: 50,
    therapistName: 'Profissional da Saúde e Educação',
    initialMood: 'calmo' as const,
    finalMood: 'regulado' as const,
    gamesPlayed: ['Pareamento por Cor ou Forma'],
    clinicalObservations: '',
    familyRecommendations: '',
  });

  const filteredSessions = sessions.filter(
    (s) =>
      s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clinicalObservations.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === formData.patientId) || patients[0];

    audio.playSuccessArpeggio();
    onSaveSession({
      id: `s-${Date.now()}`,
      patientId: formData.patientId,
      patientName: patient.name,
      date: formData.date,
      time: formData.time,
      durationMinutes: Number(formData.durationMinutes),
      therapistName: formData.therapistName,
      initialMood: formData.initialMood,
      finalMood: formData.finalMood,
      gamesPlayed: formData.gamesPlayed,
      clinicalObservations: formData.clinicalObservations,
      familyRecommendations: formData.familyRecommendations,
      gameMetrics: [],
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Registro de Sessões Clínicas
          </h1>
          <p className="text-xs text-[#64748B]">
            Anotações psicopedagógicas, reações emocionais e orientações para família
          </p>
        </div>

        <button
          onClick={() => {
            audio.playSoftTap();
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#4FA88E] hover:bg-[#3d8c75] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Atendimento</span>
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar nos registros de atendimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-[#EDE4DA] rounded-xl outline-none focus:ring-2 focus:ring-[#A8E6CF]"
          />
        </div>
        <span className="text-xs font-bold text-[#64748B]">
          {filteredSessions.length} sessões arquivadas
        </span>
      </div>

      {/* Sessions Timeline Cards */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDE4DA]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F8F2] flex items-center justify-center text-[#2D6A4F] font-black text-sm">
                    {session.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1E293B]">
                      {session.patientName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#3E8EBF]" />
                        {session.date} às {session.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#4FA88E]" />
                        {session.durationMinutes} minutos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mood regulation badges */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-[#F7F3EE] text-[#64748B] border border-[#EDE4DA]">
                    Entrada: <strong>{session.initialMood}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E8F8F2] text-[#2D6A4F] font-bold border border-[#A8E6CF]">
                    Saída: <strong>{session.finalMood}</strong>
                  </span>
                </div>
              </div>

              {/* Games applied in session */}
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                  Jogos Lúdicos Aplicados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {session.gamesPlayed.map((game, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FCFBF9] border border-[#EDE4DA] text-[#1E293B]"
                    >
                      🎮 {game}
                    </span>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE4DA]">
                  <span className="font-extrabold text-[#1E293B] block mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#3E8EBF]" /> Observações Psicopedagógicas:
                  </span>
                  <p className="text-[#475569] leading-relaxed">
                    {session.clinicalObservations}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#E8F8F2]/60 border border-[#A8E6CF]">
                  <span className="font-extrabold text-[#2D6A4F] block mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4FA88E]" /> Orientações para a Família & Escola:
                  </span>
                  <p className="text-[#1B4332] leading-relaxed">
                    {session.familyRecommendations}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EDE4DA]">
            <ClipboardList className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
            <h3 className="text-base font-extrabold text-[#1E293B]">Nenhum Atendimento Registrado</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Após realizar um atendimento ou aplicar jogos adaptados, registre aqui as observações e orientações clínicas.
            </p>
            <button
              onClick={() => {
                audio.playSoftTap();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#4FA88E] hover:bg-[#3d8c75] text-white text-xs font-bold transition-all cursor-pointer"
            >
              + Registrar Primeiro Atendimento
            </button>
          </div>
        )}
      </div>

      {/* New Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3E50]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#EDE4DA] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F7F3EE] text-[#64748B]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-[#1E293B] mb-1">
              Registro de Atendimento Clínico
            </h2>
            <p className="text-xs text-[#64748B] mb-5">
              Anote os marcos da sessão, reações emocionais e tarefas sugeridas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Paciente</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.diagnosis})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Horário</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Jogos e Recursos Utilizados</label>
                <input
                  type="text"
                  placeholder="Ex: Pareamento por Cores, Toque Direto"
                  value={formData.gamesPlayed.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gamesPlayed: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Observações do Profissional (Saúde / Educação)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Como a criança reagiu? Houve engajamento? Houve necessidade de pausas sensoriais?"
                  value={formData.clinicalObservations}
                  onChange={(e) => setFormData({ ...formData, clinicalObservations: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Recomendações para a Família</label>
                <textarea
                  rows={2}
                  placeholder="Orientações de estímulo para realizar em casa..."
                  value={formData.familyRecommendations}
                  onChange={(e) => setFormData({ ...formData, familyRecommendations: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EDE4DA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4FA88E] text-white font-bold text-xs shadow-sm hover:bg-[#3d8c75]"
                >
                  Salvar Registro no Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
