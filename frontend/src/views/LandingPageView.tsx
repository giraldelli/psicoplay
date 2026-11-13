import React from 'react';
import {
  Gamepad2,
  HeartHandshake,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Eye,
  Box,
  Touchpad,
  Palette,
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  Smile,
  Shield,
  Activity,
  UserCheck,
  LogIn,
  Heart,
} from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';
import { isClerkConfigured } from '../utils/clerkConfig.ts';
import { audio } from '../components/AudioService.ts';

interface LandingPageViewProps {
  onAcessarAreaTerapeuta: (categoriaJogoId?: string) => void;
  isAutenticado: boolean;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onAcessarAreaTerapeuta,
  isAutenticado,
}) => {
  const clerkAtivo = isClerkConfigured();

  const jogosTerapeuticos = [
    {
      id: 'color-shape',
      titulo: 'Pareamento por Cor ou Forma',
      categoria: 'Pareamento e Classificação',
      selo: 'Organização do Pensamento',
      corSelo: 'bg-[#E8F8F2] text-[#2D6A4F] border-[#A8E6CF]',
      icone: Layers,
      comoFunciona:
        'A criança separa blocos nas caixas correspondentes. Ao iniciar, o terapeuta escolhe entre classificar por cores, formas, tamanhos ou desafio combinado.',
      paraQueServe:
        'Estimula a categorização mental, a percepção de semelhanças e diferenças e a flexibilidade cognitiva, sem gerar sobrecarga sensorial.',
      habilidades: ['Discriminação Visual', 'Atenção Seletiva', 'Raciocínio Lógico'],
      resumoConteudos: '4 modos no jogo',
    },
    {
      id: 'real-objects',
      titulo: 'Associação de Figuras Reais',
      categoria: 'Generalização do Cotidiano',
      selo: 'Rotina e Autonomia',
      corSelo: 'bg-[#D4ECF9] text-[#1E3A8A] border-[#A0D2EB]',
      icone: Eye,
      comoFunciona:
        'Combina objetos do mundo real ao seu contexto de uso diário, com seleção de tema ao iniciar (Alimentação, Higiene, Vestuário ou Escola).',
      paraQueServe:
        'Apoia a comunicação funcional, a expansão de vocabulário ativo e a aplicação prática de conceitos na rotina da criança.',
      habilidades: ['Comunicação Funcional', 'Vocabulário Ativo', 'Autonomia Prática'],
      resumoConteudos: '4 temas de rotina',
    },
    {
      id: 'wooden-puzzle',
      titulo: 'Quebra-cabeças de Encaixe Único',
      categoria: 'Encaixe e Percepção',
      selo: 'Coordenação Óculo-Manual',
      corSelo: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      icone: Box,
      comoFunciona:
        'Tabuleiro de madeira maciça com pinos de pegada, onde é possível escolher o tema ao iniciar (Animais & Veículos, Fazenda, Frutas ou Instrumentos).',
      paraQueServe:
        'Promove a coordenação óculo-manual, o movimento de pinça visualizado, percepção de contornos e fechamento gestáltico.',
      habilidades: ['Controle Motor Fino', 'Noção Espacial', 'Fechamento Visual'],
      resumoConteudos: '4 tabuleiros no jogo',
    },
    {
      id: 'balloons',
      titulo: 'Jogos de Toque Direto',
      categoria: 'Causa e Efeito Adaptada',
      selo: 'Previsibilidade & TEA',
      corSelo: 'bg-[#EDE7F6] text-[#5E35B1] border-[#D1C4E9]',
      icone: Touchpad,
      comoFunciona:
        'Jogo de resposta imediata ao toque, permitindo escolher o cenário ao iniciar: Balões Pastéis, Bolhas no Mar, Nuvens Mágicas ou Jardim de Flores.',
      paraQueServe:
        'Desenvolve a compreensão de causa e efeito elementar, rastreamento visual e regulação emocional positiva, sem sons estridentes ou sustos.',
      habilidades: ['Causa e Efeito', 'Rastreamento Ocular', 'Regulação Emocional'],
      resumoConteudos: '4 cenários no jogo',
    },
    {
      id: 'digital-coloring',
      titulo: 'Jogos de Colorir Digital',
      categoria: 'Expressão e Relaxamento',
      selo: 'Preenchimento Automático',
      corSelo: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]',
      icone: Palette,
      comoFunciona:
        'Pintura mágica por toque sem risco de borrar. Ao iniciar o jogo, escolha entre Dinossauro, Borboleta, Viagem Espacial ou Casinha Feliz.',
      paraQueServe:
        'Proporciona relaxamento sensorial, foco atencional e sensação de agência criativa, eliminando a frustração da coordenação motora fina incompleta.',
      habilidades: ['Autorregulação Sensorial', 'Foco Atencional', 'Autoestima Criativa'],
      resumoConteudos: '4 desenhos no jogo',
    },
    {
      id: 'three-blocks',
      titulo: 'Oficina Sensorial 3D',
      categoria: 'Renderização Espacial 3D (Three.js)',
      selo: 'Timing Motor & Espacialidade',
      corSelo: 'bg-[#F7F3EE] text-[#6D4C41] border-[#EDE4DA]',
      icone: Brain,
      comoFunciona:
        'Página dedicada ao jogo do guindaste 3D, onde ao iniciar é possível escolher qual tipo de bloco construir (Prédio, Árvore, Castelo ou Doces).',
      paraQueServe:
        'Treina o planejamento motor, percepção de profundidade tridimensional, noções de equilíbrio e tolerância à frustração com feedback acolhedor.',
      habilidades: ['Timing Motor', 'Percepção de Profundidade 3D', 'Foco Atencional'],
      resumoConteudos: '4 temas de blocos no guindaste',
    },
  ];

  const recursosClinicos = [
    {
      titulo: 'Prontuário & Perfil Sensorial',
      descricao:
        'Mapeamento completo das sensibilidades da criança (auditiva, visual e tátil), histórico clínico, hiperfocos e técnicas de descompressão.',
      icone: UserCheck,
    },
    {
      titulo: 'Monitoramento ao Vivo (Therapist HUD)',
      descricao:
        'Acompanhe reações em tempo real durante os jogos, registrando nível de autonomia (independente, dica verbal, apoio) e estado sensorial.',
      icone: Activity,
    },
    {
      titulo: 'Acolhimento & Adaptação Neurodivergente',
      descricao:
        'Ambiente planejado com respeito ao ritmo da criança, eliminação de frustrações e foco em reforço positivo contínuo.',
      icone: HeartHandshake,
    },
    {
      titulo: 'Gestão de Sessões & Calendário',
      descricao:
        'Histórico das consultas, registro dos jogos aplicados, recomendações para a família e controle integrado da agenda do consultório.',
      icone: CalendarDays,
    },
  ];

  const executarAcaoAcesso = () => {
    audio.playSoftTap();
    onAcessarAreaTerapeuta();
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#2C3E50]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Título Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] tracking-tight leading-[1.15]">
              Acolhimento, ciência e afeto no{' '}
              <span className="text-[#2D6A4F]">
                desenvolvimento neurodivergente
              </span>
            </h1>

            {/* Descrição de Introdução */}
            <p className="text-lg sm:text-xl text-[#475569] leading-relaxed max-w-[65ch] mx-auto">
              O <strong>PsicoPlay</strong> é um ecossistema desenhado para profissionais da saúde e educação. Combinamos <strong>jogos digitais sensorialmente adaptados</strong> a um <strong>prontuário com perfil sensorial</strong> para acompanhar a evolução de crianças com TEA, TDAH e dificuldades de aprendizagem.
            </p>

            {/* CTAs Principais */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {clerkAtivo ? (
                isAutenticado ? (
                  <button
                    onClick={executarAcaoAcesso}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#3E8EBF] hover:bg-[#2C6E96] text-white font-bold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Entrar no Painel do Terapeuta</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#3E8EBF] hover:bg-[#2C6E96] text-white font-bold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Acessar Área do Terapeuta</span>
                    </button>
                  </SignInButton>
                )
              ) : (
                <button
                  onClick={executarAcaoAcesso}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#3E8EBF] hover:bg-[#2C6E96] text-white font-bold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Explorar Área do Terapeuta</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <a
                href="#jogos"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-[#F7F3EE] text-[#475569] font-bold text-base border border-[#EDE4DA] shadow-xs transition-all"
              >
                <Gamepad2 className="w-5 h-5 text-[#3E8EBF]" />
                <span>Ver Jogos Disponíveis</span>
              </a>
            </div>

            {/* Garantias de Acessibilidade Sensorial */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4FA88E]" /> Interface 100% silenciosa
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4FA88E]" /> Paleta de cores calmante
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4FA88E]" /> Baixa carga cognitiva
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4FA88E]" /> Respeito ao ritmo da criança
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. O QUE A PLATAFORMA VAI FAZER */}
      <section id="sobre" className="py-20 bg-white border-y border-[#EDE4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
              O que a plataforma faz pelos profissionais da saúde e educação
            </h2>
            <p className="text-base sm:text-lg text-[#475569] max-w-[65ch] mx-auto leading-relaxed">
              Centralize toda a rotina de intervenção e acompanhamento em uma única interface acolhedora, segura e cientificamente embasada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recursosClinicos.map((recurso, index) => {
              const Icone = recurso.icone;
              return (
                <div
                  key={index}
                  className="bg-[#FAF8F5] border border-[#EDE4DA] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#EDE4DA] flex items-center justify-center text-[#3E8EBF] shadow-xs group-hover:scale-105 transition-transform">
                      <Icone className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E293B]">
                      {recurso.titulo}
                    </h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      {recurso.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. QUAIS JOGOS ESTARÃO DISPONÍVEIS E PARA QUE SERVEM */}
      <section id="jogos" className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
              Quais jogos estarão na página do terapeuta
            </h2>
            <p className="text-base sm:text-lg text-[#475569] max-w-[65ch] mx-auto leading-relaxed">
              Todos os jogos foram desenvolvidos seguindo diretrizes de baixa aversão sensorial para TEA. Na página do terapeuta, cada jogo roda conectado ao painel clínico de avaliação em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jogosTerapeuticos.map((jogo) => {
              const IconeJogo = jogo.icone;
              return (
                <div
                  key={jogo.id}
                  className="bg-white border border-[#EDE4DA] rounded-3xl p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-5">
                    
                    {/* Topo do Card com Ícone e Selo */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-[#F7F3EE] border border-[#EDE4DA] flex items-center justify-center text-[#3E8EBF] group-hover:scale-105 transition-transform">
                        <IconeJogo className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${jogo.corSelo}`}>
                        {jogo.selo}
                      </span>
                    </div>

                    {/* Título & Categoria */}
                    <div>
                      <span className="text-xs font-semibold text-[#94A3B8] block mb-1">
                        {jogo.categoria}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#1E293B] group-hover:text-[#3E8EBF] transition-colors">
                        {jogo.titulo}
                      </h3>
                    </div>

                    {/* Como Funciona */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                        Como funciona:
                      </span>
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {jogo.comoFunciona}
                      </p>
                    </div>

                    {/* Para que serve (Objetivo Clínico) */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE4DA]/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D6A4F]">
                        <Heart className="w-3.5 h-3.5 text-[#4FA88E]" />
                        <span>Para que serve:</span>
                      </div>
                      <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">
                        {jogo.paraQueServe}
                      </p>
                    </div>

                    {/* Habilidades Desenvolvidas */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Habilidades trabalhadas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jogo.habilidades.map((habilidade, hIndex) => (
                          <span
                            key={hIndex}
                            className="text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] px-2.5 py-0.5 rounded-lg"
                          >
                            {habilidade}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Rodapé do Card */}
                  <div className="pt-6 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <button
                      onClick={() => {
                        audio.playSoftTap();
                        onAcessarAreaTerapeuta(jogo.id);
                      }}
                      className="font-bold text-[#3E8EBF] hover:text-[#2C6E96] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Abrir página {jogo.titulo}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-[#94A3B8]">{jogo.resumoConteudos}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. SEÇÃO: COMO FUNCIONA A ÁREA DO TERAPEUTA */}
      <section id="area-terapeuta" className="py-20 bg-white border-t border-[#EDE4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#E8F8F2] via-[#F0F7FF] to-[#FAF8F5] border border-[#A8E6CF] rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-5">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
                  O que acontece após o login?
                </h2>
                <p className="text-base text-[#475569] leading-relaxed">
                  Assim que você realiza o login como terapeuta, o menu superior clínico é liberado com acesso a todas as abas de trabalho:
                </p>
                
                <ul className="space-y-3 text-sm text-[#334155]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3E8EBF] mt-0.5 shrink-0" />
                    <span><strong>Dashboard Clínico:</strong> Visão geral de métricas, pacientes do dia e indicadores de evolução.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3E8EBF] mt-0.5 shrink-0" />
                    <span><strong>Prontuário de Pacientes:</strong> Cadastro completo com perfil sensorial detalhado e anotações clínicas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3E8EBF] mt-0.5 shrink-0" />
                    <span><strong>Catálogo Interativo dos 6 Jogos:</strong> Execute as atividades com a criança enquanto o Therapist HUD registra dados em tempo real.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3E8EBF] mt-0.5 shrink-0" />
                    <span><strong>Histórico de Sessões & Calendário:</strong> Planeje atendimentos, registre condutas e emita relatórios estruturados.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  {clerkAtivo ? (
                    isAutenticado ? (
                      <button
                        onClick={executarAcaoAcesso}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#3E8EBF] hover:bg-[#2C6E96] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <span>Acessar Painel Clínico</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <SignInButton mode="modal">
                        <button
                          type="button"
                          className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#3E8EBF] hover:bg-[#2C6E96] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Fazer Login / Cadastrar Terapeuta</span>
                        </button>
                      </SignInButton>
                    )
                  ) : (
                    <button
                      onClick={executarAcaoAcesso}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#3E8EBF] hover:bg-[#2C6E96] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>Abrir Painel Clínico</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Ilustrativo de Apoio */}
              <div className="bg-white/80 backdrop-blur-xs border border-[#EDE4DA] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#EDE4DA]">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F8F2] flex items-center justify-center text-[#2D6A4F]">
                    <Shield className="w-5 h-5 text-[#4FA88E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B] text-base">Privacidade & Proteção de Dados</h3>
                    <p className="text-xs text-[#64748B]">Ambiente protegido por autenticação individual</p>
                  </div>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Os prontuários, relatórios e métricas de desempenho dos seus pacientes são confidenciais e protegidos. Cada terapeuta autenticado possui visualização dedicada às suas intervenções e sessões.
                </p>
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE4DA] flex items-center gap-2.5 text-xs text-[#64748B]">
                  <CheckCircle2 className="w-4 h-4 text-[#3E8EBF] shrink-0" />
                  <span>Suporte a crianças verbais e não verbais com estímulos personalizados.</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
