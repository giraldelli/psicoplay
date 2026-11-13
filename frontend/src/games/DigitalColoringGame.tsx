import React, { useState, useEffect } from 'react';
import { Palette, RotateCcw, Check, Shuffle } from 'lucide-react';
import { audio } from '../components/AudioService.ts';
import { embaralharLista } from '../utils/embaralharLista.ts';

export type VarianteColorir = 'dino' | 'borboleta' | 'foguete' | 'casinha';

interface ColorOption {
  name: string;
  hex: string;
}

interface DigitalColoringGameProps {
  varianteInicial?: VarianteColorir;
  onTap: () => void;
  onComplete: () => void;
}

const ESTADO_INICIAL_CORES: Record<string, string> = {
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
  'space-bg': '#FFFFFF',
  'rocket-body': '#FFFFFF',
  'rocket-nose': '#FFFFFF',
  'rocket-fins': '#FFFFFF',
  'rocket-window': '#FFFFFF',
  'planet-body': '#FFFFFF',
  'planet-ring': '#FFFFFF',
  'moon': '#FFFFFF',
  'house-wall': '#FFFFFF',
  'house-roof': '#FFFFFF',
  'house-door': '#FFFFFF',
  'house-window': '#FFFFFF',
  'tree-trunk': '#FFFFFF',
  'tree-crown': '#FFFFFF',
};

