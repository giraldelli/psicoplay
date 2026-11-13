import React, { useState, useCallback, useEffect } from 'react';
import {
  Layers,
  Touchpad,
  Box,
  Eye,
  Play,
  ArrowLeft,
  ArrowRight,
  Heart,
  Palette,
} from 'lucide-react';
import { Patient, GameMetricRecord } from '@backend/types.ts';
import { TherapistHUD } from '../components/TherapistHUD.tsx';
import { ColorShapeMatchingGame } from '../games/ColorShapeMatchingGame.tsx';
import { RealObjectAssociationGame } from '../games/RealObjectAssociationGame.tsx';
import { WoodenPegPuzzleGame } from '../games/WoodenPegPuzzleGame.tsx';
import { DirectTouchBalloonsGame } from '../games/DirectTouchBalloonsGame.tsx';
import { DigitalColoringGame } from '../games/DigitalColoringGame.tsx';
import { ThreeTactileBlocksGame } from '../games/ThreeTactileBlocksGame.tsx';
import { audio } from '../components/AudioService.ts';

export type GameCategoryId =
  | 'color-shape'
  | 'real-objects'
  | 'wooden-puzzle'
  | 'balloons'
  | 'digital-coloring'
  | 'three-blocks';

export type GameIdentifier = GameCategoryId;

type GameComponentKey =
  | 'three-blocks'
  | 'color-shape'
  | 'real-objects'
  | 'wooden-puzzle'
  | 'balloons'
  | 'digital-coloring';

