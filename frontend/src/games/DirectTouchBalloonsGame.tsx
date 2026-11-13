import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Heart, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../components/AudioService.ts';

export type VarianteToqueDireto = 'baloes' | 'bolhas_mar' | 'nuvens_ceu' | 'flores_jardim';

interface Balloon {
  id: number;
  xPercent: number;
  yPercent: number;
  speed: number;
  colorHex: string;
  surpriseEmoji: string;
  surpriseLabel: string;
  size: number;
  popped: boolean;
}

interface DirectTouchBalloonsGameProps {
  varianteInicial?: VarianteToqueDireto;
  onTap: () => void;
  onComplete: () => void;
}

export const DirectTouchBalloonsGame: React.FC<DirectTouchBalloonsGameProps> = ({
  varianteInicial = 'baloes',
  onTap,
  onComplete,
}) => {
  const [varianteAtiva, setVarianteAtiva] = useState<VarianteToqueDireto>(varianteInicial);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [latestSurprise, setLatestSurprise] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const configuracaoVariante: Record<
    VarianteToqueDireto,
    {
      titulo: string;
      contadorLabel: string;
      instrucao: string;
      bgGradiente: string;
      decoracaoEmoji: string;
      iconeInterno: string;
      cores: string[];
      surpresas: { emoji: string; label: string }[];
    }
  > = {
    baloes: {
      titulo: 'Balões Pastéis: Bichinhos Surpresa',
      contadorLabel: 'Balões Estourados',
      instrucao: 'Toque ou clique em qualquer balão que estiver flutuando para revelar um bichinho amigo.',
      bgGradiente: 'from-[#E0F2FE]/40 via-[#FAF8F5] to-[#E8F8F2]/40 border-[#D4ECF9]',
      decoracaoEmoji: '☁️',
      iconeInterno: '🎈',
      cores: ['#A8E6CF', '#A0D2EB', '#D1C4E9', '#FEE2E2', '#FEF3C7', '#EDE4DA'],
      surpresas: [
        { emoji: '🐱', label: 'Gatinho Carinhoso' },
        { emoji: '🐼', label: 'Panda Fofinho' },
        { emoji: '🐰', label: 'Coelhinho Saltitante' },
        { emoji: '🐶', label: 'Cachorrinho Amigo' },
        { emoji: '🐻', label: 'Ursinho Abraço' },
        { emoji: '🐨', label: 'Coala Tranquilo' },
      ],
    },
    bolhas_mar: {
      titulo: 'Bolhas de Sabão no Fundo do Mar',
      contadorLabel: 'Bolhas Tocadas',
      instrucao: 'Toque nas bolhas cristalinas do oceano para descobrir os animais marinhos.',
      bgGradiente: 'from-[#CFFAFE]/60 via-[#E0F2FE]/50 to-[#D1FAE5]/40 border-[#A5F3FC]',
      decoracaoEmoji: '🌊',
      iconeInterno: '🫧',
      cores: ['#BAE6FD', '#99F6E4', '#A5F3FC', '#C7D2FE', '#E0F2FE', '#A7F3D0'],
      surpresas: [
        { emoji: '🐠', label: 'Peixinho Colorido' },
        { emoji: '🐙', label: 'Polvo Sorridente' },
        { emoji: '🐢', label: 'Tartaruga Marinha' },
        { emoji: '🐬', label: 'Golfinho Brincalhão' },
        { emoji: '🦀', label: 'Caranguejo Amigável' },
        { emoji: '🐳', label: 'Baleia Serena' },
      ],
    },
    nuvens_ceu: {
      titulo: 'Nuvens Mágicas & Céu Sereno',
      contadorLabel: 'Nuvens Abertas',
      instrucao: 'Toque nas nuvens fofinhas para revelar o sol, arco-íris e passarinhos no céu.',
      bgGradiente: 'from-[#DBEAFE]/50 via-[#FEF9C3]/30 to-[#EDE9FE]/50 border-[#BFDBFE]',
      decoracaoEmoji: '⭐',
      iconeInterno: '☁️',
      cores: ['#E0F2FE', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#DCFCE7', '#F1F5F9'],
      surpresas: [
        { emoji: '🌈', label: 'Arco-Íris Colorido' },
        { emoji: '☀️', label: 'Sol Radiante' },
        { emoji: '🐦', label: 'Passarinho Cantador' },
        { emoji: '🦋', label: 'Borboleta Azul' },
        { emoji: '🌟', label: 'Estrela Dourada' },
        { emoji: '🌙', label: 'Lua Calminha' },
      ],
    },
    flores_jardim: {
      titulo: 'Jardim Sensorial: Flores Desabrochando',
      contadorLabel: 'Flores Abertas',
      instrucao: 'Toque nos botões florais flutuantes para fazer as flores do jardim desabrocharem.',
      bgGradiente: 'from-[#ECFDF5]/60 via-[#FEFCE8]/50 to-[#FDF2F8]/50 border-[#A8E6CF]',
      decoracaoEmoji: '🍃',
      iconeInterno: '🌱',
      cores: ['#FBCFE8', '#FDE68A', '#A7F3D0', '#DDD6FE', '#FED7AA', '#FECDD3'],
      surpresas: [
        { emoji: '🌻', label: 'Girassol Alegre' },
        { emoji: '🌷', label: 'Tulipa Rosa' },
        { emoji: '🌺', label: 'Flor de Hibisco' },
        { emoji: '🌼', label: 'Margarida Branca' },
        { emoji: '🐝', label: 'Abelhinha Amiga' },
        { emoji: '🐞', label: 'Joaninha da Sorte' },
      ],
    },
  };

  const configAtual = configuracaoVariante[varianteAtiva];

  const spawnBalloon = (id: number, modo: VarianteToqueDireto = varianteAtiva): Balloon => {
    const cfg = configuracaoVariante[modo];
    const surprise = cfg.surpresas[Math.floor(Math.random() * cfg.surpresas.length)];
    return {
      id,
      xPercent: 12 + Math.random() * 72,
      yPercent: 105,
      speed: 0.12 + Math.random() * 0.12,
      colorHex: cfg.cores[Math.floor(Math.random() * cfg.cores.length)],
      surpriseEmoji: surprise.emoji,
      surpriseLabel: surprise.label,
      size: 75 + Math.random() * 25,
      popped: false,
    };
  };

  useEffect(() => {
    setVarianteAtiva(varianteInicial);
    setPoppedCount(0);
    setLatestSurprise(null);
    const initial: Balloon[] = [];
    for (let i = 0; i < 5; i++) {
      const b = spawnBalloon(i, varianteInicial);
      b.yPercent = 20 + i * 16;
      initial.push(b);
    }
    setBalloons(initial);
  }, [varianteInicial]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popped) return b;
          const nextY = b.yPercent - b.speed;
          if (nextY < -15) {
            return spawnBalloon(b.id, varianteAtiva);
          }
          return { ...b, yPercent: nextY };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, [varianteAtiva]);

  const handlePop = (balloon: Balloon) => {
    if (balloon.popped) return;

    onTap();
    audio.playPop();
    audio.playChime(poppedCount % 5);

    try {
      confetti({
        particleCount: 16,
        spread: 45,
        origin: {
          x: balloon.xPercent / 100,
          y: Math.max(0.1, Math.min(0.9, balloon.yPercent / 100)),
        },
        colors: configAtual.cores,
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback
    }

    setLatestSurprise(`${balloon.surpriseEmoji} ${balloon.surpriseLabel}`);

    setBalloons((prev) =>
      prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
    );

    const newCount = poppedCount + 1;
    setPoppedCount(newCount);

    if (newCount % 10 === 0) {
      audio.playSuccessArpeggio();
      onComplete();
    }

    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) => (b.id === balloon.id ? spawnBalloon(b.id, varianteAtiva) : b))
      );
    }, 1200);
  };

  const executarTrocarVariante = (novaVariante: VarianteToqueDireto) => {
    audio.playSoftTap();
    setVarianteAtiva(novaVariante);
    setPoppedCount(0);
    setLatestSurprise(null);
    const refreshed: Balloon[] = [];
    for (let i = 0; i < 5; i++) {
      const b = spawnBalloon(i, novaVariante);
      b.yPercent = 20 + i * 16;
      refreshed.push(b);
    }
    setBalloons(refreshed);
  };

  const handleReset = () => {
    audio.playSoftTap();
    setPoppedCount(0);
    setLatestSurprise(null);
    const refreshed: Balloon[] = [];
    for (let i = 0; i < 5; i++) {
      const b = spawnBalloon(i, varianteAtiva);
      b.yPercent = 20 + i * 16;
      refreshed.push(b);
    }
    setBalloons(refreshed);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[540px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#EDE4DA] shadow-xs select-none">

      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EDE4DA]">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">
            {configAtual.titulo}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap bg-[#F7F3EE] p-1 rounded-2xl border border-[#EDE4DA]">
            {([
              { id: 'baloes', label: 'Balões' },
              { id: 'bolhas_mar', label: 'Bolhas do Mar' },
              { id: 'nuvens_ceu', label: 'Nuvens' },
              { id: 'flores_jardim', label: 'Jardim' },
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

          <div className="bg-[#E8F8F2] text-[#2D6A4F] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#4FA88E]" />
            <span>{configAtual.contadorLabel}: {poppedCount}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors cursor-pointer"
            title="Reiniciar"
            aria-label="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reassuring Instruction Banner */}
      <div className="w-full text-center py-2 bg-[#F7F3EE]/80 rounded-2xl border border-[#EDE4DA] text-xs sm:text-sm font-semibold text-[#475569] my-2">
        {latestSurprise ? (
          <span className="text-[#2D6A4F] font-extrabold inline-block transition-transform duration-300 ease-out">
            Você revelou: {latestSurprise}! ⭐
          </span>
        ) : (
          <span>{configAtual.instrucao}</span>
        )}
      </div>

      {/* Sky / Stage Canvas */}
      <div
        ref={containerRef}
        className={`w-full h-[360px] sm:h-[400px] relative overflow-hidden rounded-3xl bg-gradient-to-b ${configAtual.bgGradiente} border-2 shadow-inner my-2 cursor-pointer`}
      >
        {/* Soft background elements */}
        <div className="absolute top-4 left-8 opacity-30 text-5xl pointer-events-none">{configAtual.decoracaoEmoji}</div>
        <div className="absolute top-16 right-12 opacity-30 text-6xl pointer-events-none">{configAtual.decoracaoEmoji}</div>
        <div className="absolute bottom-6 left-1/3 opacity-20 text-4xl pointer-events-none">{configAtual.decoracaoEmoji}</div>

        {/* Floating Elements */}
        {balloons.map((b) => {
          if (b.popped) {
            return (
              <div
                key={`popped-${b.id}`}
                className="absolute flex flex-col items-center justify-center animate-scale-up pointer-events-none"
                style={{
                  left: `${b.xPercent}%`,
                  top: `${b.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="text-5xl drop-shadow-sm">{b.surpriseEmoji}</span>
                <span className="text-[11px] font-extrabold text-[#2D6A4F] bg-white/90 px-2 py-0.5 rounded-full mt-1 border border-[#A8E6CF]">
                  {b.surpriseLabel}
                </span>
              </div>
            );
          }

          return (
            <button
              key={`balloon-${b.id}`}
              onClick={() => handlePop(b)}
              className="absolute group focus:outline-none cursor-pointer transition-transform hover:scale-110 active:scale-95"
              style={{
                left: `${b.xPercent}%`,
                top: `${b.yPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: `${b.size}px`,
                height: `${varianteAtiva === 'baloes' ? b.size * 1.25 : b.size}px`,
              }}
              aria-label="Elemento flutuante. Toque para interagir"
            >
              <div
                className={`w-full h-full ${
                  varianteAtiva === 'baloes'
                    ? 'rounded-[50%_50%_50%_50%/40%_40%_60%_60%]'
                    : 'rounded-full'
                } shadow-md border-2 border-white/70 relative flex items-center justify-center transition-all`}
                style={{ backgroundColor: b.colorHex }}
              >
                <div className="absolute top-2 left-3 w-4 h-6 rounded-full bg-white/50 -rotate-20" />
                <span className="text-2xl opacity-75">{configAtual.iconeInterno}</span>

                {varianteAtiva === 'baloes' && (
                  <>
                    <div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: b.colorHex }}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300/60" />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer tips */}
      <div className="w-full flex items-center justify-between text-xs font-medium text-[#64748B] pt-2">
        <span className="flex items-center gap-1">
          <Smile className="w-3.5 h-3.5 text-[#4FA88E]" /> Estímulo de causa e efeito com alta previsibilidade e som suave.
        </span>
        <span className="hidden sm:inline">Ideal para início de sessão ou relaxamento</span>
      </div>

    </div>
  );
};
