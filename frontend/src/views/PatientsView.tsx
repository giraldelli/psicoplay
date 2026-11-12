import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Heart,
  Brain,
  Sparkles,
  Calendar,
  Phone,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Gamepad2,
  Eye,
  Sliders,
  X,
  Search,
} from 'lucide-react';
import { Patient, SensorySensitivity } from '@backend/types.ts';
import { audio } from '../components/AudioService.ts';

interface PatientsViewProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onAddPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'sessionsCount' | 'lastSessionDate'>) => void;
  onStartSessionWithPatient: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
  onStartSessionWithPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'sensory' | 'history'>('profile');

  // Form State for New Patient
  const [formData, setFormData] = useState({
    name: '',
    age: 7,
    birthDate: '',
    diagnosis: 'Transtorno do Espectro Autista (TEA Nível 1)',
    cid: 'F84.0',
    guardianName: '',
    guardianPhone: '',
    schoolGrade: '',
    avatarColor: '#A8E6CF',
    notes: '',
    hyperfocus: '',
    triggers: '',
    calming: '',
    auditory: 'moderada' as SensorySensitivity,
    visual: 'baixa' as SensorySensitivity,
    tactile: 'baixa' as SensorySensitivity,
  });

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.guardianName.trim()) return;

    audio.playSuccessArpeggio();
    onAddPatient({
      name: formData.name,
      age: Number(formData.age),
      birthDate: formData.birthDate,
      diagnosis: formData.diagnosis,
      cid: formData.cid,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone || '(11) 99999-0000',
      schoolGrade: formData.schoolGrade || 'Ensino Fundamental',
      avatarColor: formData.avatarColor,
      notes: formData.notes,
      sensoryProfile: {
        auditorySensitivity: formData.auditory,
        visualSensitivity: formData.visual,
        tactileSensitivity: formData.tactile,
        hyperfocusInterests: formData.hyperfocus.split(',').map((s) => s.trim()).filter(Boolean),
        sensoryTriggers: formData.triggers.split(',').map((s) => s.trim()).filter(Boolean),
        calmingTechniques: formData.calming.split(',').map((s) => s.trim()).filter(Boolean),
      },
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Cadastro de Pacientes
          </h1>
          <p className="text-xs text-[#64748B]">
            Perfis clínicos, características sensoriais e histórico individual
          </p>
        </div>

        <button
          onClick={() => {
            audio.playSoftTap();
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#4FA88E] hover:bg-[#3d8c75] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {/* Main Layout: List & Selected Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient List with Search */}
        <div className="bg-white rounded-3xl p-5 border border-[#EDE4DA] shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#FCFBF9] border border-[#EDE4DA] rounded-xl outline-none focus:ring-2 focus:ring-[#A8E6CF]"
            />
          </div>

          {filteredPatients.length > 0 ? (
            <div className="space-y-2">
              {filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      audio.playSoftTap();
                      onSelectPatient(p.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#E8F8F2] border-[#A8E6CF] ring-2 ring-[#4FA88E]/30'
                        : 'bg-[#FCFBF9] border-[#EDE4DA] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#1E293B] shadow-xs"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1E293B]">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-[#64748B]">
                          {p.age} anos • {p.diagnosis}
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
            <div className="p-6 text-center text-xs text-[#64748B] bg-[#FCFBF9] rounded-2xl border border-dashed border-[#EDE4DA]">
              <Users className="w-6 h-6 text-[#CBD5E1] mx-auto mb-1.5" />
              <p className="font-semibold text-[#1E293B]">Nenhum paciente cadastrado.</p>
              <p className="text-[11px] mt-1">Clique acima para cadastrar.</p>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Detailed Clinical Dossier */}
        {currentPatient ? (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE4DA] shadow-xs space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EDE4DA]">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black text-[#1E293B] shadow-sm"
                  style={{ backgroundColor: currentPatient.avatarColor }}
                >
                  {currentPatient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#1E293B]">
                    {currentPatient.name}
                  </h2>
                  <p className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                    <span>{currentPatient.age} anos ({currentPatient.birthDate})</span>
                    <span>•</span>
                    <strong className="text-[#3E8EBF]">{currentPatient.diagnosis}</strong>
                    <span>(CID {currentPatient.cid})</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  audio.playSoftTap();
                  onStartSessionWithPatient(currentPatient.id);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:opacity-95 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Iniciar Jogos com {currentPatient.name.split(' ')[0]}</span>
              </button>
            </div>

            {/* Sub-tabs: Prontuário, Perfil Sensorial, Histórico */}
            <div className="flex items-center gap-2 border-b border-[#EDE4DA] pb-2">
              {[
                { id: 'profile' as const, label: 'Dados Clínicos & Escola', icon: BookOpen },
                { id: 'sensory' as const, label: 'Perfil Sensorial & Hiperfocos', icon: Brain },
                { id: 'history' as const, label: 'Evolução & Sessões', icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      audio.playSoftTap();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E8F8F2] text-[#2D6A4F] ring-1 ring-[#A8E6CF]'
                        : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F7F3EE]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Dados Clínicos & Escola */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA]">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block">Responsável Legal</span>
                    <span className="font-extrabold text-[#1E293B]">{currentPatient.guardianName}</span>
                    <span className="text-[#64748B] block mt-0.5">{currentPatient.guardianPhone}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA]">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block">Escolaridade & Série</span>
                    <span className="font-extrabold text-[#1E293B]">{currentPatient.schoolGrade}</span>
                    <span className="text-[#64748B] block mt-0.5">Adaptação curricular inclusiva</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F3EE] border border-[#EDE4DA]">
                  <h4 className="text-xs font-extrabold text-[#1E293B] mb-1">
                    Parecer Psicopedagógico Inicial
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {currentPatient.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Perfil Sensorial & Hiperfocos (Especializado em TEA) */}
            {activeTab === 'sensory' && (
              <div className="space-y-4">
                {/* Sensory Sensitivities */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Sensibilidade Auditiva', value: currentPatient.sensoryProfile.auditorySensitivity, note: 'Preferência por volume baixo' },
                    { label: 'Sensibilidade Visual', value: currentPatient.sensoryProfile.visualSensitivity, note: 'Tons pastéis tranquilizantes' },
                    { label: 'Sensibilidade Tátil', value: currentPatient.sensoryProfile.tactileSensitivity, note: 'Acomodação gradual de texturas' },
                  ].map((sens, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA] text-center">
                      <span className="text-[10px] font-bold uppercase text-[#64748B] block">{sens.label}</span>
                      <span className={`inline-block text-xs font-extrabold px-2.5 py-0.5 rounded-full mt-1 mb-1 ${
                        sens.value === 'alta' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Nível {sens.value.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#64748B] block">{sens.note}</span>
                    </div>
                  ))}
                </div>

                {/* Hyperfocus Interests (Reforçadores Positivos) */}
                <div className="p-4 rounded-2xl bg-[#E8F8F2] border border-[#A8E6CF]">
                  <h4 className="text-xs font-extrabold text-[#2D6A4F] flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Hiperfocos & Interesses Naturais (Reforçadores)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPatient.sensoryProfile.hyperfocusInterests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white text-xs font-bold text-[#1B4332] rounded-xl shadow-xs border border-[#A8E6CF]/60">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gatilhos e Técnicas Calmantes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                    <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">
                      ⚠️ Gatilhos a Evitar
                    </span>
                    <ul className="list-disc list-inside text-rose-900 space-y-1">
                      {currentPatient.sensoryProfile.sensoryTriggers.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block mb-1">
                      🌱 Técnicas de Acalmia & Regulação
                    </span>
                    <ul className="list-disc list-inside text-blue-900 space-y-1">
                      {currentPatient.sensoryProfile.calmingTechniques.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Histórico & Métricas */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                  <span>Total de Atendimentos: {currentPatient.sessionsCount}</span>
                  <span className="text-[#64748B]">Última sessão: {currentPatient.lastSessionDate || 'Nenhuma registrada'}</span>
                </div>
                {currentPatient.sessionsCount > 0 ? (
                  <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA] space-y-2 text-xs">
                    <p className="text-[#475569]">
                      O paciente possui histórico com {currentPatient.sessionsCount} atendimento(s) gravado(s).
                    </p>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-[#FCFBF9] rounded-2xl border border-dashed border-[#EDE4DA] text-xs text-[#64748B]">
                    Ainda não há atendimentos gravados para este paciente. Inicie uma atividade na aba &quot;Jogos&quot; para registrar o histórico evolutivo.
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#EDE4DA] shadow-xs flex flex-col items-center justify-center text-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-[#E8F8F2] flex items-center justify-center text-[#4FA88E] mb-3">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-[#1E293B] mb-1">
              Nenhum Paciente Selecionado
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mb-5 leading-relaxed">
              Cadastre seus pacientes para registrar diagnósticos, hiperfocos, sensibilidades sensoriais e acompanhar as evoluções clínicas.
            </p>
            <button
              onClick={() => {
                audio.playSoftTap();
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#4FA88E] hover:bg-[#3d8c75] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Primeiro Paciente</span>
            </button>
          </div>
        )}

      </div>

      {/* New Patient Modal */}
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
              Novo Cadastro de Paciente
            </h2>
            <p className="text-xs text-[#64748B] mb-5">
              Insira os dados clínicos e características neurocognitivas do paciente.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Nome Completo da Criança</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Henrique Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5] outline-none focus:ring-2 focus:ring-[#A8E6CF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Idade</label>
                  <input
                    type="number"
                    min="2"
                    max="18"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Hipótese / Diagnóstico</label>
                  <select
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  >
                    <option value="Transtorno do Espectro Autista (TEA Nível 1)">TEA Nível 1</option>
                    <option value="Transtorno do Espectro Autista (TEA Nível 2)">TEA Nível 2</option>
                    <option value="Transtorno do Espectro Autista (TEA Nível 3)">TEA Nível 3</option>
                    <option value="TDAH Tipo Desatento ou Misto">TDAH</option>
                    <option value="Atraso Global do Desenvolvimento">Atraso Global</option>
                    <option value="Deficiência Intelectual Leve">Deficiência Intelectual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Nome do Responsável</label>
                  <input
                    type="text"
                    required
                    placeholder="Mãe / Pai / Cuidador"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Telefone de Contato</label>
                  <input
                    type="text"
                    placeholder="(11) 90000-0000"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Hiperfocos / Interesses de Atenção</label>
                <input
                  type="text"
                  placeholder="Ex: Trens, Dinossauros, Planetas, Cores"
                  value={formData.hyperfocus}
                  onChange={(e) => setFormData({ ...formData, hyperfocus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE4DA] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Gatilhos Sensoriais Conhecidos</label>
                <input
                  type="text"
                  placeholder="Ex: Sons agudos repentinos, luz muito forte"
                  value={formData.triggers}
                  onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
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
                  Salvar Paciente no Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
