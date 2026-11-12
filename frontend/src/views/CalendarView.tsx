import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
} from 'lucide-react';
import { Patient, Appointment } from '@backend/types.ts';
import { audio } from '../components/AudioService.ts';

interface CalendarViewProps {
  appointments: Appointment[];
  patients: Patient[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onStartSession: (patientId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  patients,
  onAddAppointment,
  onStartSession,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-11-10');

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    date: '2026-11-10',
    time: '11:00',
    durationMinutes: 50,
    goals: 'Treino de atenção visual, pareamento por cor',
  });

  const weekDays = [
    { day: 'Segunda', date: '2026-11-09', num: '09' },
    { day: 'Terça (Hoje)', date: '2026-11-10', num: '10' },
    { day: 'Quarta', date: '2026-11-11', num: '11' },
    { day: 'Quinta', date: '2026-11-12', num: '12' },
    { day: 'Sexta', date: '2026-11-13', num: '13' },
  ];

  const appointmentsForSelectedDate = appointments.filter(
    (a) => a.date === selectedDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === formData.patientId) || patients[0];

    audio.playSuccessArpeggio();
    onAddAppointment({
      patientId: formData.patientId,
      patientName: patient.name,
      diagnosis: patient.diagnosis,
      date: formData.date,
      time: formData.time,
      durationMinutes: Number(formData.durationMinutes),
      status: 'confirmado',
      targetGoals: formData.goals.split(',').map((g) => g.trim()).filter(Boolean),
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Calendário de Atendimentos
          </h1>
          <p className="text-xs text-[#64748B]">
            Planejamento de sessões individuais e metas terapêuticas
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
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Week Day Picker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {weekDays.map((d) => {
          const isSelected = selectedDate === d.date;
          const count = appointments.filter((a) => a.date === d.date).length;

          return (
            <button
              key={d.date}
              onClick={() => {
                audio.playSoftTap();
                setSelectedDate(d.date);
              }}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#E8F8F2] border-[#A8E6CF] ring-2 ring-[#4FA88E]/30 shadow-xs'
                  : 'bg-white border-[#EDE4DA] hover:bg-[#F7F3EE]'
              }`}
            >
              <span className="text-[11px] font-bold text-[#64748B] block">
                {d.day}
              </span>
              <span className="text-xl font-black text-[#1E293B] block my-0.5">
                {d.num}
              </span>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                count > 0 ? 'bg-[#D4ECF9] text-[#1E3A8A]' : 'bg-[#F7F3EE] text-[#94A3B8]'
              }`}>
                {count} {count === 1 ? 'sessão' : 'sessões'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointments List for Day */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
          <h2 className="text-sm font-extrabold text-[#1E293B] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#3E8EBF]" />
            <span>Sessões em {selectedDate}</span>
          </h2>
          <span className="text-xs font-bold text-[#64748B]">
            {appointmentsForSelectedDate.length} paciente(s)
          </span>
        </div>

        {appointmentsForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {appointmentsForSelectedDate.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F8F2] flex flex-col items-center justify-center text-[#2D6A4F] font-bold text-xs shrink-0">
                    <Clock className="w-4 h-4 text-[#4FA88E] mb-0.5" />
                    <span>{apt.time}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#1E293B]">
                        {apt.patientName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {apt.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] mt-0.5">
                      {apt.diagnosis} • Duração de {apt.durationMinutes} min
                    </p>

                    {apt.targetGoals && apt.targetGoals.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {apt.targetGoals.map((goal, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#EDE7F6] text-[#5E35B1] px-2.5 py-0.5 rounded-lg border border-[#D1C4E9]/60"
                          >
                            <Target className="w-3 h-3" /> {goal}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => {
                      audio.playSoftTap();
                      onStartSession(apt.patientId);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:opacity-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar Atendimento Lúdico</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#64748B]">
            <CalendarDays className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
            <p className="text-sm font-bold text-[#1E293B]">
              Nenhum atendimento agendado para esta data.
            </p>
            <p className="text-xs">
              Clique em &quot;Novo Agendamento&quot; acima para marcar uma sessão.
            </p>
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3E50]/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE4DA] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F7F3EE] text-[#64748B]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-[#1E293B] mb-1">
              Novo Agendamento
            </h2>
            <p className="text-xs text-[#64748B] mb-5">
              Escolha o paciente e o horário para o atendimento lúdico.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Paciente</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  required
                >
                  {patients.length > 0 ? (
                    patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.diagnosis})
                      </option>
                    ))
                  ) : (
                    <option value="">Nenhum paciente cadastrado (cadastre na aba Pacientes)</option>
                  )}
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
                <label className="block font-bold text-[#1E293B] mb-1">Metas & Jogos Planejados</label>
                <input
                  type="text"
                  placeholder="Ex: Pareamento de formas, regulação sensorial com pintura"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
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
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
