import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Layers,
  Touchpad,
  Box,
  Eye,
  CheckCircle,
  Play,
  Activity,
  ArrowRight,
  Heart,
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

export type GameIdentifier =
  | 'color-shape'
  | 'real-objects'
  | 'wooden-puzzle'
  | 'balloons'
  | 'digital-coloring'
  | 'three-blocks';

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
  const [activeGameId, setActiveGameId] = useState<GameIdentifier | null>(
    (initialGameId as GameIdentifier) || null
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'classification' | 'adapted' | 'three'>('all');
  const [isPatientMode, setIsPatientMode] = useState(false);

  // Live trackers for active game session
  const [touchesCount, setTouchesCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  const gamesList = [
    {
      id: 'color-shape' as GameIdentifier,
      title: 'Pareamento por Cor ou Forma',
      category: 'classification' as const,
      categoryLabel: 'Pareamento e Classificação',
      badge: 'Organização do Pensamento',
      badgeColor: 'bg-[#E8F8F2] text-[#2D6A4F] border-[#A8E6CF]',
      description: 'Separar blocos coloridos em caixas da mesma cor ou encaixar formas geométricas simples com suporte visual.',
      clinicalGoal: 'Estimular categorização mental, percepção de semelhanças e contraste sem sobrecarga.',
      icon: Layers,
    },
    {
      id: 'real-objects' as GameIdentifier,
      title: 'Associação de Figuras Reais',
      category: 'classification' as const,
      categoryLabel: 'Pareamento e Classificação',
      badge: 'Generalização do Cotidiano',
      badgeColor: 'bg-[#D4ECF9] text-[#1E3A8A] border-[#A0D2EB]',
      description: 'Combinar a foto/ilustração de um objeto real (como colher, escova, tênis) ao seu contexto diário.',
      clinicalGoal: 'Apoiar comunicação funcional, expansão de vocabulário e rotinas de autonomia diária.',
      icon: Eye,
    },
    {
      id: 'wooden-puzzle' as GameIdentifier,
      title: 'Quebra-cabeças de Encaixe Único',
      category: 'classification' as const,
      categoryLabel: 'Pareamento e Classificação',
      badge: 'Pino de Madeira',
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      description: 'Peças em estilo madeira maciça onde cada item representa um objeto inteiro com pino de pegada realista.',
      clinicalGoal: 'Coordenação óculo-manual, movimento de pinça visualizado e fechamento gestáltico.',
      icon: Box,
    },
    {
      id: 'balloons' as GameIdentifier,
      title: 'Jogos de Toque Direto: Balões',
      category: 'adapted' as const,
      categoryLabel: 'Jogos Digitais Adaptados',
      badge: 'Causa e Efeito & Previsibilidade',
      badgeColor: 'bg-[#EDE7F6] text-[#5E35B1] border-[#D1C4E9]',
      description: 'Tocar na tela faz balões pastéis estourarem suavemente revelando bichinhos e estrelas.',
      clinicalGoal: 'Ideal para TEA e atrasos de linguagem. Alta previsibilidade, sem sustos ou sons estridentes.',
      icon: Touchpad,
    },
    {
      id: 'digital-coloring' as GameIdentifier,
      title: 'Jogos de Colorir Digital',
      category: 'adapted' as const,
      categoryLabel: 'Jogos Digitais Adaptados',
      badge: 'Pintura por Toque Automático',
      badgeColor: 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]',
      description: 'Basta tocar em uma área para que ela se preencha de cor suave automaticamente, sem frustração motora fina.',
      clinicalGoal: 'Foco atencional, relaxamento sensorial, senso de agência e empoderamento na produção artística.',
      icon: Sparkles,
    },
    {
      id: 'three-blocks' as GameIdentifier,
      title: 'Oficina Sensorial 3D (Three.js)',
      category: 'three' as const,
      categoryLabel: 'Renderização Espacial 3D',
      badge: 'Espacialidade & Calmaria',
      badgeColor: 'bg-[#F7F3EE] text-[#6D4C41] border-[#EDE4DA]',
      description: 'Cubos, cilindros e esferas 3D suaves e táteis para girar no espaço e explorar volume.',
      clinicalGoal: 'Percepção de profundidade tridimensional com paleta relaxante e iluminação calorosa.',
      icon: Box,
    },
  ];

  const filteredGames = gamesList.filter((g) => {
    if (categoryFilter === 'all') return true;
    return g.category === categoryFilter;
  });

  const handleStartGame = (id: GameIdentifier) => {
    audio.playSoftTap();
    setTouchesCount(0);
    setMistakesCount(0);
    setActiveGameId(id);
  };

  const handleCloseGame = () => {
    audio.playSoftTap();
    setActiveGameId(null);
    setIsPatientMode(false);
  };

  const currentGame = gamesList.find((g) => g.id === activeGameId);

  // If a game is active, render game stage with Therapist HUD side drawer
  if (currentGame) {
    return (
      <div className="relative min-h-[600px] w-full flex flex-col lg:flex-row gap-4 bg-white/60 rounded-3xl p-4 sm:p-6 border border-[#EDE4DA] shadow-xs">
        
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {currentGame.id === 'color-shape' && (
            <ColorShapeMatchingGame
              onTap={() => setTouchesCount((c) => c + 1)}
              onMistake={() => setMistakesCount((c) => c + 1)}
              onComplete={() => audio.playSuccessArpeggio()}
            />
          )}

          {currentGame.id === 'real-objects' && (
            <RealObjectAssociationGame
              onTap={() => setTouchesCount((c) => c + 1)}
              onMistake={() => setMistakesCount((c) => c + 1)}
              onComplete={() => audio.playSuccessArpeggio()}
            />
          )}

          {currentGame.id === 'wooden-puzzle' && (
            <WoodenPegPuzzleGame
              onTap={() => setTouchesCount((c) => c + 1)}
              onMistake={() => setMistakesCount((c) => c + 1)}
              onComplete={() => audio.playSuccessArpeggio()}
            />
          )}

          {currentGame.id === 'balloons' && (
            <DirectTouchBalloonsGame
              onTap={() => setTouchesCount((c) => c + 1)}
              onComplete={() => audio.playSuccessArpeggio()}
            />
          )}

          {currentGame.id === 'digital-coloring' && (
            <DigitalColoringGame
              onTap={() => setTouchesCount((c) => c + 1)}
              onComplete={() => audio.playSuccessArpeggio()}
            />
          )}

          {currentGame.id === 'three-blocks' && (
            <ThreeTactileBlocksGame
              onTap={() => setTouchesCount((c) => c + 1)}
              onComplete={() => audio.playSuccessArpeggio()}
            />
          )}
        </div>

        {/* Clinical Observation Side HUD */}
        <TherapistHUD
          patient={patient}
          gameId={currentGame.id}
          gameTitle={currentGame.title}
          touchesCount={touchesCount}
          mistakesCount={mistakesCount}
          isPatientMode={isPatientMode}
          onTogglePatientMode={() => setIsPatientMode(!isPatientMode)}
          onSaveMetric={onSaveGameMetric}
          onCloseGame={handleCloseGame}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE4DA]">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#3E8EBF] bg-[#D4ECF9] px-2.5 py-0.5 rounded-full inline-block mb-1">
            Biblioteca Terapêutica Interativa
          </span>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">
            Jogos Digitais Terapêuticos
          </h1>
          <p className="text-xs text-[#64748B]">
            Adaptados para TEA, deficiência mental e transtornos do neurodesenvolvimento
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F3EE] p-1.5 rounded-2xl border border-[#EDE4DA]">
          {[
            { id: 'all' as const, label: 'Todos os Jogos' },
            { id: 'classification' as const, label: 'Pareamento & Classificação' },
            { id: 'adapted' as const, label: 'Toque Direto & Causa-Efeito' },
            { id: 'three' as const, label: 'Sensorial 3D' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                audio.playSoftTap();
                setCategoryFilter(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-white shadow-xs text-[#1E293B]'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Target Callout */}
      <div className="p-4 rounded-2xl bg-[#E8F8F2] border border-[#A8E6CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-[#4FA88E]" />
          <span>
            {patient.id === 'temp-livre' ? (
              <>Modo de Treino / Demonstração Livre. Para salvar no prontuário, cadastre um paciente na aba <strong>Pacientes</strong>.</>
            ) : (
              <>Paciente ativo para a atividade: <strong className="text-[#1B4332]">{patient.name}</strong> ({patient.diagnosis}).</>
            )}
          </span>
        </div>
        <span className="text-[#2D6A4F] font-bold">
          Painel de observação do profissional da saúde e educação disponível durante a sessão.
        </span>
      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const Icon = game.icon;

          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 border border-[#EDE4DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#F7F3EE] flex items-center justify-center text-[#4FA88E] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-[#1E293B] mb-1.5">
                  {game.title}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed mb-4">
                  {game.description}
                </p>

                <div className="p-3 rounded-2xl bg-[#FCFBF9] border border-[#EDE4DA] text-[11px] text-[#64748B] space-y-1">
                  <strong className="text-[#1E293B] block">🎯 Alvo Terapêutico:</strong>
                  <p>{game.clinicalGoal}</p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#EDE4DA] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#64748B]">
                  {game.categoryLabel}
                </span>

                <button
                  onClick={() => handleStartGame(game.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4FA88E] to-[#3E8EBF] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:opacity-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{patient.id === 'temp-livre' ? 'Jogar Agora' : `Jogar com ${patient.name.split(' ')[0]}`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
