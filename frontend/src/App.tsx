import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { BackgroundDoodles } from './components/BackgroundDoodles.tsx';
import { SensoryBreakModal } from './components/SensoryBreakModal.tsx';
import { Rodape } from './components/Rodape.tsx';
import { audio } from './components/AudioService.ts';

import { LandingPageView } from './views/LandingPageView.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { PatientsView } from './views/PatientsView.tsx';
import { GamesCatalogView } from './views/GamesCatalogView.tsx';
import { SessionsView } from './views/SessionsView.tsx';
import { CalendarView } from './views/CalendarView.tsx';
import { ReportsView } from './views/ReportsView.tsx';

import { useAuthStatus } from './utils/useAuthStatus.ts';
import { DataService } from '@backend/db.ts';
import { Patient, Appointment, GameMetricRecord, SessionRecord } from '@backend/types.ts';

export default function App() {
  const { isAutenticado, isConfigurado } = useAuthStatus();

  // Controle de modo de visualização: 'apresentacao' (Landing Page pública) ou 'clinico' (Painel do Terapeuta)
  const [modoVisualizacao, setModoVisualizacao] = useState<'apresentacao' | 'clinico'>(
    isAutenticado ? 'clinico' : 'apresentacao'
  );

  // Sincroniza o modo de visualização caso o status de autenticação mude
  useEffect(() => {
    if (isAutenticado) {
      setModoVisualizacao('clinico');
    } else {
      setModoVisualizacao('apresentacao');
    }
  }, [isAutenticado]);

  const [abaAtiva, setAbaAtiva] = useState<ActiveTab>('dashboard');
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState<string>('');
  const [agendamentos, setAgendamentos] = useState<Appointment[]>([]);
  const [metricasJogos, setMetricasJogos] = useState<GameMetricRecord[]>([]);
  const [sessoesClinicas, setSessoesClinicas] = useState<SessionRecord[]>([]);

  const [isModalSensorialAberta, setIsModalSensorialAberta] = useState(false);
  const [isSomSilenciado, setIsSomSilenciado] = useState(false);
  const [jogoAlvoParaAbrir, setJogoAlvoParaAbrir] = useState<string | null>(null);

  // Carrega os dados clínicos iniciais do repositório
  useEffect(() => {
    const pacientesCarregados = DataService.getPatients();
    setPacientes(pacientesCarregados);
    if (pacientesCarregados.length > 0) {
      setPacienteSelecionadoId(pacientesCarregados[0].id);
    }
    setAgendamentos(DataService.getAppointments());
    setMetricasJogos(DataService.getMetrics());
    setSessoesClinicas(DataService.getSessions());
  }, []);

  const executarAlternarSom = () => {
    const proximoEstado = !isSomSilenciado;
    setIsSomSilenciado(proximoEstado);
    audio.setSoundEnabled(!proximoEstado);
    if (!proximoEstado) {
      audio.playSoftTap();
    }
  };

  const executarAdicionarPaciente = (
    dadosNovoPaciente: Omit<Patient, 'id' | 'createdAt' | 'sessionsCount' | 'lastSessionDate'>
  ) => {
    const novoPaciente: Patient = {
      ...dadosNovoPaciente,
      id: `paciente-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      sessionsCount: 0,
      lastSessionDate: 'Sem sessões registradas',
    };
    DataService.savePatient(novoPaciente);
    const listaAtualizada = DataService.getPatients();
    setPacientes(listaAtualizada);
    setPacienteSelecionadoId(novoPaciente.id);
  };

  const executarAdicionarAgendamento = (dadosNovoAgendamento: Omit<Appointment, 'id'>) => {
    const novoAgendamento: Appointment = {
      ...dadosNovoAgendamento,
      id: `agendamento-${Date.now()}`,
    };
    DataService.saveAppointment(novoAgendamento);
    setAgendamentos(DataService.getAppointments());
  };

  const executarSalvarMetricaJogo = (metrica: GameMetricRecord) => {
    DataService.recordGameMetric(metrica);
    setMetricasJogos(DataService.getMetrics());
    setPacientes(DataService.getPatients());
  };

  const executarSalvarSessao = (sessao: SessionRecord) => {
    DataService.saveSession(sessao);
    setSessoesClinicas(DataService.getSessions());
  };

  const executarIniciarSessaoComPaciente = (pacienteId: string, jogoId?: string) => {
    setPacienteSelecionadoId(pacienteId);
    setJogoAlvoParaAbrir(jogoId || null);
    setModoVisualizacao('clinico');
    setAbaAtiva('games');
  };

  const pacienteAtual = pacientes.find((p) => p.id === pacienteSelecionadoId) || pacientes[0];

  const pacientePadraoLivre: Patient = {
    id: 'paciente-modo-livre',
    name: 'Atendimento Livre',
    age: 7,
    birthDate: '',
    diagnosis: 'Treino / Modo Livre',
    cid: 'F00',
    guardianName: '',
    guardianPhone: '',
    schoolGrade: '',
    avatarColor: '#A8E6CF',
    sensoryProfile: {
      auditorySensitivity: 'baixa',
      visualSensitivity: 'baixa',
      tactileSensitivity: 'baixa',
      hyperfocusInterests: ['Jogos Adaptados'],
      sensoryTriggers: [],
      calmingTechniques: ['Pausa Sensorial'],
    },
    notes: 'Modo de teste ou atendimento livre sem paciente vinculado.',
    createdAt: '',
    sessionsCount: 0,
    lastSessionDate: '',
  };

  const pacienteAtivoFinal = pacienteAtual || pacientePadraoLivre;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3748] relative flex flex-col font-sans selection:bg-[#B7E4C7] selection:text-[#1B4332]">
      
      {/* Elementos visuais educativos de fundo */}
      <BackgroundDoodles />

      {/* Barra de Navegação Superior Adaptável */}
      <Navbar
        isAutenticado={isAutenticado}
        modoVisualizacao={modoVisualizacao}
        onAlternarModoVisualizacao={(novoModo) => setModoVisualizacao(novoModo)}
        activeTab={abaAtiva}
        onSelectTab={(novaAba) => {
          setAbaAtiva(novaAba);
          setJogoAlvoParaAbrir(null);
        }}
        patients={pacientes}
        selectedPatientId={pacienteSelecionadoId}
        onSelectPatient={(id) => setPacienteSelecionadoId(id)}
        onTriggerSensoryBreak={() => setIsModalSensorialAberta(true)}
        isSoundMuted={isSomSilenciado}
        onToggleSound={executarAlternarSom}
      />

      {/* Conteúdo Principal: Página Inicial Pública ou Painel do Terapeuta */}
      {modoVisualizacao === 'apresentacao' ? (
        /* Página Inicial com Introdução da Plataforma, Apresentação dos Jogos e Funcionalidades */
        <main className="flex-1 w-full relative z-10">
          <LandingPageView
            onAcessarAreaTerapeuta={() => {
              setModoVisualizacao('clinico');
              setAbaAtiva('dashboard');
            }}
            isAutenticado={isAutenticado}
          />
        </main>
      ) : (
        /* Painel Clínico do Terapeuta (Acesso exclusivo com abas de trabalho) */
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
          
          {abaAtiva === 'dashboard' && (
            <DashboardView
              patients={pacientes}
              selectedPatientId={pacienteSelecionadoId}
              onSelectPatient={(id) => setPacienteSelecionadoId(id)}
              appointments={agendamentos}
              recentMetrics={metricasJogos}
              recentSessions={sessoesClinicas}
              onNavigateToGames={(jogoId) => {
                setJogoAlvoParaAbrir(jogoId || null);
                setAbaAtiva('games');
              }}
              onNavigateToPatients={(id) => {
                if (id) setPacienteSelecionadoId(id);
                setAbaAtiva('patients');
              }}
              onNavigateToCalendar={() => setAbaAtiva('calendar')}
              onNavigateToReports={() => setAbaAtiva('reports')}
            />
          )}

          {abaAtiva === 'patients' && (
            <PatientsView
              patients={pacientes}
              selectedPatientId={pacienteSelecionadoId}
              onSelectPatient={(id) => setPacienteSelecionadoId(id)}
              onAddPatient={executarAdicionarPaciente}
              onStartSessionWithPatient={(id) => executarIniciarSessaoComPaciente(id)}
            />
          )}

          {abaAtiva === 'games' && (
            <GamesCatalogView
              key={`jogos-view-${pacienteAtivoFinal.id}-${jogoAlvoParaAbrir || 'todos'}`}
              patient={pacienteAtivoFinal}
              initialGameId={jogoAlvoParaAbrir}
              onSaveGameMetric={executarSalvarMetricaJogo}
            />
          )}

          {abaAtiva === 'sessions' && (
            <SessionsView
              sessions={sessoesClinicas}
              patients={pacientes}
              onSaveSession={executarSalvarSessao}
            />
          )}

          {abaAtiva === 'calendar' && (
            <CalendarView
              appointments={agendamentos}
              patients={pacientes}
              onAddAppointment={executarAdicionarAgendamento}
              onStartSession={(pacienteId) => executarIniciarSessaoComPaciente(pacienteId)}
            />
          )}

          {abaAtiva === 'reports' && (
            <ReportsView
              patients={pacientes}
              selectedPatientId={pacienteSelecionadoId}
              onSelectPatient={(id) => setPacienteSelecionadoId(id)}
              metrics={metricasJogos}
            />
          )}

        </main>
      )}

      {/* Modal de Emergência para Pausa Sensorial e Descompressão */}
      <SensoryBreakModal
        isOpen={isModalSensorialAberta}
        onClose={() => setIsModalSensorialAberta(false)}
      />

      {/* Rodapé Oficial da Plataforma com Direitos Autorais e Contato do Desenvolvedor */}
      <Rodape />

    </div>
  );
}