export const DigitalColoringGame: React.FC<DigitalColoringGameProps> = ({
  varianteInicial = 'dino',
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

  const [paletaEmbaralhada, setPaletaEmbaralhada] = useState<ColorOption[]>(() =>
    embaralharLista(palette)
  );
  const [selectedColor, setSelectedColor] = useState<string>(palette[0].hex);
  const [activeTheme, setActiveTheme] = useState<VarianteColorir>(varianteInicial);
  const [fills, setFills] = useState<Record<string, string>>(ESTADO_INICIAL_CORES);

  useEffect(() => {
    setActiveTheme(varianteInicial);
    setPaletaEmbaralhada(embaralharLista(palette));
    setFills(ESTADO_INICIAL_CORES);
  }, [varianteInicial]);

  const titulosPorTema: Record<VarianteColorir, string> = {
    dino: 'Pintura por Toque: Dinossauro Amigável',
    borboleta: 'Pintura por Toque: Borboleta no Jardim',
    foguete: 'Pintura por Toque: Viagem Espacial & Planetas',
    casinha: 'Pintura por Toque: Casinha & Árvore Feliz',
  };

  const handleSelectArea = (areaKey: string) => {
    onTap();
    audio.playSoftTap();
    audio.playChime(Object.values(fills).filter((f) => f !== '#FFFFFF').length % 5);

    setFills((prev) => {
      const next = { ...prev, [areaKey]: selectedColor };
      const filledCount = Object.values(next).filter((f) => f !== '#FFFFFF').length;
      if (filledCount >= 4) {
        onComplete();
      }
      return next;
    });
  };

  const executarTrocarTema = (novoTema: VarianteColorir) => {
    audio.playSoftTap();
    setActiveTheme(novoTema);
    setPaletaEmbaralhada(embaralharLista(palette));
    setFills(ESTADO_INICIAL_CORES);
  };

  const executarMisturarCores = () => {
    audio.playSoftTap();
    setPaletaEmbaralhada((coresAtuais) => embaralharLista(coresAtuais));
  };

  const handleReset = () => {
    audio.playSoftTap();
    setPaletaEmbaralhada(embaralharLista(palette));
    setFills(ESTADO_INICIAL_CORES);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[540px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs">
      
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            {titulosPorTema[activeTheme]}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            {([
              { id: 'dino', label: 'Dinossauro' },
              { id: 'borboleta', label: 'Borboleta' },
              { id: 'foguete', label: 'Foguete' },
              { id: 'casinha', label: 'Casinha' },
            ] as const).map((aba) => (
              <button
                key={aba.id}
                onClick={() => executarTrocarTema(aba.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTheme === aba.id ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors cursor-pointer"
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
        {activeTheme === 'dino' && (
          <svg
            viewBox="0 0 500 320"
            className="w-full max-w-[460px] h-[280px] sm:h-[320px] select-none transition-colors"
          >
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
            <path
              d="M 0,260 Q 150,240 280,265 T 500,255 L 500,320 L 0,320 Z"
              fill={fills['ground']}
              stroke="#475569"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('ground')}
            />
            <path
              d="M 180,260 C 170,220 180,140 230,100 C 240,90 270,70 300,75 C 315,78 320,95 310,105 C 290,120 275,145 270,180 C 290,175 350,180 380,210 C 410,240 390,265 370,260 L 350,260 C 350,280 330,280 330,260 L 260,260 C 260,280 240,280 240,260 Z"
              fill={fills['dino-body']}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-300 hover:opacity-95"
              onClick={() => handleSelectArea('dino-body')}
            />
            <path
              d="M 270,195 C 285,190 320,195 340,220 C 350,235 340,250 320,250 C 290,250 270,225 270,195 Z"
              fill={fills['dino-belly']}
              stroke="#475569"
              strokeWidth="3"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('dino-belly')}
            />
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
            <circle cx="295" cy="85" r="4" fill="#1E293B" />
            <circle cx="296" cy="83" r="1.5" fill="#FFFFFF" />
            <path d="M 305,95 Q 300,102 292,98" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        )}

        {activeTheme === 'borboleta' && (
          <svg
            viewBox="0 0 500 320"
            className="w-full max-w-[460px] h-[280px] sm:h-[320px] select-none transition-colors"
          >
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
            <path
              d="M 230,140 C 160,80 120,130 150,180 C 110,210 160,260 230,210 Z"
              fill={fills['wings-left']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('wings-left')}
            />
            <path
              d="M 270,140 C 340,80 380,130 350,180 C 390,210 340,260 270,210 Z"
              fill={fills['wings-right']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('wings-right')}
            />
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
            <path d="M 245,130 Q 235,110 220,115" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 255,130 Q 265,110 280,115" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="220" cy="115" r="4" fill="#334155" />
            <circle cx="280" cy="115" r="4" fill="#334155" />
          </svg>
        )}

        {activeTheme === 'foguete' && (
          <svg
            viewBox="0 0 500 320"
            className="w-full max-w-[460px] h-[280px] sm:h-[320px] select-none transition-colors"
          >
            {/* Céu Espacial */}
            <rect
              x="0"
              y="0"
              width="500"
              height="320"
              fill={fills['space-bg']}
              stroke="#CBD5E1"
              strokeWidth="2"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('space-bg')}
            />
            {/* Lua */}
            <circle
              cx="90"
              cy="80"
              r="36"
              fill={fills['moon']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('moon')}
            />
            {/* Planeta Saturno */}
            <ellipse
              cx="400"
              cy="95"
              rx="55"
              ry="14"
              fill={fills['planet-ring']}
              stroke="#334155"
              strokeWidth="3"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('planet-ring')}
            />
            <circle
              cx="400"
              cy="95"
              r="28"
              fill={fills['planet-body']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('planet-body')}
            />
            {/* Asas do Foguete */}
            <path
              d="M 210,200 L 175,245 L 215,235 Z M 290,200 L 325,245 L 285,235 Z"
              fill={fills['rocket-fins']}
              stroke="#334155"
              strokeWidth="3.5"
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('rocket-fins')}
            />
            {/* Corpo do Foguete */}
            <rect
              x="210"
              y="105"
              width="80"
              height="130"
              rx="20"
              fill={fills['rocket-body']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-95"
              onClick={() => handleSelectArea('rocket-body')}
            />
            {/* Ponta do Foguete */}
            <path
              d="M 210,115 L 250,50 L 290,115 Z"
              fill={fills['rocket-nose']}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('rocket-nose')}
            />
            {/* Janela Escotilha */}
            <circle
              cx="250"
              cy="160"
              r="22"
              fill={fills['rocket-window']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('rocket-window')}
            />
          </svg>
        )}

        {activeTheme === 'casinha' && (
          <svg
            viewBox="0 0 500 320"
            className="w-full max-w-[460px] h-[280px] sm:h-[320px] select-none transition-colors"
          >
            {/* Céu */}
            <rect
              x="0"
              y="0"
              width="500"
              height="255"
              fill={fills['sky']}
              stroke="#CBD5E1"
              strokeWidth="2"
              className="cursor-pointer transition-colors duration-300"
              onClick={() => handleSelectArea('sky')}
            />
            {/* Sol */}
            <circle
              cx="75"
              cy="65"
              r="34"
              fill={fills['sun']}
              stroke="#334155"
              strokeWidth="3"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('sun')}
            />
            {/* Gramado */}
            <rect
              x="0"
              y="255"
              width="500"
              height="65"
              fill={fills['ground']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('ground')}
            />
            {/* Parede da Casinha */}
            <rect
              x="120"
              y="140"
              width="160"
              height="115"
              fill={fills['house-wall']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-95"
              onClick={() => handleSelectArea('house-wall')}
            />
            {/* Telhado */}
            <path
              d="M 100,140 L 200,65 L 300,140 Z"
              fill={fills['house-roof']}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('house-roof')}
            />
            {/* Porta */}
            <rect
              x="150"
              y="185"
              width="42"
              height="70"
              rx="6"
              fill={fills['house-door']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('house-door')}
            />
            {/* Janela */}
            <rect
              x="215"
              y="165"
              width="42"
              height="42"
              rx="6"
              fill={fills['house-window']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('house-window')}
            />
            {/* Tronco da Árvore */}
            <rect
              x="375"
              y="185"
              width="28"
              height="70"
              fill={fills['tree-trunk']}
              stroke="#334155"
              strokeWidth="3.5"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('tree-trunk')}
            />
            {/* Copa da Árvore */}
            <circle
              cx="389"
              cy="145"
              r="52"
              fill={fills['tree-crown']}
              stroke="#334155"
              strokeWidth="4"
              className="cursor-pointer transition-colors duration-300 hover:opacity-90"
              onClick={() => handleSelectArea('tree-crown')}
            />
          </svg>
        )}
      </div>

      {/* Therapeutic Palette Selector */}
      <div className="w-full bg-[#F7F3EE] p-3 sm:p-4 rounded-2xl border border-[#EDE4DA]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Paleta de Cores Suaves (Toque para escolher)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1E293B]">
              Cor Atual: {palette.find((p) => p.hex === selectedColor)?.name}
            </span>
            <button
              onClick={executarMisturarCores}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#EFEAE2] text-[#1E293B] border border-[#EDE4DA] text-xs font-bold transition-colors cursor-pointer"
              title="Misturar cores da paleta"
              aria-label="Misturar cores da paleta"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#3E8EBF]" />
              <span>Misturar</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-1">
          {paletaEmbaralhada.map((color) => {
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
