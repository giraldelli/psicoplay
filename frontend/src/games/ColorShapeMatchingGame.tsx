import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Layers, CheckCircle2, Award, Shuffle } from 'lucide-react';
import { audio } from '../components/AudioService.ts';
import { embaralharLista } from '../utils/embaralharLista.ts';

export type VariantePareamento = 'cor' | 'forma' | 'tamanho' | 'combinado';

interface Item {
  id: string;
  label: string;
  colorName: string;
  bgClass: string;
  borderClass: string;
  shapeType: 'circulo' | 'quadrado' | 'triangulo' | 'estrela';
  sizeType?: 'pequeno' | 'medio' | 'grande' | 'gigante';
  combinedKey?: string;
  iconSvg: string;
  sizeClass?: string;
}

interface TargetBox {
  id: string;
  label: string;
  expectedColor?: string;
  expectedShape?: string;
  expectedSize?: string;
  expectedCombined?: string;
  boxColorClass: string;
  shapeGuide?: string;
}

interface ColorShapeMatchingGameProps {
  varianteInicial?: VariantePareamento;
  onTap: () => void;
  onMistake: () => void;
  onComplete: () => void;
}

export const ColorShapeMatchingGame: React.FC<ColorShapeMatchingGameProps> = ({
  varianteInicial = 'cor',
  onTap,
  onMistake,
  onComplete,
}) => {
  const [mode, setMode] = useState<VariantePareamento>(varianteInicial);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const itemsPorModo: Record<VariantePareamento, Item[]> = {
    cor: [
      { id: 'c-1', label: 'Bloco Verde', colorName: 'verde', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'quadrado', iconSvg: '■' },
      { id: 'c-2', label: 'Círculo Azul', colorName: 'azul', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'circulo', iconSvg: '●' },
      { id: 'c-3', label: 'Estrela Lavanda', colorName: 'lavanda', bgClass: 'bg-[#D1C4E9]', borderClass: 'border-[#7E57C2]', shapeType: 'estrela', iconSvg: '★' },
      { id: 'c-4', label: 'Triângulo Bege', colorName: 'bege', bgClass: 'bg-[#EDE4DA]', borderClass: 'border-[#BCAAA4]', shapeType: 'triangulo', iconSvg: '▲' },
      { id: 'c-5', label: 'Bloco Azul', colorName: 'azul', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'quadrado', iconSvg: '■' },
      { id: 'c-6', label: 'Círculo Verde', colorName: 'verde', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'circulo', iconSvg: '●' },
    ],
    forma: [
      { id: 'f-1', label: 'Quadrado Verde', colorName: 'verde', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'quadrado', iconSvg: '■' },
      { id: 'f-2', label: 'Círculo Azul', colorName: 'azul', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'circulo', iconSvg: '●' },
      { id: 'f-3', label: 'Estrela Lavanda', colorName: 'lavanda', bgClass: 'bg-[#D1C4E9]', borderClass: 'border-[#7E57C2]', shapeType: 'estrela', iconSvg: '★' },
      { id: 'f-4', label: 'Triângulo Bege', colorName: 'bege', bgClass: 'bg-[#EDE4DA]', borderClass: 'border-[#BCAAA4]', shapeType: 'triangulo', iconSvg: '▲' },
      { id: 'f-5', label: 'Estrela Azul', colorName: 'azul', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'estrela', iconSvg: '★' },
      { id: 'f-6', label: 'Triângulo Verde', colorName: 'verde', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'triangulo', iconSvg: '▲' },
    ],
    tamanho: [
      { id: 't-1', label: 'Peça Pequena', colorName: 'pequeno', bgClass: 'bg-[#E8F8F2]', borderClass: 'border-[#4FA88E]', shapeType: 'circulo', sizeType: 'pequeno', iconSvg: '●', sizeClass: 'text-sm' },
      { id: 't-2', label: 'Peça Média', colorName: 'medio', bgClass: 'bg-[#D4ECF9]', borderClass: 'border-[#3E8EBF]', shapeType: 'circulo', sizeType: 'medio', iconSvg: '●', sizeClass: 'text-xl' },
      { id: 't-3', label: 'Peça Grande', colorName: 'grande', bgClass: 'bg-[#EDE7F6]', borderClass: 'border-[#7E57C2]', shapeType: 'circulo', sizeType: 'grande', iconSvg: '●', sizeClass: 'text-3xl' },
      { id: 't-4', label: 'Peça Gigante', colorName: 'gigante', bgClass: 'bg-[#FEF3C7]', borderClass: 'border-[#D97706]', shapeType: 'circulo', sizeType: 'gigante', iconSvg: '●', sizeClass: 'text-4xl' },
      { id: 't-5', label: 'Estrela Pequena', colorName: 'pequeno', bgClass: 'bg-[#E8F8F2]', borderClass: 'border-[#4FA88E]', shapeType: 'estrela', sizeType: 'pequeno', iconSvg: '★', sizeClass: 'text-sm' },
      { id: 't-6', label: 'Estrela Grande', colorName: 'grande', bgClass: 'bg-[#EDE7F6]', borderClass: 'border-[#7E57C2]', shapeType: 'estrela', sizeType: 'grande', iconSvg: '★', sizeClass: 'text-3xl' },
    ],
    combinado: [
      { id: 'cb-1', label: 'Quadrado Verde', colorName: 'verde + ■', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'quadrado', combinedKey: 'verde-quadrado', iconSvg: '■' },
      { id: 'cb-2', label: 'Círculo Azul', colorName: 'azul + ●', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'circulo', combinedKey: 'azul-circulo', iconSvg: '●' },
      { id: 'cb-3', label: 'Estrela Lavanda', colorName: 'lavanda + ★', bgClass: 'bg-[#D1C4E9]', borderClass: 'border-[#7E57C2]', shapeType: 'estrela', combinedKey: 'lavanda-estrela', iconSvg: '★' },
      { id: 'cb-4', label: 'Triângulo Bege', colorName: 'bege + ▲', bgClass: 'bg-[#EDE4DA]', borderClass: 'border-[#BCAAA4]', shapeType: 'triangulo', combinedKey: 'bege-triangulo', iconSvg: '▲' },
      { id: 'cb-5', label: 'Quadrado Verde 2', colorName: 'verde + ■', bgClass: 'bg-[#A8E6CF]', borderClass: 'border-[#4FA88E]', shapeType: 'quadrado', combinedKey: 'verde-quadrado', iconSvg: '■' },
      { id: 'cb-6', label: 'Círculo Azul 2', colorName: 'azul + ●', bgClass: 'bg-[#A0D2EB]', borderClass: 'border-[#3E8EBF]', shapeType: 'circulo', combinedKey: 'azul-circulo', iconSvg: '●' },
    ],
  };

  const caixasPorModo: Record<VariantePareamento, TargetBox[]> = {
    cor: [
      { id: 'box-verde', label: 'Caixa Verde-Menta', expectedColor: 'verde', boxColorClass: 'bg-[#E8F8F2] border-[#A8E6CF] text-[#2D6A4F]' },
      { id: 'box-azul', label: 'Caixa Azul-Claro', expectedColor: 'azul', boxColorClass: 'bg-[#D4ECF9] border-[#A0D2EB] text-[#1E3A8A]' },
      { id: 'box-lavanda', label: 'Caixa Lavanda', expectedColor: 'lavanda', boxColorClass: 'bg-[#EDE7F6] border-[#D1C4E9] text-[#5E35B1]' },
      { id: 'box-bege', label: 'Caixa Bege-Quente', expectedColor: 'bege', boxColorClass: 'bg-[#F7F3EE] border-[#EDE4DA] text-[#6D4C41]' },
    ],
    forma: [
      { id: 'shape-quadrado', label: 'Encaixe Quadrado', expectedShape: 'quadrado', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '■' },
      { id: 'shape-circulo', label: 'Encaixe Círculo', expectedShape: 'circulo', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '●' },
      { id: 'shape-triangulo', label: 'Encaixe Triângulo', expectedShape: 'triangulo', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '▲' },
      { id: 'shape-estrela', label: 'Encaixe Estrela', expectedShape: 'estrela', boxColorClass: 'bg-white border-[#CBD5E1] text-[#334155]', shapeGuide: '★' },
    ],
    tamanho: [
      { id: 'sz-pequeno', label: 'Tamanho Pequeno', expectedSize: 'pequeno', boxColorClass: 'bg-[#E8F8F2] border-[#A8E6CF] text-[#2D6A4F]', shapeGuide: '•' },
      { id: 'sz-medio', label: 'Tamanho Médio', expectedSize: 'medio', boxColorClass: 'bg-[#D4ECF9] border-[#A0D2EB] text-[#1E3A8A]', shapeGuide: '●' },
      { id: 'sz-grande', label: 'Tamanho Grande', expectedSize: 'grande', boxColorClass: 'bg-[#EDE7F6] border-[#D1C4E9] text-[#5E35B1]', shapeGuide: '⬤' },
      { id: 'sz-gigante', label: 'Tamanho Gigante', expectedSize: 'gigante', boxColorClass: 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]', shapeGuide: '🟣' },
    ],
    combinado: [
      { id: 'cb-verde-quadrado', label: 'Quadrado Verde', expectedCombined: 'verde-quadrado', boxColorClass: 'bg-[#E8F8F2] border-[#A8E6CF] text-[#2D6A4F]', shapeGuide: '■' },
      { id: 'cb-azul-circulo', label: 'Círculo Azul', expectedCombined: 'azul-circulo', boxColorClass: 'bg-[#D4ECF9] border-[#A0D2EB] text-[#1E3A8A]', shapeGuide: '●' },
      { id: 'cb-lavanda-estrela', label: 'Estrela Lavanda', expectedCombined: 'lavanda-estrela', boxColorClass: 'bg-[#EDE7F6] border-[#D1C4E9] text-[#5E35B1]', shapeGuide: '★' },
      { id: 'cb-bege-triangulo', label: 'Triângulo Bege', expectedCombined: 'bege-triangulo', boxColorClass: 'bg-[#F7F3EE] border-[#EDE4DA] text-[#6D4C41]', shapeGuide: '▲' },
    ],
  };

  const titulosPorModo: Record<VariantePareamento, string> = {
    cor: 'Separar por Cores (Caixas Coloridas)',
    forma: 'Encaixar por Formas Geométricas',
    tamanho: 'Classificar por Tamanhos (Pequeno ao Gigante)',
    combinado: 'Desafio Duplo: Cor + Forma Geométrica',
  };

  const [availableItems, setAvailableItems] = useState<Item[]>(() =>
    embaralharLista(itemsPorModo[varianteInicial])
  );
  const [boxesEmbaralhadas, setBoxesEmbaralhadas] = useState<TargetBox[]>(() =>
    embaralharLista(caixasPorModo[varianteInicial])
  );
  const [matchedCount, setMatchedCount] = useState(0);
  const [message, setMessage] = useState<string>('Toque em uma peça e depois na caixa correspondente.');

  const executarEmbaralharRodada = useCallback((modoAlvo: VariantePareamento) => {
    setAvailableItems(embaralharLista(itemsPorModo[modoAlvo]));
    setBoxesEmbaralhadas(embaralharLista(caixasPorModo[modoAlvo]));
  }, []);

  useEffect(() => {
    setMode(varianteInicial);
    executarEmbaralharRodada(varianteInicial);
    setSelectedItemId(null);
    setMatchedCount(0);
    setMessage('Toque em uma peça e depois na caixa correspondente.');
  }, [varianteInicial, executarEmbaralharRodada]);

  const handleSelectItem = (item: Item) => {
    onTap();
    audio.playSoftTap();
    setSelectedItemId(item.id);
    setMessage(`Peça selecionada: ${item.label}. Onde ela deve se encaixar?`);
  };

  const handleSelectBox = (box: TargetBox) => {
    if (!selectedItemId) {
      setMessage('Primeiro toque em uma das peças abaixo!');
      return;
    }

    onTap();
    const item = availableItems.find((i) => i.id === selectedItemId);
    if (!item) return;

    let isMatch = false;
    if (mode === 'cor') {
      isMatch = item.colorName === box.expectedColor;
    } else if (mode === 'forma') {
      isMatch = item.shapeType === box.expectedShape;
    } else if (mode === 'tamanho') {
      isMatch = item.sizeType === box.expectedSize;
    } else if (mode === 'combinado') {
      isMatch = item.combinedKey === box.expectedCombined;
    }

    if (isMatch) {
      audio.playSnap();
      audio.playChime(matchedCount % 6);
      const remaining = availableItems.filter((i) => i.id !== selectedItemId);
      setAvailableItems(remaining);
      setSelectedItemId(null);
      const newCount = matchedCount + 1;
      setMatchedCount(newCount);
      setMessage('Muito bem! Você pareou certinho.');

      if (remaining.length === 0) {
        audio.playSuccessArpeggio();
        setMessage('Parabéns! Todas as peças foram organizadas com sucesso! ⭐');
        onComplete();
      }
    } else {
      onMistake();
      audio.playPop();
      setMessage('Essa peça tem um atributo diferente. Vamos tentar outra caixa?');
    }
  };

  const executarTrocarModo = (novoModo: VariantePareamento) => {
    audio.playSoftTap();
    setMode(novoModo);
    executarEmbaralharRodada(novoModo);
    setSelectedItemId(null);
    setMatchedCount(0);
    setMessage('Toque em uma peça e depois na caixa correspondente.');
  };

  const executarMisturarCards = () => {
    audio.playSoftTap();
    setAvailableItems((itensAtuais) => embaralharLista(itensAtuais));
    setBoxesEmbaralhadas((caixasAtuais) => embaralharLista(caixasAtuais));
    setSelectedItemId(null);
    setMessage('Peças e caixas misturadas! Toque em uma peça para continuar.');
  };

  const handleReset = () => {
    audio.playSoftTap();
    executarEmbaralharRodada(mode);
    setSelectedItemId(null);
    setMatchedCount(0);
    setMessage('Toque em uma peça e depois na caixa correspondente.');
  };

  const boxes = boxesEmbaralhadas;

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Game Mode Selector Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            {titulosPorModo[mode]}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            {([
              { id: 'cor', label: 'Cores' },
              { id: 'forma', label: 'Formas' },
              { id: 'tamanho', label: 'Tamanhos' },
              { id: 'combinado', label: 'Cor + Forma' },
            ] as const).map((aba) => (
              <button
                key={aba.id}
                onClick={() => executarTrocarModo(aba.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === aba.id ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>

          <button
            onClick={executarMisturarCards}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#1E293B] border border-[#EDE4DA] text-xs font-bold transition-colors cursor-pointer"
            title="Misturar peças e caixas"
            aria-label="Misturar peças e caixas"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#3E8EBF]" />
            <span>Misturar</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors cursor-pointer"
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
              <span className="text-3xl sm:text-4xl opacity-40 mb-2 font-mono">
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
                  <span className={`${item.sizeClass || 'text-xl sm:text-2xl'} text-[#1E293B]`}>
                    {item.iconSvg}
                  </span>
                  <span className="text-[10px] font-bold text-[#1E293B]/80 mt-0.5">
                    {mode === 'forma' ? item.shapeType : item.colorName}
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
