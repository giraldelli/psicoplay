import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Check, Trophy, Shuffle, Camera, Shapes } from 'lucide-react';
import { audio } from '../components/AudioService.ts';
import { embaralharEvitandoAlinhamento, embaralharLista } from '../utils/embaralharLista.ts';

export type VarianteQuebraCabeca = 'animais_veiculos' | 'fazenda' | 'frutas' | 'instrumentos';
type ModoRepresentacaoVisual = 'ilustracoes' | 'fotos';

interface PegPiece {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgHex: string;
  description: string;
}

interface WoodenPegPuzzleGameProps {
  varianteInicial?: VarianteQuebraCabeca;
  onTap: () => void;
  onMistake: () => void;
  onComplete: () => void;
}

export const WoodenPegPuzzleGame: React.FC<WoodenPegPuzzleGameProps> = ({
  varianteInicial = 'animais_veiculos',
  onTap,
  onMistake,
  onComplete,
}) => {
  const [varianteAtiva, setVarianteAtiva] = useState<VarianteQuebraCabeca>(varianteInicial);

  const pecasPorVariante: Record<VarianteQuebraCabeca, PegPiece[]> = {
    animais_veiculos: [
      { id: 'leao', title: 'Leãozinho', emoji: '🦁', color: '#D97706', bgHex: '#FEF3C7', description: 'O rei da floresta, todo amarelinho' },
      { id: 'carro', title: 'Carro de Passeio', emoji: '🚗', color: '#DC2626', bgHex: '#FEE2E2', description: 'Anda nas ruas e faz bi-bi' },
      { id: 'elefante', title: 'Elefantinho', emoji: '🐘', color: '#4B5563', bgHex: '#F3F4F6', description: 'Tem uma tromba bem comprida' },
      { id: 'barco', title: 'Barquinho a Vela', emoji: '⛵', color: '#0284C7', bgHex: '#E0F2FE', description: 'Navega suave pelas ondas do mar' },
    ],
    fazenda: [
      { id: 'vaca', title: 'Vaquinha', emoji: '🐮', color: '#059669', bgHex: '#DCFCE7', description: 'Mora na fazenda e dá leitinho' },
      { id: 'trator', title: 'Trator do Campo', emoji: '🚜', color: '#16A34A', bgHex: '#E8F8F2', description: 'Ajuda a cuidar da plantação' },
      { id: 'pintinho', title: 'Pintinho Amarelinho', emoji: '🐥', color: '#CA8A04', bgHex: '#FEF3C7', description: 'Faz piu-piu e cabe na palma da mão' },
      { id: 'arvore', title: 'Árvore Frondosa', emoji: '🌳', color: '#15803D', bgHex: '#ECFDF5', description: 'Faz sombra fresquinha no quintal' },
    ],
    frutas: [
      { id: 'maca', title: 'Maçã Vermelha', emoji: '🍎', color: '#DC2626', bgHex: '#FEE2E2', description: 'Crocante e docinha na hora do lanche' },
      { id: 'banana', title: 'Banana Madura', emoji: '🍌', color: '#D97706', bgHex: '#FEF3C7', description: 'Macia, amarelinha e fácil de descascar' },
      { id: 'morango', title: 'Morango', emoji: '🍓', color: '#E11D48', bgHex: '#FFE4E6', description: 'Pequenininho, vermelho e saboroso' },
      { id: 'laranja', title: 'Laranja Docinha', emoji: '🍊', color: '#EA580C', bgHex: '#FFEDD5', description: 'Redondinha e cheia de suco natural' },
    ],
    instrumentos: [
      { id: 'violao', title: 'Violão Acústico', emoji: '🎸', color: '#B45309', bgHex: '#FEF3C7', description: 'Tem cordas suaves para tocar canções' },
      { id: 'tambor', title: 'Tamborzinho', emoji: '🥁', color: '#DC2626', bgHex: '#FEE2E2', description: 'Marca o ritmo alegre com as baquetas' },
      { id: 'teclado', title: 'Teclado Musical', emoji: '🎹', color: '#334155', bgHex: '#F1F5F9', description: 'Tem teclas brancas e pretas melodiosas' },
      { id: 'trompete', title: 'Trompete Dourado', emoji: '🎺', color: '#CA8A04', bgHex: '#FEF9C3', description: 'Brilha como ouro e toca notas festivas' },
    ],
  };

  const titulosPorVariante: Record<VarianteQuebraCabeca, string> = {
    animais_veiculos: 'Tabuleiro: Animais & Veículos',
    fazenda: 'Tabuleiro: Fazenda & Natureza',
    frutas: 'Tabuleiro: Frutas Saudáveis',
    instrumentos: 'Tabuleiro: Sons & Instrumentos Musicais',
  };

  const pieces = pecasPorVariante[varianteAtiva];

  const [slotsEmbaralhados, setSlotsEmbaralhados] = useState<PegPiece[]>(() =>
    embaralharLista(pecasPorVariante[varianteInicial])
  );
  const [pecasEmbaralhadas, setPecasEmbaralhadas] = useState<PegPiece[]>(() =>
    embaralharEvitandoAlinhamento(pecasPorVariante[varianteInicial], slotsEmbaralhados)
  );
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [placedPieceIds, setPlacedPieceIds] = useState<string[]>([]);
  const [modoVisual, setModoVisual] = useState<ModoRepresentacaoVisual>('ilustracoes');
  const [pecaArrastadaId, setPecaArrastadaId] = useState<string | null>(null);
  const [posicaoPonteiro, setPosicaoPonteiro] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [slotSobPonteiroId, setSlotSobPonteiroId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Arraste uma peça pelo pino de madeira até a silhueta correspondente.');

  const pontoInicialArrastoRef = useRef<{ x: number; y: number } | null>(null);
  const placedPieceIdsRef = useRef<string[]>(placedPieceIds);
  useEffect(() => {
    placedPieceIdsRef.current = placedPieceIds;
  }, [placedPieceIds]);

  const executarEmbaralharTabuleiro = useCallback((varianteAlvo: VarianteQuebraCabeca) => {
    const listaBase = pecasPorVariante[varianteAlvo];
    const novosSlots = embaralharLista(listaBase);
    const novasPecas = embaralharEvitandoAlinhamento(listaBase, novosSlots);
    setSlotsEmbaralhados(novosSlots);
    setPecasEmbaralhadas(novasPecas);
  }, []);

  useEffect(() => {
    setVarianteAtiva(varianteInicial);
    executarEmbaralharTabuleiro(varianteInicial);
    setSelectedPieceId(null);
    setPlacedPieceIds([]);
    setPecaArrastadaId(null);
    setSlotSobPonteiroId(null);
    setStatusText('Arraste uma peça pelo pino de madeira até a silhueta correspondente.');
  }, [varianteInicial, executarEmbaralharTabuleiro]);

  const executarTentarEncaixarPeca = useCallback(
    (pecaOrigemId: string, slotDestinoId: string) => {
      onTap();
      if (pecaOrigemId === slotDestinoId) {
        audio.playSnap();
        const colocadasAtuais = placedPieceIdsRef.current;
        audio.playChime(colocadasAtuais.length);
        const updated = colocadasAtuais.includes(slotDestinoId)
          ? colocadasAtuais
          : [...colocadasAtuais, slotDestinoId];
        setPlacedPieceIds(updated);
        setSelectedPieceId(null);
        setStatusText('Encaixe perfeito com o pino! Muito bem.');

        if (updated.length === pieces.length) {
          audio.playSuccessArpeggio();
          setStatusText('Sensacional! Todas as peças foram encaixadas perfeitamente no tabuleiro!');
          onComplete();
        }
      } else {
        onMistake();
        audio.playPop();
        setStatusText('Essa silhueta não tem o mesmo formato. Olhe o contorno com atenção.');
      }
    },
    [onTap, onMistake, onComplete, pieces.length]
  );

  const obterSlotSobCoordenada = (coordenadaX: number, coordenadaY: number): string | null => {
    const elementos = document.elementsFromPoint(coordenadaX, coordenadaY);
    for (const elemento of elementos) {
      if (elemento instanceof HTMLElement && elemento.dataset.slotId) {
        return elemento.dataset.slotId;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!pecaArrastadaId) return;

    const executarMoverPonteiro = (evento: PointerEvent) => {
      setPosicaoPonteiro({ x: evento.clientX, y: evento.clientY });
      const slotEncontrado = obterSlotSobCoordenada(evento.clientX, evento.clientY);
      if (slotEncontrado && !placedPieceIdsRef.current.includes(slotEncontrado)) {
        setSlotSobPonteiroId(slotEncontrado);
      } else {
        setSlotSobPonteiroId(null);
      }
    };

    const executarSoltarPonteiro = (evento: PointerEvent) => {
      const slotDestino = obterSlotSobCoordenada(evento.clientX, evento.clientY);
      const pontoInicial = pontoInicialArrastoRef.current;
      const distanciaMovida = pontoInicial
        ? Math.hypot(evento.clientX - pontoInicial.x, evento.clientY - pontoInicial.y)
        : 0;

      if (slotDestino && !placedPieceIdsRef.current.includes(slotDestino)) {
        executarTentarEncaixarPeca(pecaArrastadaId, slotDestino);
      } else if (distanciaMovida < 6) {
        setSelectedPieceId(pecaArrastadaId);
        const pecaSelecionada = pieces.find((item) => item.id === pecaArrastadaId);
        if (pecaSelecionada) {
          setStatusText(`Peça na mão: ${pecaSelecionada.title}. Arraste ou toque na silhueta correspondente.`);
        }
      }

      setPecaArrastadaId(null);
      setSlotSobPonteiroId(null);
      pontoInicialArrastoRef.current = null;
    };

    window.addEventListener('pointermove', executarMoverPonteiro);
    window.addEventListener('pointerup', executarSoltarPonteiro);
    window.addEventListener('pointercancel', executarSoltarPonteiro);

    return () => {
      window.removeEventListener('pointermove', executarMoverPonteiro);
      window.removeEventListener('pointerup', executarSoltarPonteiro);
      window.removeEventListener('pointercancel', executarSoltarPonteiro);
    };
  }, [pecaArrastadaId, executarTentarEncaixarPeca, pieces]);

  const executarIniciarArrastoPeca = (evento: React.PointerEvent<HTMLButtonElement>, pecaId: string) => {
    evento.preventDefault();
    onTap();
    audio.playSoftTap();
    pontoInicialArrastoRef.current = { x: evento.clientX, y: evento.clientY };
    setPosicaoPonteiro({ x: evento.clientX, y: evento.clientY });
    setPecaArrastadaId(pecaId);
    setSelectedPieceId(pecaId);
    const piece = pieces.find((p) => p.id === pecaId);
    if (piece) {
      setStatusText(`Arrastando: ${piece.title}. Solte sobre a silhueta correspondente no tabuleiro!`);
    }
  };

  const handleSelectSlot = (slotPiece: PegPiece) => {
    if (!selectedPieceId) {
      setStatusText('Arraste uma peça de madeira da bancada abaixo até a silhueta!');
      return;
    }
    executarTentarEncaixarPeca(selectedPieceId, slotPiece.id);
  };

  const executarTrocarVariante = (novaVariante: VarianteQuebraCabeca) => {
    audio.playSoftTap();
    setVarianteAtiva(novaVariante);
    executarEmbaralharTabuleiro(novaVariante);
    setSelectedPieceId(null);
    setPlacedPieceIds([]);
    setStatusText('Pegue uma peça pelo pino de madeira e encaixe no seu lugar.');
  };

  const executarMisturarCards = () => {
    audio.playSoftTap();
    executarEmbaralharTabuleiro(varianteAtiva);
    setSelectedPieceId(null);
    setStatusText('Peças e silhuetas misturadas! Escolha uma peça pelo pino para encaixar.');
  };

  const handleReset = () => {
    audio.playSoftTap();
    executarEmbaralharTabuleiro(varianteAtiva);
    setSelectedPieceId(null);
    setPlacedPieceIds([]);
    setStatusText('Pegue uma peça pelo pino de madeira e encaixe no seu lugar.');
  };

  const unplacedPieces = pecasEmbaralhadas.filter((p) => !placedPieceIds.includes(p.id));

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
              { id: 'animais_veiculos', label: 'Animais & Veículos' },
              { id: 'fazenda', label: 'Fazenda' },
              { id: 'frutas', label: 'Frutas' },
              { id: 'instrumentos', label: 'Música' },
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
            title="Misturar peças e silhuetas"
            aria-label="Misturar peças e silhuetas"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#3E8EBF]" />
            <span>Misturar</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors cursor-pointer"
            title="Reiniciar tabuleiro"
            aria-label="Reiniciar tabuleiro"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide text */}
      <div className="w-full text-center py-2.5 my-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569]">
        {statusText}
      </div>

      {/* The Wooden Board Tray (Tabuleiro de Madeira Maciça) */}
      <div className="w-full my-4 p-5 sm:p-8 bg-[#EFE6DC] border-4 border-[#D8C7B5] rounded-3xl shadow-inner relative overflow-hidden">
        
        {/* Subtle wood grain background lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#8D7B68_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {slotsEmbaralhados.map((piece) => {
            const isPlaced = placedPieceIds.includes(piece.id);
            const estaSobArrasto = slotSobPonteiroId === piece.id;

            return (
              <div
                key={`slot-${piece.id}`}
                data-slot-id={piece.id}
                onClick={() => !isPlaced && handleSelectSlot(piece)}
                className={`min-h-[140px] sm:min-h-[160px] rounded-2xl border-3 flex flex-col items-center justify-center p-3 relative transition-all select-none ${
                  isPlaced
                    ? 'border-[#BCAAA4] bg-[#FAF8F5] shadow-xs cursor-default'
                    : estaSobArrasto
                    ? 'border-dashed border-[#4FA88E] bg-[#E8F8F2] scale-105 ring-4 ring-[#A8E6CF]'
                    : selectedPieceId
                    ? 'border-dashed border-[#8D7B68] bg-[#E5DACE] cursor-pointer hover:scale-102 hover:bg-[#DDD1C3]'
                    : 'border-dashed border-[#BCAAA4] bg-[#E5DACE] cursor-pointer'
                }`}
              >
                {isPlaced ? (
                  /* Placed piece in slot */
                  <div className="flex flex-col items-center justify-center scale-100 animate-fade-in">
                    {modoVisual === 'fotos' ? (
                      <img
                        src={`/fotos/puzzle-${piece.id}.jpg`}
                        alt={piece.title}
                        className="w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-xl border border-[#D8C7B5] shadow-xs"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative">
                        <span className="text-5xl sm:text-6xl drop-shadow-sm">{piece.emoji}</span>
                        {/* Wooden Peg Knob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-[#D4A373] to-[#8C5E35] border-2 border-[#633F1E] shadow-md flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-100 opacity-60" />
                        </div>
                      </div>
                    )}
                    <span className="text-xs font-extrabold text-[#1E293B] mt-2">
                      {piece.title}
                    </span>
                    <span className="text-[10px] text-[#2D6A4F] font-bold flex items-center gap-0.5 mt-0.5">
                      <Check className="w-3 h-3" /> Encaixado
                    </span>
                  </div>
                ) : (
                  /* Silhouetted Cutout */
                  <div className="flex flex-col items-center justify-center opacity-40 pointer-events-none">
                    {modoVisual === 'fotos' ? (
                      <img
                        src={`/fotos/puzzle-${piece.id}.jpg`}
                        alt={`Encaixe de ${piece.title}`}
                        className="w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-xl grayscale mb-1"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-4xl sm:text-5xl grayscale mb-1">
                        {piece.emoji}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[#8D7B68] text-center">
                      Encaixe: {piece.title}
                    </span>
                    <span className="text-[9px] text-[#A89F91]">Solte aqui</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Wooden Pieces with Peg Knobs */}
      <div className="w-full bg-[#F7F3EE] p-4 rounded-2xl border border-[#EDE4DA]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
            Peças para Arrastar pelo Pino ({unplacedPieces.length})
          </span>
          {unplacedPieces.length === 0 && (
            <span className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1 bg-[#E8F8F2] px-3 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5" /> Tabuleiro Completo!
            </span>
          )}
        </div>

        {unplacedPieces.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-4 py-1">
            {unplacedPieces.map((piece) => {
              const isSelected = selectedPieceId === piece.id;
              const estaSendoArrastada = pecaArrastadaId === piece.id;

              return (
                <button
                  key={`piece-${piece.id}`}
                  onPointerDown={(evento) => executarIniciarArrastoPeca(evento, piece.id)}
                  className={`w-28 h-28 rounded-2xl border-3 border-[#C9B39B] bg-gradient-to-br from-[#FFF9F2] to-[#EFE2D3] shadow-md flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing touch-none select-none transition-all hover:scale-105 ${
                    estaSendoArrastada
                      ? 'opacity-30 scale-95'
                      : isSelected
                      ? 'ring-4 ring-[#4FA88E] scale-105'
                      : ''
                  }`}
                  aria-label={piece.title}
                >
                  {modoVisual === 'fotos' ? (
                    <img
                      src={`/fotos/puzzle-${piece.id}.jpg`}
                      alt={piece.title}
                      className="w-22 h-16 object-cover rounded-xl pointer-events-none border border-[#D8C7B5]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative pointer-events-none">
                      <span className="text-4xl">{piece.emoji}</span>
                      {/* Peg handle */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#A06E3B] border border-[#523315] shadow-xs flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-amber-100" />
                      </div>
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#1E293B] mt-1.5 pointer-events-none">
                    {piece.title}
                  </span>
                  <span className="text-[9px] text-[#8D7B68] font-semibold pointer-events-none">
                    {modoVisual === 'fotos' ? 'Arraste para encaixar' : 'Arraste pelo pino'}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xs text-[#2D6A4F] font-bold py-2">
            Excelente percepção espacial e coordenação visomotora!
          </p>
        )}
      </div>

      {/* Peça Flutuante durante o Arrasto */}
      {pecaArrastadaId && (() => {
        const pecaFlutuante = pieces.find((item) => item.id === pecaArrastadaId);
        if (!pecaFlutuante) return null;

        return (
          <div
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-2xl border-3 border-[#4FA88E] bg-gradient-to-br from-[#FFF9F2] to-[#EFE2D3] shadow-2xl flex flex-col items-center justify-center p-2 scale-110"
            style={{ left: `${posicaoPonteiro.x}px`, top: `${posicaoPonteiro.y}px` }}
          >
            {modoVisual === 'fotos' ? (
              <img
                src={`/fotos/puzzle-${pecaFlutuante.id}.jpg`}
                alt={pecaFlutuante.title}
                className="w-22 h-16 object-cover rounded-xl border border-[#D8C7B5]"
              />
            ) : (
              <div className="relative">
                <span className="text-4xl">{pecaFlutuante.emoji}</span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#A06E3B] border border-[#523315] shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-amber-100" />
                </div>
              </div>
            )}
            <span className="text-xs font-bold text-[#1E293B] mt-1.5">
              {pecaFlutuante.title}
            </span>
          </div>
        );
      })()}

    </div>
  );
};