interface SubGameItem {
  id: string;
  componentKey: GameComponentKey;
  title: string;
  subtitle: string;
  description: string;
  clinicalGoal: string;
  skills: string[];
  conteudosInternos: string[];
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GameCategoryPageConfig {
  id: GameCategoryId;
  pageTitle: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  clinicalSummary: string;
  badgeColor: string;
  accentBg: string;
  icon: React.ComponentType<{ className?: string }>;
  games: SubGameItem[];
}

const PAGINAS_DE_JOGOS: GameCategoryPageConfig[] = [
  {
    id: 'three-blocks',
    pageTitle: 'Oficina Sensorial 3D',
    shortTitle: 'Oficina Sensorial 3D',
    subtitle: 'Jogo Tridimensional de Empilhamento, Equilíbrio e Noção Espacial',
    description:
      'Ambiente tridimensional interativo com física suave. A criança observa o movimento pendular do guindaste e toca na tela no momento certo para empilhar blocos temáticos em 3D.',
    clinicalSummary: 'Coordenação visuomotora, percepção de profundidade 3D, controle inibitório e atenção sustentada.',
    badgeColor: 'bg-[#F7F3EE] text-[#6D4C41] border-[#EDE4DA]',
    accentBg: 'from-[#F7F3EE] to-white',
    icon: Box,
    games: [
      {
        id: 'three-blocks-guindaste',
        componentKey: 'three-blocks',
        title: 'Torre Tridimensional com Guindaste',
        subtitle: 'Empilhamento 3D com Seleção de Blocos',
        description:
          'Observe o movimento pendular do guindaste 3D e toque na tela no momento certo para empilhar os blocos. Ao iniciar o jogo, escolha qual tema de bloco construir.',
        clinicalGoal: 'Estimular planejamento motor, alinhamento visual em profundidade 3D, controle de impulso e tempo de reação.',
        skills: ['Percepção Espacial 3D', 'Timing Motor', 'Atenção Sustentada'],
        conteudosInternos: ['Prédio Urbano', 'Árvore da Floresta', 'Castelo Real', 'Torre de Doces'],
        badgeColor: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]',
        icon: Box,
      },
    ],
  },
  {
    id: 'color-shape',
    pageTitle: 'Pareamento por Cor ou Forma',
    shortTitle: 'Pareamento por Cor ou Forma',
    subtitle: 'Classificação Visual, Categorização Lógica e Geometria',
    description:
      'Ambiente voltado à organização do pensamento visual. Ao iniciar o jogo, escolha se deseja classificar por cores, formas geométricas, tamanhos ou desafio combinado.',
    clinicalSummary: 'Categorização mental, discriminação visual de cores/formas e flexibilidade cognitiva.',
    badgeColor: 'bg-[#E8F8F2] text-[#2D6A4F] border-[#A8E6CF]',
    accentBg: 'from-[#E8F8F2]/60 to-white',
    icon: Layers,
    games: [
      {
        id: 'color-shape-principal',
        componentKey: 'color-shape',
        title: 'Oficina de Pareamento Visual',
        subtitle: 'Classificação em Caixas Temáticas',
        description:
          'A criança seleciona as peças e as guarda nas caixas correspondentes. Ao iniciar, selecione o critério de pareamento adequado ao objetivo da sessão.',
        clinicalGoal: 'Trabalhar reconhecimento cromático, abstração geométrica, comparação de grandezas e funções executivas.',
        skills: ['Categorização', 'Discriminação Visual', 'Flexibilidade Cognitiva'],
        conteudosInternos: ['Cores Pastel', 'Formas Geométricas', 'Tamanhos', 'Cor + Forma'],
        badgeColor: 'bg-[#E8F8F2] text-[#2D6A4F] border-[#A8E6CF]',
        icon: Layers,
      },
    ],
  },
  {
    id: 'real-objects',
    pageTitle: 'Associação de Figuras Reais',
    shortTitle: 'Associação de Figuras Reais',
    subtitle: 'Generalização do Cotidiano, Comunicação Funcional e Autonomia',
    description:
      'Atividade de conexão entre objetos concretos do dia a dia e seus contextos reais de utilização. Ao iniciar o jogo, selecione o tema de rotina diária.',
    clinicalSummary: 'Expansão de vocabulário prático, compreensão de uso funcional e rotina diária.',
    badgeColor: 'bg-[#D4ECF9] text-[#1E3A8A] border-[#A0D2EB]',
    accentBg: 'from-[#D4ECF9]/50 to-white',
    icon: Eye,
    games: [
      {
        id: 'real-objects-principal',
        componentKey: 'real-objects',
        title: 'Associação Funcional do Cotidiano',
        subtitle: 'Objetos Reais & Situações de Uso',
        description:
          'Relacione objetos familiares às suas funções práticas no dia a dia. Escolha o conjunto temático logo ao abrir a atividade.',
        clinicalGoal: 'Ampliar repertório funcional, vocabulário receptivo e autonomia nas Atividades de Vida Diária (AVDs).',
        skills: ['Associação Funcional', 'Vocabulário Prático', 'Autonomia (AVDs)'],
        conteudosInternos: ['Alimentação & Mesa', 'Higiene & Autocuidado', 'Vestuário & Clima', 'Materiais Escolares'],
        badgeColor: 'bg-[#D4ECF9] text-[#1E3A8A] border-[#A0D2EB]',
        icon: Eye,
      },
    ],
  },
  {
    id: 'wooden-puzzle',
    pageTitle: 'Quebra-cabeças de Encaixe Único',
    shortTitle: 'Quebra-cabeças de Encaixe Único',
    subtitle: 'Tabuleiros de Madeira Maciça com Pino de Pegada e Silhuetas Claras',
    description:
      'Inspirado nos quebra-cabeças físicos de madeira pedagógica com pino. Ao iniciar, escolha qual tabuleiro temático a criança irá montar.',
    clinicalSummary: 'Coordenação óculo-manual, percepção figura-fundo, reconhecimento de contornos e fechamento visual.',
    badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    accentBg: 'from-[#FEF3C7]/50 to-white',
    icon: Box,
    games: [
      {
        id: 'wooden-puzzle-principal',
        componentKey: 'wooden-puzzle',
        title: 'Tabuleiro Pedagógico com Pino',
        subtitle: 'Encaixe de Peças Inteiras em Silhuetas',
        description:
          'Segure cada peça pelo pino de madeira e encaixe na silhueta correspondente. Selecione o tema do tabuleiro ao iniciar.',
        clinicalGoal: 'Desenvolver discriminação de contornos, percepção figura-fundo e precisão motora no encaixe.',
        skills: ['Figura-Fundo', 'Percepção de Silhueta', 'Coordenação Visomotora'],
        conteudosInternos: ['Animais & Veículos', 'Fazenda & Natureza', 'Frutas Saudáveis', 'Sons & Instrumentos'],
        badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
        icon: Box,
      },
    ],
  },
  {
    id: 'balloons',
    pageTitle: 'Jogos de Toque Direto',
    shortTitle: 'Jogos de Toque Direto',
    subtitle: 'Atividades Sensoriais de Causa e Efeito com Alta Previsibilidade',
    description:
      'Jogo de resposta imediata ao toque, sem exigência de arrastar ou precisão fina complexa. Escolha o cenário sensorial logo na tela inicial do jogo.',
    clinicalSummary: 'Causa e efeito imediato, rastreamento ocular dinâmico, atenção compartilhada e regulação emocional.',
    badgeColor: 'bg-[#EDE7F6] text-[#5E35B1] border-[#D1C4E9]',
    accentBg: 'from-[#EDE7F6]/60 to-white',
    icon: Touchpad,
    games: [
      {
        id: 'balloons-principal',
        componentKey: 'balloons',
        title: 'Estouro Suave: Causa e Efeito',
        subtitle: 'Toque Direto com Cenários Selecionáveis',
        description:
          'Elementos flutuam lentamente pela tela e revelam surpresas suaves ao toque, sem ruídos estridentes. Escolha o cenário ao iniciar.',
        clinicalGoal: 'Estabelecer vínculo lúdico, intenção comunicativa, rastreamento visual e regulação sensorial.',
        skills: ['Causa e Efeito', 'Rastreamento Visual', 'Regulação Emocional'],
        conteudosInternos: ['Balões Pastéis', 'Bolhas no Mar', 'Nuvens & Céu', 'Jardim de Flores'],
        badgeColor: 'bg-[#EDE7F6] text-[#5E35B1] border-[#D1C4E9]',
        icon: Touchpad,
      },
    ],
  },
  {
    id: 'digital-coloring',
    pageTitle: 'Jogos de Colorir Digital',
    shortTitle: 'Jogos de Colorir Digital',
    subtitle: 'Pintura Mágica por Toque Automático sem Frustração Motora',
    description:
      'Tela de pintura artística adaptada onde basta um toque em cada região para preenchê-la com cores suaves. Escolha o desenho ao iniciar a atividade.',
    clinicalSummary: 'Expressão criativa, relaxamento sensorial, escolha autônoma de cores e autoestima.',
    badgeColor: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]',
    accentBg: 'from-[#FCE7F3]/50 to-white',
    icon: Palette,
    games: [
      {
        id: 'digital-coloring-principal',
        componentKey: 'digital-coloring',
        title: 'Ateliê de Pintura por Toque',
        subtitle: 'Preenchimento Automático sem Borrar',
        description:
          'Escolha uma cor na paleta pastel e toque nas regiões do desenho para preenchê-las magicamente. Selecione a ilustração na tela inicial.',
        clinicalGoal: 'Estimular expressão criativa, escolha autônoma, percepção parte-todo e relaxamento ativo.',
        skills: ['Expressão Artística', 'Escolha Autônoma', 'Percepção Parte-Todo'],
        conteudosInternos: ['Dinossauro Amigável', 'Borboleta no Jardim', 'Viagem Espacial', 'Casinha & Árvore'],
        badgeColor: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]',
        icon: Palette,
      },
    ],
  },
];

