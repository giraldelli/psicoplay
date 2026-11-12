import React, { useState } from 'react';
import { RotateCcw, Check, Sparkles, Trophy } from 'lucide-react';
import { audio } from '../components/AudioService.ts';

interface PegPiece {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgHex: string;
  description: string;
}

interface WoodenPegPuzzleGameProps {
  onTap: () => void;
  onMistake: () => void;
  onComplete: () => void;
}

export const WoodenPegPuzzleGame: React.FC<WoodenPegPuzzleGameProps> = ({
  onTap,
  onMistake,
  onComplete,
}) => {
  const pieces: PegPiece[] = [
    { id: 'leao', title: 'Leãozinho', emoji: '🦁', color: '#D97706', bgHex: '#FEF3C7', description: 'O rei da floresta, todo amarelinho' },
    { id: 'carro', title: 'Carro de Passeio', emoji: '🚗', color: '#DC2626', bgHex: '#FEE2E2', description: 'Anda nas ruas e faz bi-bi' },
    { id: 'elefante', title: 'Elefantinho', emoji: '🐘', color: '#4B5563', bgHex: '#F3F4F6', description: 'Tem uma tromba bem comprida' },
    { id: 'barco', title: 'Barquinho a Vela', emoji: '⛵', color: '#0284C7', bgHex: '#E0F2FE', description: 'Navega suave pelas ondas do mar' },
  ];

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [placedPieceIds, setPlacedPieceIds] = useState<string[]>([]);
  const [statusText, setStatusText] = useState('Pegue uma peça pelo pino de madeira e encaixe no seu lugar.');

  const handleSelectPiece = (id: string) => {
    onTap();
    audio.playSoftTap();
    setSelectedPieceId(id);
    const piece = pieces.find((p) => p.id === id);
    if (piece) {
      setStatusText(`Peça na mão: ${piece.title}. Encontre a silhueta no tabuleiro de madeira.`);
    }
  };

  const handleSelectSlot = (slotPiece: PegPiece) => {
    if (!selectedPieceId) {
      setStatusText('Primeiro selecione uma peça de madeira na bancada abaixo!');
      return;
    }

    onTap();
    if (selectedPieceId === slotPiece.id) {
      audio.playSnap();
      audio.playChime(placedPieceIds.length);
      const updated = [...placedPieceIds, slotPiece.id];
      setPlacedPieceIds(updated);
      setSelectedPieceId(null);
      setStatusText(`Encaixe perfeito com o pino! Muito bem.`);

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
  };

  const handleReset = () => {
    audio.playSoftTap();
    setSelectedPieceId(null);
    setPlacedPieceIds([]);
    setStatusText('Pegue uma peça pelo pino de madeira e encaixe no seu lugar.');
  };

  const unplacedPieces = pieces.filter((p) => !placedPieceIds.includes(p.id));

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            Quebra-cabeças de Madeira com Pino
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors"
          title="Reiniciar tabuleiro"
          aria-label="Reiniciar tabuleiro"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
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
          {pieces.map((piece) => {
            const isPlaced = placedPieceIds.includes(piece.id);

            return (
              <div
                key={`slot-${piece.id}`}
                onClick={() => !isPlaced && handleSelectSlot(piece)}
                className={`min-h-[140px] sm:min-h-[160px] rounded-2xl border-3 flex flex-col items-center justify-center p-3 relative transition-all select-none ${
                  isPlaced
                    ? 'border-[#BCAAA4] bg-[#FAF8F5] shadow-xs cursor-default'
                    : selectedPieceId
                    ? 'border-dashed border-[#8D7B68] bg-[#E5DACE] cursor-pointer hover:scale-102 hover:bg-[#DDD1C3] animate-pulse'
                    : 'border-dashed border-[#BCAAA4] bg-[#E5DACE] cursor-pointer'
                }`}
              >
                {isPlaced ? (
                  /* Placed wooden piece in slot with realistic peg knob */
                  <div className="flex flex-col items-center justify-center scale-100 animate-fade-in">
                    <div className="relative">
                      <span className="text-5xl sm:text-6xl drop-shadow-sm">{piece.emoji}</span>
                      {/* Wooden Peg Knob */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-[#D4A373] to-[#8C5E35] border-2 border-[#633F1E] shadow-md flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-100 opacity-60" />
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#1E293B] mt-2">
                      {piece.title}
                    </span>
                    <span className="text-[10px] text-[#2D6A4F] font-bold flex items-center gap-0.5 mt-0.5">
                      <Check className="w-3 h-3" /> Encaixado
                    </span>
                  </div>
                ) : (
                  /* Silhouetted Cutout */
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <span className="text-4xl sm:text-5xl grayscale mb-1">
                      {piece.emoji}
                    </span>
                    <span className="text-[11px] font-bold text-[#8D7B68] text-center">
                      Encaixe do {piece.title}
                    </span>
                    <span className="text-[9px] text-[#A89F91]">Silhueta</span>
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
            Peças para Pegar pelo Pino ({unplacedPieces.length})
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

              return (
                <button
                  key={`piece-${piece.id}`}
                  onClick={() => handleSelectPiece(piece.id)}
                  className={`w-28 h-28 rounded-2xl border-3 border-[#C9B39B] bg-gradient-to-br from-[#FFF9F2] to-[#EFE2D3] shadow-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    isSelected ? 'ring-4 ring-[#4FA88E] scale-110' : ''
                  }`}
                  aria-label={piece.title}
                >
                  <div className="relative">
                    <span className="text-4xl">{piece.emoji}</span>
                    {/* Peg handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#A06E3B] border border-[#523315] shadow-xs flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-amber-100" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1E293B] mt-1.5">
                    {piece.title}
                  </span>
                  <span className="text-[9px] text-[#8D7B68] font-semibold">Pino de Pegada</span>
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

    </div>
  );
};
