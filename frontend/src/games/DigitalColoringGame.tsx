import React, { useState } from 'react';
import { Palette, RotateCcw, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { audio } from '../components/AudioService.ts';

interface ColorOption {
  name: string;
  hex: string;
}

interface DigitalColoringGameProps {
  onTap: () => void;
  onComplete: () => void;
}

export const DigitalColoringGame: React.FC<DigitalColoringGameProps> = ({
  onTap,
  onComplete,
}) => {
  const palette: ColorOption[] = [
    { name: 'Verde-Menta', hex: '#A8E6CF' },
    { name: 'Azul-Céu', hex: '#A0D2EB' },
    { name: 'Lavanda', hex: '#D1C4E9' },
    { name: 'Amarelo-Sol', hex: '#FEF3C7' },
    { name: 'Rosa-Pastel', hex: '#FCE7F3' },
    { name: 'Bege-Quente', hex: '#EDE4DA' },
    { name: 'Turquesa', hex: '#99F6E4' },
    { name: 'Branco-Neve', hex: '#FFFFFF' },
  ];

  const [selectedColor, setSelectedColor] = useState<string>(palette[0].hex);
  const [activeTheme, setActiveTheme] = useState<'dino' | 'borboleta'>('dino');

  // SVG Area fills state
  const [fills, setFills] = useState<Record<string, string>>({
    'sky': '#FFFFFF',
    'dino-body': '#FFFFFF',
    'dino-spots': '#FFFFFF',
    'dino-belly': '#FFFFFF',
    'ground': '#FFFFFF',
    'sun': '#FFFFFF',
    'wings-left': '#FFFFFF',
    'wings-right': '#FFFFFF',
    'butterfly-body': '#FFFFFF',
    'flower-center': '#FFFFFF',
    'flower-petals': '#FFFFFF',
  });

  const handleSelectArea = (areaKey: string) => {
    onTap();
    audio.playSoftTap();
    audio.playChime(Object.values(fills).filter((f) => f !== '#FFFFFF').length % 5);

    setFills((prev) => {
      const next = { ...prev, [areaKey]: selectedColor };
      // Check if majority of current drawing is painted
      const filledCount = Object.values(next).filter((f) => f !== '#FFFFFF').length;
      if (filledCount >= 4) {
        onComplete();
      }
      return next;
    });
  };

  const handleReset = () => {
    audio.playSoftTap();
    setFills({
      'sky': '#FFFFFF',
      'dino-body': '#FFFFFF',
      'dino-spots': '#FFFFFF',
      'dino-belly': '#FFFFFF',
      'ground': '#FFFFFF',
      'sun': '#FFFFFF',
      'wings-left': '#FFFFFF',
      'wings-right': '#FFFFFF',
      'butterfly-body': '#FFFFFF',
      'flower-center': '#FFFFFF',
      'flower-petals': '#FFFFFF',
    });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[540px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            Pintura Mágica por Toque
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            <button
              onClick={() => {
                audio.playSoftTap();
                setActiveTheme('dino');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTheme === 'dino' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
              }`}
            >
              Dinossauro
            </button>
            <button
              onClick={() => {
                audio.playSoftTap();
                setActiveTheme('borboleta');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTheme === 'borboleta' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
              }`}
            >
              Borboleta
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors"
            title="Limpar cores"
            aria-label="Limpar cores"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="w-full text-center py-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569] my-2">
        Escolha uma cor abaixo e dê um toque na parte do desenho que quer colorir! Sem borrar.
      </div>

      {/* Coloring Interactive Canvas (Vector SVG Line Art) */}
      <div className="w-full my-3 p-4 bg-white rounded-3xl border-2 border-[#EDE4DA] flex items-center justify-center shadow-inner overflow-hidden">
        {activeTheme === 'dino' ? (
          <svg
            viewBox="0 0 500 320"
            className="w-full max-w-[460px] h-[280px] sm:h-[320px] select-none transition-colors"
          >
            {/* Sky background area */}
            <rect
              x="0"
              y="0"
              width="500"
              height="260"
              fill={fills['sky']}
              stroke="#CBD5E1"
              strokeWidth="2"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('sky')}
            />

            {/* Sun */}
            <circle
              cx="80"
              cy="70"
              r="40"
              fill={fills['sun']}
              stroke="#475569"
              strokeWidth="3"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('sun')}
            />

            {/* Ground / Grass */}
            <path
              d="M 0,260 Q 150,240 280,265 T 500,255 L 500,320 L 0,320 Z"
              fill={fills['ground']}
              stroke="#475569"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('ground')}
            />

            {/* Dinosaur Body (Curved friendly Brontosaurus) */}
            <path
              d="M 180,260 C 170,220 180,140 230,100 C 240,90 270,70 300,75 C 315,78 320,95 310,105 C 290,120 275,145 270,180 C 290,175 350,180 380,210 C 410,240 390,265 370,260 L 350,260 C 350,280 330,280 330,260 L 260,260 C 260,280 240,280 240,260 Z"
              fill={fills['dino-body']}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-300 hover:opacity-95"
              onClick={() => handleSelectArea('dino-body')}
            />

            {/* Dinosaur Belly */}
            <path
              d="M 270,195 C 285,190 320,195 340,220 C 350,235 340,250 320,250 C 290,250 270,225 270,195 Z"
              fill={fills['dino-belly']}
              stroke="#475569"
              strokeWidth="3"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('dino-belly')}
            />

            {/* Dinosaur Spots */}
            <circle
              cx="310"
              cy="165"
              r="10"
              fill={fills['dino-spots']}
              stroke="#334155"
              strokeWidth="2.5"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('dino-spots')}
            />
            <circle
              cx="335"
              cy="190"
              r="8"
              fill={fills['dino-spots']}
              stroke="#334155"
              strokeWidth="2.5"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('dino-spots')}
            />

            {/* Friendly Eye & Smile */}
            <circle cx="295" cy="85" r="4" fill="#1E293B" />
            <circle cx="296" cy="83" r="1.5" fill="#FFFFFF" />
            <path d="M 305,95 Q 300,102 292,98" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 500 320"
            className="w-full max-w-[460px] h-[280px] sm:h-[320px] select-none transition-colors"
          >
            {/* Background */}
            <rect
              x="0"
              y="0"
              width="500"
              height="320"
              fill={fills['sky']}
              stroke="#CBD5E1"
              strokeWidth="2"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('sky')}
            />

            {/* Left Wings */}
            <path
              d="M 230,140 C 160,80 120,130 150,180 C 110,210 160,260 230,210 Z"
              fill={fills['wings-left']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('wings-left')}
            />

            {/* Right Wings */}
            <path
              d="M 270,140 C 340,80 380,130 350,180 C 390,210 340,260 270,210 Z"
              fill={fills['wings-right']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('wings-right')}
            />

            {/* Butterfly Center Body */}
            <ellipse
              cx="250"
              cy="175"
              rx="14"
              ry="45"
              fill={fills['butterfly-body']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('butterfly-body')}
            />

            {/* Antennae */}
            <path d="M 245,130 Q 235,110 220,115" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 255,130 Q 265,110 280,115" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="220" cy="115" r="4" fill="#334155" />
            <circle cx="280" cy="115" r="4" fill="#334155" />
          </svg>
        )}
      </div>

      {/* Therapeutic Palette Selector */}
      <div className="w-full bg-[#F7F3EE] p-3 sm:p-4 rounded-2xl border border-[#EDE4DA]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Paleta de Cores Suaves (Toque para escolher)
          </span>
          <span className="text-xs font-bold text-[#1E293B]">
            Cor Atual: {palette.find((p) => p.hex === selectedColor)?.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-1">
          {palette.map((color) => {
            const isSelected = selectedColor === color.hex;

            return (
              <button
                key={color.name}
                onClick={() => {
                  audio.playSoftTap();
                  setSelectedColor(color.hex);
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 transition-all cursor-pointer shadow-xs flex items-center justify-center ${
                  isSelected ? 'ring-4 ring-[#4FA88E] scale-110 border-white' : 'border-[#CBD5E1] hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Selecionar cor ${color.name}`}
              >
                {isSelected && <Check className="w-5 h-5 text-[#2C3E50] drop-shadow-xs" />}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
