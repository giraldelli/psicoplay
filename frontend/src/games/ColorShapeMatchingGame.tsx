import React, { useState } from 'react';
import { Sparkles, RefreshCw, Layers, CheckCircle2, Award } from 'lucide-react';
import { audio } from '../components/AudioService.ts';

interface Item {
  id: string;
  label: string;
  colorName: string;
  bgClass: string;
  borderClass: string;
  shapeType: 'circulo' | 'quadrado' | 'triangulo' | 'estrela';
  iconSvg: string;
}

interface TargetBox {
  id: string;
  label: string;
  expectedColor?: string;
  expectedShape?: string;
  boxColorClass: string;
  shapeGuide?: string;
}

interface ColorShapeMatchingGameProps {
  onTap: () => void;
  onMistake: () => void;
  onComplete: () => void;
}

export const ColorShapeMatchingGame: React.FC<ColorShapeMatchingGameProps> = ({
  onTap,
  onMistake,
  onComplete,
}) => {
  const [mode, setMode] = useState<'cor' | 'forma'>('cor');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Items to classify
  const initialItems: Item[] = [
    { id: 'item-1', label: 'Bloco Verde', colorName: 'verde', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'quadrado', iconSvg: '■' },
    { id: 'item-2', label: 'Círculo Azul', colorName: 'azul', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'circulo', iconSvg: '●' },
    { id: 'item-3', label: 'Estrela Lavanda', colorName: 'lavanda', bgClass: 'bg-[#D1C4E9]', borderClass: 'border-[#7E57C2]', shapeType: 'estrela', iconSvg: '★' },
    { id: 'item-4', label: 'Triângulo Bege', colorName: 'bege', bgClass: 'bg-[#EDE4DA]', borderClass: 'border-[#BCAAA4]', shapeType: 'triangulo', iconSvg: '▲' },
    { id: 'item-5', label: 'Bloco Azul 2', colorName: 'azul', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'quadrado', iconSvg: '■' },
    { id: 'item-6', label: 'Círculo Verde 2', colorName: 'verde', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'circulo', iconSvg: '●' },
  ];

  const colorBoxes: TargetBox[] = [
    { id: 'box-verde', label: 'Caixa Verde-Menta', expectedColor: 'verde', boxColorClass: 'bg-[#E8F8F2] border-[#A8E6CF] text-[#2D6A4F]' },
    { id: 'box-azul', label: 'Caixa Azul-Claro', expectedColor: 'azul', boxColorClass: 'bg-[#D4ECF9] border-[#A0D2EB] text-[#1E3A8A]' },
    { id: 'box-lavanda', label: 'Caixa Lavanda', expectedColor: 'lavanda', boxColorClass: 'bg-[#EDE7F6] border-[#D1C4E9] text-[#5E35B1]' },
    { id: 'box-bege', label: 'Caixa Bege-Quente', expectedColor: 'bege', boxColorClass: 'bg-[#F7F3EE] border-[#EDE4DA] text-[#6D4C41]' },
  ];

  const shapeBoxes: TargetBox[] = [
    { id: 'shape-quadrado', label: 'Encaixe Quadrado', expectedShape: 'quadrado', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '■' },
    { id: 'shape-circulo', label: 'Encaixe Círculo', expectedShape: 'circulo', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '●' },
    { id: 'shape-triangulo', label: 'Encaixe Triângulo', expectedShape: 'triangulo', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '▲' },
    { id: 'shape-estrela', label: 'Encaixe Estrela', expectedShape: 'estrela', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '★' },
  ];

  const [availableItems, setAvailableItems] = useState<Item[]>(initialItems);
  const [matchedCount, setMatchedCount] = useState(0);
  const [message, setMessage] = useState<string>('Toque em uma peça e depois na caixa correspondente.');

  const handleSelectItem = (item: Item) => {
    onTap();
    audio.playSoftTap();
    setSelectedItemId(item.id);
    setMessage(`Peça selecionada: ${item.label}. Onde ela deve se encaixar?`);
  };

  const handleSelectBox = (box: TargetBox) => {
    if (!selectedItemId) {
      setMessage('Primeiro toque em uma das peças coloridas abaixo!');
      return;
    }

    onTap();
    const item = availableItems.find((i) => i.id === selectedItemId);
    if (!item) return;

    let isMatch = false;
    if (mode === 'cor') {
      isMatch = item.colorName === box.expectedColor;
    } else {
      isMatch = item.shapeType === box.expectedShape;
    }

    if (isMatch) {
      audio.playSnap();
      audio.playChime(matchedCount % 6);
      const remaining = availableItems.filter((i) => i.id !== selectedItemId);
      setAvailableItems(remaining);
      setSelectedItemId(null);
      const newCount = matchedCount + 1;
      setMatchedCount(newCount);
      setMessage(`Muito bem! Você pareou certinho.`);

      if (remaining.length === 0) {
        audio.playSuccessArpeggio();
        setMessage('Parabéns! Todas as peças foram organizadas com sucesso! ⭐');
        onComplete();
      }
    } else {
      onMistake();
      audio.playPop();
      setMessage('Essa peça tem uma cor ou forma diferente. Vamos tentar outra caixa?');
    }
  };

  const handleReset = () => {
    audio.playSoftTap();
    setAvailableItems(initialItems);
    setSelectedItemId(null);
    setMatchedCount(0);
    setMessage('Toque em uma peça e depois na caixa correspondente.');
  };

  const boxes = mode === 'cor' ? colorBoxes : shapeBoxes;

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Game Mode Selector Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            {mode === 'cor' ? 'Separar por Cores' : 'Encaixar por Formas'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            <button
              onClick={() => {
                audio.playSoftTap();
                setMode('cor');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'cor' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
              }`}
            >
              Modo Cores
            </button>
            <button
              onClick={() => {
                audio.playSoftTap();
                setMode('forma');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'forma' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
              }`}
            >
              Modo Formas
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors"
            title="Recomeçar atividade"
            aria-label="Recomeçar atividade"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gentle Audio & Text Feedback */}
      <div className="w-full text-center py-2.5 my-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569]">
        {message}
      </div>

      {/* Target Classification Boxes */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4">
        {boxes.map((box) => (
          <div
            key={box.id}
            onClick={() => handleSelectBox(box)}
            className={`min-h-[130px] sm:min-h-[150px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 select-none ${box.boxColorClass} ${
              selectedItemId ? 'ring-2 ring-[#4FA88E]/40 animate-pulse' : ''
            }`}
          >
            {box.shapeGuide && (
              <span className="text-3xl sm:text-4xl opacity-30 mb-2 font-mono">
                {box.shapeGuide}
              </span>
            )}
            <span className="font-bold text-xs sm:text-sm text-center">
              {box.label}
            </span>
            <span className="text-[10px] mt-1 text-[#64748B] font-medium">
              Toque aqui para guardar
            </span>
          </div>
        ))}
      </div>

      {/* Pieces Tray */}
      <div className="w-full bg-[#F7F3EE] p-4 rounded-2xl border border-[#EDE4DA]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Peças para Organizar ({availableItems.length})
          </span>
          {availableItems.length === 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2D6A4F] bg-[#E8F8F2] px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Concluído com sucesso!
            </span>
          )}
        </div>

        {availableItems.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            {availableItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs cursor-pointer transition-all select-none hover:scale-105 active:scale-95 ${item.bgClass} ${item.borderClass} ${
                    isSelected ? 'ring-4 ring-[#3E8EBF] scale-110' : ''
                  }`}
                  aria-label={item.label}
                >
                  <span className="text-xl sm:text-2xl text-[#1E293B]">
                    {item.iconSvg}
                  </span>
                  <span className="text-[10px] font-bold text-[#1E293B]/80 mt-0.5">
                    {mode === 'cor' ? item.colorName : item.shapeType}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Award className="w-12 h-12 text-[#4FA88E] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1E293B]">Todas as peças foram organizadas!</p>
            <p className="text-xs text-[#64748B]">O profissional da saúde ou educação pode registrar a reação e o progresso no painel ao lado.</p>
          </div>
        )}
      </div>

    </div>
  );
};
