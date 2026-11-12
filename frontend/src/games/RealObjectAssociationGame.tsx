import React, { useState } from 'react';
import { Utensils, Sparkles, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { audio } from '../components/AudioService.ts';

interface AssociationPair {
  id: string;
  objectName: string;
  categoryLabel: string;
  objectEmoji: string;
  targetContextName: string;
  targetContextEmoji: string;
  hint: string;
}

interface RealObjectAssociationGameProps {
  onTap: () => void;
  onMistake: () => void;
  onComplete: () => void;
}

export const RealObjectAssociationGame: React.FC<RealObjectAssociationGameProps> = ({
  onTap,
  onMistake,
  onComplete,
}) => {
  const pairs: AssociationPair[] = [
    {
      id: 'pair-colher',
      objectName: 'Colher Real',
      categoryLabel: 'Alimentação',
      objectEmoji: '🥄',
      targetContextName: 'Prato de Sopa / Refeição',
      targetContextEmoji: '🍲',
      hint: 'A colher usamos para comer uma comidinha gostosa!',
    },
    {
      id: 'pair-escova',
      objectName: 'Escova de Dentes',
      categoryLabel: 'Higiene',
      objectEmoji: '🪥',
      targetContextName: 'Dentes / Creme Dental',
      targetContextEmoji: '✨🦷',
      hint: 'A escova usamos para deixar o sorriso brilhante!',
    },
    {
      id: 'pair-tenis',
      objectName: 'Tênis / Sapato',
      categoryLabel: 'Vestuário',
      objectEmoji: '👟',
      targetContextName: 'Pé / Meia para Passear',
      targetContextEmoji: '🧦🦶',
      hint: 'O tênis calçamos no pé antes de sair para brincar.',
    },
    {
      id: 'pair-copo',
      objectName: 'Copo com Água',
      categoryLabel: 'Hidratação',
      objectEmoji: '🥛',
      targetContextName: 'Garrafa / Beber Água',
      targetContextEmoji: '💧',
      hint: 'O copo usamos para beber água fresca quando temos sede.',
    },
  ];

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('Toque em um objeto real e descubra onde ele é usado no dia a dia.');

  const handleSelectObject = (id: string) => {
    onTap();
    audio.playSoftTap();
    setSelectedObjectId(id);
    const obj = pairs.find((p) => p.id === id);
    if (obj) {
      setFeedbackMessage(`Você escolheu: ${obj.objectName}. Onde usamos esse objeto?`);
    }
  };

  const handleSelectContext = (pair: AssociationPair) => {
    if (!selectedObjectId) {
      setFeedbackMessage('Primeiro toque em um dos objetos do cotidiano à esquerda!');
      return;
    }

    onTap();
    if (selectedObjectId === pair.id) {
      audio.playSnap();
      audio.playChime(matchedIds.length);
      const newMatched = [...matchedIds, pair.id];
      setMatchedIds(newMatched);
      setSelectedObjectId(null);
      setFeedbackMessage(`Perfeito! ${pair.hint}`);

      if (newMatched.length === pairs.length) {
        audio.playSuccessArpeggio();
        setFeedbackMessage('Excelente! Você associou todos os objetos reais aos seus usos! 🌟');
        onComplete();
      }
    } else {
      onMistake();
      audio.playPop();
      setFeedbackMessage('Esse objeto tem outra utilidade. Que tal tentar onde ele se encaixa melhor?');
    }
  };

  const handleReset = () => {
    audio.playSoftTap();
    setSelectedObjectId(null);
    setMatchedIds([]);
    setFeedbackMessage('Toque em um objeto real e descubra onde ele é usado no dia a dia.');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            Objetos do Cotidiano & Suas Funções
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors"
          title="Recomeçar associação"
          aria-label="Recomeçar associação"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Guide Message */}
      <div className="w-full text-center py-2.5 my-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569]">
        {feedbackMessage}
      </div>

      {/* Two Columns: Concrete Object & Everyday Context */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
        
        {/* Column 1: Physical Objects */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE4DA] shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#EDE4DA]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4FA88E]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              1. Objeto Real
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pairs.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedObjectId === pair.id;

              return (
                <button
                  key={pair.id}
                  disabled={isMatched}
                  onClick={() => handleSelectObject(pair.id)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 opacity-60 cursor-default'
                      : isSelected
                      ? 'bg-[#E8F8F2] border-[#4FA88E] ring-4 ring-[#A8E6CF] scale-105'
                      : 'bg-[#FAF8F5] border-[#EDE4DA] hover:border-[#A0D2EB] hover:bg-white'
                  }`}
                  aria-label={pair.objectName}
                >
                  <span className="text-4xl sm:text-5xl my-1">{pair.objectEmoji}</span>
                  <span className="font-bold text-xs sm:text-sm text-[#1E293B] mt-1">
                    {pair.objectName}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-medium">
                    {pair.categoryLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Practical Situations / Targets */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE4DA] shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#EDE4DA]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E8EBF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              2. Onde Usamos?
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pairs.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);

              return (
                <button
                  key={`context-${pair.id}`}
                  disabled={isMatched}
                  onClick={() => handleSelectContext(pair)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 opacity-80 cursor-default'
                      : selectedObjectId
                      ? 'bg-[#D4ECF9]/30 border-[#A0D2EB] hover:bg-[#D4ECF9] animate-pulse'
                      : 'bg-[#FAF8F5] border-[#EDE4DA] hover:border-[#D1C4E9]'
                  }`}
                  aria-label={pair.targetContextName}
                >
                  <span className="text-4xl sm:text-5xl my-1">{pair.targetContextEmoji}</span>
                  <span className="font-bold text-xs sm:text-sm text-[#1E293B] mt-1 text-center">
                    {pair.targetContextName}
                  </span>
                  {isMatched && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#2D6A4F] mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Combinado!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Progress Footer */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-[#EDE4DA] text-xs font-semibold text-[#64748B]">
        <span>Progresso: {matchedIds.length} de {pairs.length} pares associados</span>
        <div className="w-48 bg-[#EDE4DA] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#4FA88E] h-full rounded-full transition-all duration-300"
            style={{ width: `${(matchedIds.length / pairs.length) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
};