interface GamesCatalogViewProps {
  patient: Patient;
  initialGameId?: string | null;
  onSaveGameMetric: (metric: GameMetricRecord) => void;
}

export const GamesCatalogView: React.FC<GamesCatalogViewProps> = ({
  patient,
  initialGameId,
  onSaveGameMetric,
}) => {
  // Página de categoria ativa (ex.: 'three-blocks' -> Página Oficina Sensorial 3D)
  const [activeCategoryPageId, setActiveCategoryPageId] = useState<GameCategoryId | null>(
    (initialGameId as GameCategoryId) || null
  );

  // Jogo específico sendo jogado dentro da página da categoria
  const [activeSubGame, setActiveSubGame] = useState<SubGameItem | null>(null);
  const [isPatientMode, setIsPatientMode] = useState(false);

  // Contadores ao vivo da sessão
  const [touchesCount, setTouchesCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    if (initialGameId) {
      setActiveCategoryPageId(initialGameId as GameCategoryId);
      setActiveSubGame(null);
    }
  }, [initialGameId]);

  const executarRegistrarToque = useCallback(() => {
    setTouchesCount((anterior) => anterior + 1);
  }, []);

  const executarRegistrarErro = useCallback(() => {
    setMistakesCount((anterior) => anterior + 1);
  }, []);

  const executarAbrirPaginaCategoria = (categoriaId: GameCategoryId) => {
    audio.playSoftTap();
    setActiveCategoryPageId(categoriaId);
    setActiveSubGame(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const executarVoltarParaCatalogoGeral = () => {
    audio.playSoftTap();
    setActiveCategoryPageId(null);
    setActiveSubGame(null);
    setIsPatientMode(false);
  };

  const executarIniciarSubJogo = (subJogo: SubGameItem) => {
    audio.playSoftTap();
    setTouchesCount(0);
    setMistakesCount(0);
    setActiveSubGame(subJogo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const executarFecharSubJogo = () => {
    audio.playSoftTap();
    setActiveSubGame(null);
    setIsPatientMode(false);
  };

  const paginaCategoriaAtual = PAGINAS_DE_JOGOS.find((p) => p.id === activeCategoryPageId) || null;

  // ============================================================================
  // ESTADO 1: JOGO EM EXECUÇÃO (COM BOTÃO DE VOLTAR PARA A PÁGINA DA CATEGORIA)
  // ============================================================================
  if (paginaCategoriaAtual && activeSubGame) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto pb-12 animate-fade-in">
        {/* Barra de Navegação de Retorno para a Página da Categoria */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-[#EDE4DA] shadow-xs">
          <button
            onClick={executarFecharSubJogo}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3E8EBF] hover:text-[#2C6E96] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a página {paginaCategoriaAtual.pageTitle}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1E293B]">{ paginaCategoriaAtual.pageTitle }</span>
            <span>•</span>
            <span className="font-bold text-[#2D6A4F]">{activeSubGame.title}</span>
          </div>
        </div>

        <div className="relative min-h-[600px] w-full flex flex-col lg:flex-row gap-4 bg-white/60 rounded-3xl p-4 sm:p-6 border border-[#EDE4DA] shadow-xs">
          {/* Área Interativa do Jogo */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {activeSubGame.componentKey === 'color-shape' && (
              <ColorShapeMatchingGame
                onTap={executarRegistrarToque}
                onMistake={executarRegistrarErro}
                onComplete={() => audio.playSuccessArpeggio()}
              />
            )}

            {activeSubGame.componentKey === 'real-objects' && (
              <RealObjectAssociationGame
                onTap={executarRegistrarToque}
                onMistake={executarRegistrarErro}
                onComplete={() => audio.playSuccessArpeggio()}
              />
            )}

            {activeSubGame.componentKey === 'wooden-puzzle' && (
              <WoodenPegPuzzleGame
                onTap={executarRegistrarToque}
                onMistake={executarRegistrarErro}
                onComplete={() => audio.playSuccessArpeggio()}
              />
            )}

            {activeSubGame.componentKey === 'balloons' && (
              <DirectTouchBalloonsGame
                onTap={executarRegistrarToque}
                onComplete={() => audio.playSuccessArpeggio()}
              />
            )}

            {activeSubGame.componentKey === 'digital-coloring' && (
              <DigitalColoringGame
                onTap={executarRegistrarToque}
                onComplete={() => audio.playSuccessArpeggio()}
              />
            )}

            {activeSubGame.componentKey === 'three-blocks' && (
              <ThreeTactileBlocksGame
                onTap={executarRegistrarToque}
                onComplete={() => audio.playSuccessArpeggio()}
              />
            )}
          </div>

          {/* Painel Lateral Clínico do Terapeuta */}
          <TherapistHUD
            patient={patient}
            gameId={paginaCategoriaAtual.id}
            gameTitle={`${paginaCategoriaAtual.pageTitle} - ${activeSubGame.title}`}
            touchesCount={touchesCount}
            mistakesCount={mistakesCount}
            isPatientMode={isPatientMode}
            onTogglePatientMode={() => setIsPatientMode(!isPatientMode)}
            onSaveMetric={onSaveGameMetric}
            onCloseGame={executarFecharSubJogo}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // ESTADO 2: PÁGINA DEDICADA DE UM TIPO DE JOGO (EX.: OFICINA SENSORIAL 3D)
  // ============================================================================
  if (paginaCategoriaAtual) {
    const IconePagina = paginaCategoriaAtual.icon;

    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        
        {/* Navegação Superior entre as 6 Páginas de Jogos */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE4DA]">
          <button
            onClick={executarVoltarParaCatalogoGeral}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7F3EE] text-[#1E293B] border border-[#EDE4DA] text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#3E8EBF]" />
            <span>Todas as Categorias</span>
          </button>

          {/* Barra Rápida para Alternar entre as 6 Páginas */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F3EE] p-1.5 rounded-2xl border border-[#EDE4DA]">
            {PAGINAS_DE_JOGOS.map((pagina) => {
              const estaAtiva = pagina.id === paginaCategoriaAtual.id;
              return (
                <button
                  key={pagina.id}
                  onClick={() => executarAbrirPaginaCategoria(pagina.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    estaAtiva
                      ? 'bg-white shadow-xs text-[#1E293B]'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {pagina.shortTitle}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cabeçalho Oficial da Página do Tipo de Jogo */}
        <div className={`rounded-3xl bg-gradient-to-r ${paginaCategoriaAtual.accentBg} p-6 sm:p-8 border border-[#EDE4DA] shadow-xs`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EDE4DA] flex items-center justify-center text-[#4FA88E] shadow-xs shrink-0">
                  <IconePagina className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                    {paginaCategoriaAtual.pageTitle}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#3E8EBF]">
                    {paginaCategoriaAtual.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-1">
                {paginaCategoriaAtual.description}
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-[#EDE4DA] md:max-w-xs shrink-0 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Foco Clínico da Página
              </span>
              <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
                {paginaCategoriaAtual.clinicalSummary}
              </p>
              <span className="inline-block text-[11px] font-bold text-[#2D6A4F] pt-1">
                {paginaCategoriaAtual.games.length === 1
                  ? '1 jogo disponível nesta página'
                  : `${paginaCategoriaAtual.games.length} jogos disponíveis nesta página`}
              </span>
            </div>
          </div>
        </div>

        {/* Grade com os Jogos dentro desta Página */}
        <div className={`grid grid-cols-1 ${paginaCategoriaAtual.games.length > 1 ? 'md:grid-cols-2' : 'max-w-3xl'} gap-6`}>
          {paginaCategoriaAtual.games.map((subJogo) => {
            const IconeSubJogo = subJogo.icon;

            return (
              <div
                key={subJogo.id}
                className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] border border-[#EDE4DA] flex items-center justify-center text-[#3E8EBF] group-hover:scale-105 transition-transform shrink-0">
                        <IconeSubJogo className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#64748B] block">
                          {subJogo.subtitle}
                        </span>
                        <h2 className="text-lg font-extrabold text-[#1E293B] group-hover:text-[#3E8EBF] transition-colors">
                          {subJogo.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {subJogo.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE4DA] text-xs text-[#475569] space-y-1">
                    <strong className="text-[#1E293B] block">Objetivo Terapêutico:</strong>
                    <p>{subJogo.clinicalGoal}</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#64748B] block">
                      Conteúdos selecionáveis ao iniciar o jogo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {subJogo.conteudosInternos.map((conteudo, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${subJogo.badgeColor}`}
                        >
                          {conteudo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {subJogo.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] px-2.5 py-0.5 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#EDE4DA] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">
                    Paciente: <strong className="text-[#1E293B]">{patient.name.split(' ')[0]}</strong>
                  </span>

                  <button
                    onClick={() => executarIniciarSubJogo(subJogo)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-xs flex items-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Jogar Agora</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // ============================================================================
  // ESTADO 3: VISÃO GERAL DAS 6 PÁGINAS DE CATEGORIAS DE JOGOS
  // ============================================================================
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Jogos Digitais Terapêuticos
          </h1>
          <p className="text-xs text-[#64748B]">
            Escolha uma categoria abaixo para abrir sua página dedicada com vários jogos adaptados
          </p>
        </div>

        {/* Barra de Acesso Rápido às 6 Páginas */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F3EE] p-1.5 rounded-2xl border border-[#EDE4DA]">
          {PAGINAS_DE_JOGOS.map((pagina) => (
            <button
              key={pagina.id}
              onClick={() => executarAbrirPaginaCategoria(pagina.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#64748B] hover:bg-white hover:text-[#1E293B] hover:shadow-xs transition-all cursor-pointer"
            >
              {pagina.shortTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Target Callout */}
      <div className="p-4 rounded-2xl bg-[#E8F8F2] border border-[#A8E6CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-[#4FA88E]" />
          <span>
            {patient.id === 'paciente-modo-livre' ? (
              <>Modo de Treino / Demonstração Livre. Para salvar no prontuário, cadastre um paciente na aba <strong>Pacientes</strong>.</>
            ) : (
              <>Paciente ativo para a atividade: <strong className="text-[#1B4332]">{patient.name}</strong> ({patient.diagnosis}).</>
            )}
          </span>
        </div>
        <span className="text-[#2D6A4F] font-bold">
          {PAGINAS_DE_JOGOS.length} páginas temáticas • {PAGINAS_DE_JOGOS.reduce((acc, p) => acc + p.games.length, 0)} jogos interativos
        </span>
      </div>

      {/* Grid com os Cards das 6 Páginas de Jogos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PAGINAS_DE_JOGOS.map((pagina) => {
          const Icon = pagina.icon;

          return (
            <div
              key={pagina.id}
              onClick={() => executarAbrirPaginaCategoria(pagina.id)}
              className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] border border-[#EDE4DA] flex items-center justify-center text-[#4FA88E] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${pagina.badgeColor}`}>
                    {pagina.games.length === 1 ? '1 Jogo na Página' : `${pagina.games.length} Jogos na Página`}
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-[#1E293B] group-hover:text-[#3E8EBF] transition-colors mb-1.5">
                  {pagina.pageTitle}
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed mb-4">
                  {pagina.description}
                </p>

                {/* Prévia dos jogos dentro da página */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE4DA] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Jogos incluídos nesta página:
                  </span>
                  <ul className="space-y-1">
                    {pagina.games.map((g) => (
                      <li key={g.id} className="text-xs font-semibold text-[#1E293B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4FA88E] shrink-0" />
                        <span className="truncate">{g.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#EDE4DA] flex items-center justify-between">
                <span className="text-xs font-bold text-[#3E8EBF] group-hover:underline">
                  Acessar página {pagina.shortTitle}
                </span>

                <div className="w-8 h-8 rounded-xl bg-[#E8F8F2] text-[#2D6A4F] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
