import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, RotateCcw, Shuffle, Camera, Shapes } from 'lucide-react';
import { audio } from '../components/AudioService.ts';
import { embaralharEvitandoAlinhamento, embaralharLista } from '../utils/embaralharLista.ts';

export type VarianteAssociacao = 'alimentacao' | 'higiene' | 'vestuario' | 'escola';
type ModoRepresentacaoVisual = 'ilustracoes' | 'fotos';

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
  varianteInicial?: VarianteAssociacao;
  onTap: () => void;
  onMistake: () => void;
  onComplete: () => void;
}

export const RealObjectAssociationGame: React.FC<RealObjectAssociationGameProps> = ({
  varianteInicial = 'alimentacao',
  onTap,
  onMistake,
  onComplete,
}) => {
  const [varianteAtiva, setVarianteAtiva] = useState<VarianteAssociacao>(varianteInicial);

  const paresPorVariante: Record<VarianteAssociacao, AssociationPair[]> = {
    alimentacao: [
      {
        id: 'alim-colher',
        objectName: 'Colher',
        categoryLabel: 'Talheres',
        objectEmoji: '🥄',
        targetContextName: 'Sopa',
        targetContextEmoji: '🍲',
        hint: 'A colher usamos para tomar sopa e comer comidinha!',
      },
      {
        id: 'alim-copo',
        objectName: 'Copo',
        categoryLabel: 'Hidratação',
        objectEmoji: '🥛',
        targetContextName: 'Água',
        targetContextEmoji: '💧',
        hint: 'O copo usamos para beber água quando temos sede.',
      },
      {
        id: 'alim-prato',
        objectName: 'Prato',
        categoryLabel: 'Mesa',
        objectEmoji: '🍽️',
        targetContextName: 'Almoço',
        targetContextEmoji: '🥗',
        hint: 'No prato colocamos nossa refeição colorida e nutritiva!',
      },
      {
        id: 'alim-fruta',
        objectName: 'Lancheira',
        categoryLabel: 'Lanche',
        objectEmoji: '🍱',
        targetContextName: 'Frutas',
        targetContextEmoji: '🍎🍌',
        hint: 'Na lancheira guardamos frutas para a hora do lanche.',
      },
    ],
    higiene: [
      {
        id: 'hig-escova',
        objectName: 'Escova de Dentes',
        categoryLabel: 'Saúde Bucal',
        objectEmoji: '🪥',
        targetContextName: 'Pasta de Dente',
        targetContextEmoji: '🦷',
        hint: 'A escova e a pasta usamos para limpar os dentes após comer!',
      },
      {
        id: 'hig-sabonete',
        objectName: 'Sabonete',
        categoryLabel: 'Banho & Mãos',
        objectEmoji: '🧼',
        targetContextName: 'Lavar as Mãos',
        targetContextEmoji: '🚰',
        hint: 'O sabonete usamos para lavar bem as mãos.',
      },
      {
        id: 'hig-toalha',
        objectName: 'Toalha',
        categoryLabel: 'Pós-Banho',
        objectEmoji: '🛁',
        targetContextName: 'Chuveiro',
        targetContextEmoji: '🚿',
        hint: 'Usamos a toalha para secar o corpo depois do banho!',
      },
      {
        id: 'hig-pente',
        objectName: 'Pente',
        categoryLabel: 'Cabelo',
        objectEmoji: '🪮',
        targetContextName: 'Cabelo',
        targetContextEmoji: '🧒',
        hint: 'O pente deixa os cabelos arrumados e macios.',
      },
    ],
    vestuario: [
      {
        id: 'vest-tenis',
        objectName: 'Tênis',
        categoryLabel: 'Calçados',
        objectEmoji: '👟',
        targetContextName: 'Meia',
        targetContextEmoji: '🧦',
        hint: 'O tênis calçamos no pé com meia antes de sair.',
      },
      {
        id: 'vest-casaco',
        objectName: 'Casaco',
        categoryLabel: 'Agasalho',
        objectEmoji: '🧥',
        targetContextName: 'Frio',
        targetContextEmoji: '❄️',
        hint: 'O casaco nos mantém aquecidos quando faz frio lá fora!',
      },
      {
        id: 'vest-guardachuva',
        objectName: 'Guarda-Chuva',
        categoryLabel: 'Proteção',
        objectEmoji: '☂️',
        targetContextName: 'Chuva',
        targetContextEmoji: '🌧️',
        hint: 'Abrimos o guarda-chuva para não nos molharmos na chuva.',
      },
      {
        id: 'vest-bone',
        objectName: 'Boné',
        categoryLabel: 'Passeio ao Sol',
        objectEmoji: '🧢',
        targetContextName: 'Parque',
        targetContextEmoji: '☀️',
        hint: 'O boné protege nossa cabeça e olhos nos dias de sol.',
      },
    ],
    escola: [
      {
        id: 'esc-lapis',
        objectName: 'Lápis',
        categoryLabel: 'Escrita',
        objectEmoji: '✏️',
        targetContextName: 'Caderno',
        targetContextEmoji: '📓',
        hint: 'Com o lápis escrevemos e desenhamos no caderno!',
      },
      {
        id: 'esc-mochila',
        objectName: 'Mochila',
        categoryLabel: 'Organização',
        objectEmoji: '🎒',
        targetContextName: 'Escola',
        targetContextEmoji: '🏫',
        hint: 'Na mochila levamos nossos materiais para a escola.',
      },
      {
        id: 'esc-livro',
        objectName: 'Livro',
        categoryLabel: 'Leitura',
        objectEmoji: '📖',
        targetContextName: 'Biblioteca',
        targetContextEmoji: '🛋️',
        hint: 'O livro abrimos para ler e aprender coisas novas.',
      },
      {
        id: 'esc-tinta',
        objectName: 'Pincel',
        categoryLabel: 'Artes',
        objectEmoji: '🎨',
        targetContextName: 'Quadro',
        targetContextEmoji: '🖼️',
        hint: 'O pincel usamos para pintar belos quadros!',
      },
    ],
  };

  const titulosPorVariante: Record<VarianteAssociacao, string> = {
    alimentacao: 'Rotina de Alimentação & Mesa',
    higiene: 'Higiene & Autocuidado Diário',
    vestuario: 'Vestuário, Calçados & Clima',
    escola: 'Materiais Escolares & Estudo',
  };

  const pairs = paresPorVariante[varianteAtiva];

  const [objetosEmbaralhados, setObjetosEmbaralhados] = useState<AssociationPair[]>(() =>
    embaralharLista(paresPorVariante[varianteInicial])
  );
  const [contextosEmbaralhados, setContextosEmbaralhados] = useState<AssociationPair[]>(() =>
    embaralharEvitandoAlinhamento(paresPorVariante[varianteInicial], objetosEmbaralhados)
  );
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [modoVisual, setModoVisual] = useState<ModoRepresentacaoVisual>('ilustracoes');
  const [feedbackMessage, setFeedbackMessage] = useState('Toque em um objeto real e descubra onde ele é usado no dia a dia.');

  const executarEmbaralharPares = useCallback((varianteAlvo: VarianteAssociacao) => {
    const listaBase = paresPorVariante[varianteAlvo];
    const novosObjetos = embaralharLista(listaBase);
    const novosContextos = embaralharEvitandoAlinhamento(listaBase, novosObjetos);
    setObjetosEmbaralhados(novosObjetos);
    setContextosEmbaralhados(novosContextos);
  }, []);

  useEffect(() => {
    setVarianteAtiva(varianteInicial);
    executarEmbaralharPares(varianteInicial);
    setSelectedObjectId(null);
    setMatchedIds([]);
    setFeedbackMessage('Toque em um objeto real e descubra onde ele é usado no dia a dia.');
  }, [varianteInicial, executarEmbaralharPares]);

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

  const executarTrocarVariante = (novaVariante: VarianteAssociacao) => {
    audio.playSoftTap();
    setVarianteAtiva(novaVariante);
    executarEmbaralharPares(novaVariante);
    setSelectedObjectId(null);
    setMatchedIds([]);
    setFeedbackMessage('Toque em um objeto real e descubra onde ele é usado no dia a dia.');
  };

  const executarMisturarCards = () => {
    audio.playSoftTap();
    executarEmbaralharPares(varianteAtiva);
    setSelectedObjectId(null);
    setFeedbackMessage('Cards misturados! Escolha um objeto real e encontre onde ele é usado.');
  };

  const handleReset = () => {
    audio.playSoftTap();
    executarEmbaralharPares(varianteAtiva);
    setSelectedObjectId(null);
    setMatchedIds([]);
    setFeedbackMessage('Toque em um objeto real e descubra onde ele é usado no dia a dia.');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            {titulosPorVariante[varianteAtiva]}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            {([
              { id: 'alimentacao', label: 'Alimentação' },
              { id: 'higiene', label: 'Higiene' },
              { id: 'vestuario', label: 'Vestuário' },
              { id: 'escola', label: 'Escola' },
            ] as const).map((aba) => (
              <button
                key={aba.id}
                onClick={() => executarTrocarVariante(aba.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  varianteAtiva === aba.id ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>

          <div className="inline-flex bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            <button
              onClick={() => {
                audio.playSoftTap();
                setModoVisual('ilustracoes');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                modoVisual === 'ilustracoes' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
              }`}
              title="Exibir ilustrações"
            >
              <Shapes className="w-3.5 h-3.5 text-[#4FA88E]" />
              <span>Ilustrações</span>
            </button>
            <button
              onClick={() => {
                audio.playSoftTap();
                setModoVisual('fotos');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                modoVisual === 'fotos' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
              }`}
              title="Exibir fotos reais"
            >
              <Camera className="w-3.5 h-3.5 text-[#3E8EBF]" />
              <span>Fotos Reais</span>
            </button>
          </div>

          <button
            onClick={executarMisturarCards}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#1E293B] border border-[#EDE4DA] text-xs font-bold transition-colors cursor-pointer"
            title="Misturar cards novamente"
            aria-label="Misturar cards novamente"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#3E8EBF]" />
            <span>Misturar</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors cursor-pointer"
            title="Recomeçar associação"
            aria-label="Recomeçar associação"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Message */}
      <div className="w-full text-center py-2.5 my-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569]">
        {feedbackMessage}
      </div>

      {/* Two Columns: Concrete Object & Everyday Context */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-4 items-stretch">
        
        {/* Column 1: Physical Objects */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE4DA] shadow-xs flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#EDE4DA]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4FA88E]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              1. Objeto Real
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 auto-rows-fr">
            {objetosEmbaralhados.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);
              const isSelected = selectedObjectId === pair.id;

              return (
                <button
                  key={pair.id}
                  disabled={isMatched}
                  onClick={() => handleSelectObject(pair.id)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center min-h-[140px] h-full transition-all cursor-pointer select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 opacity-60 cursor-default'
                      : isSelected
                      ? 'bg-[#E8F8F2] border-[#4FA88E] ring-4 ring-[#A8E6CF] scale-105'
                      : 'bg-[#FAF8F5] border-[#EDE4DA] hover:border-[#A0D2EB] hover:bg-white'
                  }`}
                  aria-label={pair.objectName}
                >
                  {modoVisual === 'fotos' ? (
                    <img
                      src={`/fotos/${pair.id}-obj.jpg?v=2`}
                      alt={pair.objectName}
                      className="w-full h-24 sm:h-28 object-cover rounded-xl mb-1.5 border border-[#EDE4DA]"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl my-1 leading-none">{pair.objectEmoji}</span>
                  )}
                  <span className="font-bold text-xs sm:text-sm text-[#1E293B] mt-1 text-center">
                    {pair.objectName}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-medium h-4 flex items-center justify-center">
                    {pair.categoryLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Practical Situations / Targets */}
        <div className="bg-white p-4 rounded-2xl border border-[#EDE4DA] shadow-xs flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#EDE4DA]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E8EBF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              2. Onde Usamos?
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 auto-rows-fr">
            {contextosEmbaralhados.map((pair) => {
              const isMatched = matchedIds.includes(pair.id);

              return (
                <button
                  key={`context-${pair.id}`}
                  disabled={isMatched}
                  onClick={() => handleSelectContext(pair)}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center min-h-[140px] h-full transition-all cursor-pointer select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 opacity-80 cursor-default'
                      : selectedObjectId
                      ? 'bg-[#D4ECF9]/30 border-[#A0D2EB] hover:bg-[#D4ECF9] animate-pulse'
                      : 'bg-[#FAF8F5] border-[#EDE4DA] hover:border-[#D1C4E9]'
                  }`}
                  aria-label={pair.targetContextName}
                >
                  {modoVisual === 'fotos' ? (
                    <img
                      src={`/fotos/${pair.id}-ctx.jpg?v=2`}
                      alt={pair.targetContextName}
                      className="w-full h-24 sm:h-28 object-cover rounded-xl mb-1.5 border border-[#EDE4DA]"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl my-1 leading-none">{pair.targetContextEmoji}</span>
                  )}
                  <span className="font-bold text-xs sm:text-sm text-[#1E293B] mt-1 text-center">
                    {pair.targetContextName}
                  </span>
                  <span className="h-4 flex items-center justify-center text-[10px] font-bold text-[#2D6A4F]">
                    {isMatched ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Combinado!
                      </span>
                    ) : null}
                  </span>
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
