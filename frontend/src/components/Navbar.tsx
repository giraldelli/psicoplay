import React from 'react';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  ClipboardList,
  CalendarDays,
  BarChart3,
  Sparkles,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { Patient } from '@backend/types.ts';
import { ClerkAuthStatus } from './ClerkAuthStatus.tsx';
import { isClerkConfigured } from '../utils/clerkConfig.ts';

export type ActiveTab = 'dashboard' | 'patients' | 'games' | 'sessions' | 'calendar' | 'reports';

interface NavbarProps {
  isAutenticado: boolean;
  modoVisualizacao: 'apresentacao' | 'clinico';
  onAlternarModoVisualizacao: (modo: 'apresentacao' | 'clinico') => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAutenticado,
  modoVisualizacao,
  onAlternarModoVisualizacao,
  activeTab,
  onSelectTab,
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const abasClinicas: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'games', label: 'Jogos Terapêuticos', icon: Gamepad2 },
    { id: 'sessions', label: 'Sessões', icon: ClipboardList },
    { id: 'calendar', label: 'Calendário', icon: CalendarDays },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const executarCliqueLogo = () => {
    if (isAutenticado) {
      onAlternarModoVisualizacao('clinico');
      onSelectTab('dashboard');
    } else {
      onAlternarModoVisualizacao('apresentacao');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const exibirMenuClinico = isAutenticado && modoVisualizacao === 'clinico';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EDE4DA] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Marca Clínica */}
          <div
            onClick={executarCliqueLogo}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="PsicoPlay"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A8E6CF] via-[#A0D2EB] to-[#D1C4E9] p-0.5 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-[#4FA88E]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#1E293B]">
                  Psico<span className="text-[#3E8EBF]">Play</span>
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F8F2] text-[#2D6A4F]">
                  <Sparkles className="w-3 h-3 text-[#4FA88E]" /> Clínica
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium hidden sm:block">
                Psicopedagogia & Jogos Terapêuticos
              </p>
            </div>
          </div>

          {/* Navegação Central: Depende se está no Painel Clínico ou na Página Inicial */}
          {exibirMenuClinico ? (
            /* Menu das 6 Abas Clínicas - Disponível apenas após o login do terapeuta */
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Navegação Clínica do Terapeuta">
              {abasClinicas.map((aba) => {
                const Icone = aba.icon;
                const estaAtiva = activeTab === aba.id;
                return (
                  <button
                    key={aba.id}
                    onClick={() => {
                      onSelectTab(aba.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs lg:text-sm transition-all duration-200 cursor-pointer ${
                      estaAtiva
                        ? 'bg-[#E8F8F2] text-[#1B4332] shadow-xs ring-1 ring-[#A8E6CF]/60'
                        : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F7F3EE]'
                    }`}
                    aria-current={estaAtiva ? 'page' : undefined}
                  >
                    <Icone className={`w-4 h-4 ${estaAtiva ? 'text-[#3E8EBF]' : 'text-[#64748B]'}`} />
                    <span>{aba.label}</span>
                  </button>
                );
              })}
            </nav>
          ) : (
            /* Menu Institucional da Página Inicial (Apresentação dos Jogos e Plataforma) */
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#475569]" aria-label="Navegação Institucional">
              <a href="#sobre" className="hover:text-[#3E8EBF] transition-colors">
                Sobre a Plataforma
              </a>
              <a href="#jogos" className="hover:text-[#3E8EBF] transition-colors">
                Jogos Terapêuticos
              </a>
              <a href="#area-terapeuta" className="hover:text-[#3E8EBF] transition-colors">
                Área do Terapeuta
              </a>
              {isAutenticado && (
                <button
                  onClick={() => {
                    onAlternarModoVisualizacao('clinico');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E8F8F2] text-[#2D6A4F] border border-[#A8E6CF] cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Voltar ao Painel Clínico</span>
                </button>
              )}
            </nav>
          )}

          {/* Controles do Lado Direito */}
          <div className="flex items-center gap-2.5">
            
            {/* Se estiver no Painel Clínico: Mostra Seletor de Paciente e Pausa Sensorial */}
            {exibirMenuClinico && (
              <>
                {/* Botão de Alternar para Página de Apresentação */}
                <button
                  onClick={() => {
                    onAlternarModoVisualizacao('apresentacao');
                  }}
                  title="Ver página de apresentação pública"
                  className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F7F3EE] transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-[#3E8EBF]" />
                  <span>Apresentação</span>
                </button>

                {/* Seletor de Paciente Ativo */}
                <div className="hidden sm:flex items-center gap-2 bg-[#F7F3EE] hover:bg-[#EFEAE2] border border-[#EDE4DA] rounded-2xl px-3 py-1.5 transition-colors">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedPatient?.avatarColor || '#CBD5E1' }}
                    title="Cor de identificação visual"
                  />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-[#64748B] tracking-wider leading-none">
                      Paciente Ativo
                    </span>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          onSelectTab('patients');
                        } else {
                          onSelectPatient(e.target.value);
                        }
                      }}
                      className="text-xs font-bold text-[#1E293B] bg-transparent border-none focus:ring-0 p-0 cursor-pointer outline-none"
                      aria-label="Selecionar Paciente Ativo"
                    >
                      {patients.length > 0 ? (
                        patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name.split(' ')[0]} ({p.age}a)
                          </option>
                        ))
                      ) : (
                        <option value="">Nenhum cadastrado</option>
                      )}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Perfil e Login do Clerk */}
            <ClerkAuthStatus isConfigured={isClerkConfigured()} />

          </div>
        </div>

        {/* Menu Inferior Mobile: Apenas se estiver autenticado no Painel Clínico */}
        {exibirMenuClinico && (
          <div className="flex md:hidden items-center justify-between py-2 border-t border-[#EDE4DA] overflow-x-auto gap-1 text-xs">
            {abasClinicas.map((aba) => {
              const Icone = aba.icon;
              const estaAtiva = activeTab === aba.id;
              return (
                <button
                  key={aba.id}
                  onClick={() => {
                    onSelectTab(aba.id);
                  }}
                  className={`flex flex-col items-center py-1.5 px-2.5 rounded-lg whitespace-nowrap ${
                    estaAtiva ? 'bg-[#E8F8F2] text-[#1B4332] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <Icone className="w-4 h-4 mb-0.5" />
                  <span>{aba.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
