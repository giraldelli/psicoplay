import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Heart, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../components/AudioService.ts';

interface Balloon {
  id: number;
  xPercent: number; // 10% to 85%
  yPercent: number;
  speed: number;
  colorHex: string;
  surpriseEmoji: string;
  surpriseLabel: string;
  size: number;
  popped: boolean;
}

interface DirectTouchBalloonsGameProps {
  onTap: () => void;
  onComplete: () => void;
}

export const DirectTouchBalloonsGame: React.FC<DirectTouchBalloonsGameProps> = ({
  onTap,
  onComplete,
}) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [latestSurprise, setLatestSurprise] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = ['#A8E6CF', '#A0D2EB', '#D1C4E9', '#FEE2E2', '#FEF3C7', '#EDE4DA'];
  const surprises = [
    { emoji: '🐱', label: 'Gatinho Carinhoso' },
    { emoji: '🐼', label: 'Panda Fofinho' },
    { emoji: '🐰', label: 'Coelhinho Saltitante' },
    { emoji: '⭐', label: 'Estrelinha Brilhante' },
    { emoji: '🐶', label: 'Cachorrinho Amigo' },
    { emoji: '🌸', label: 'Florzinha Perfumada' },
  ];

  const spawnBalloon = (id: number): Balloon => {
    const surprise = surprises[Math.floor(Math.random() * surprises.length)];
    return {
      id,
      xPercent: 12 + Math.random() * 72,
      yPercent: 105, // start slightly below bottom
      speed: 0.12 + Math.random() * 0.12, // gentle, non-rushed float
      colorHex: colors[Math.floor(Math.random() * colors.length)],
      surpriseEmoji: surprise.emoji,
      surpriseLabel: surprise.label,
      size: 75 + Math.random() * 25,
      popped: false,
    };
  };

  // Initial balloon setup
  useEffect(() => {
    const initial: Balloon[] = [];
    for (let i = 0; i < 5; i++) {
      const b = spawnBalloon(i);
      b.yPercent = 20 + i * 16;
      initial.push(b);
    }
    setBalloons(initial);
  }, []);

  // Float animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popped) return b;
          let nextY = b.yPercent - b.speed;
          if (nextY < -15) {
            // Loop back to bottom
            return spawnBalloon(b.id);
          }
          return { ...b, yPercent: nextY };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handlePop = (balloon: Balloon) => {
    if (balloon.popped) return;

    onTap();
    audio.playPop();
    audio.playChime(poppedCount % 5);

    // Trigger gentle sensory-safe confetti
    try {
      confetti({
        particleCount: 16,
        spread: 45,
        origin: {
          x: (balloon.xPercent / 100),
          y: Math.max(0.1, Math.min(0.9, balloon.yPercent / 100)),
        },
        colors: ['#A8E6CF', '#A0D2EB', '#D1C4E9', '#FEF3C7'],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback
    }

    setLatestSurprise(`${balloon.surpriseEmoji} ${balloon.surpriseLabel}`);

    // Mark popped and respawn after gentle delay
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
        prev.map((b) => (b.id === balloon.id ? spawnBalloon(b.id) : b))
      );
    }, 1200);
  };

  const handleReset = () => {
    audio.playSoftTap();
    setPoppedCount(0);
    setLatestSurprise(null);
    const refreshed: Balloon[] = [];
    for (let i = 0; i < 5; i++) {
      const b = spawnBalloon(i);
      b.yPercent = 20 + i * 16;
      refreshed.push(b);
    }
    setBalloons(refreshed);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[540px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#EDE4DA] shadow-xs select-none">

      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#2D6A4F] bg-[#E8F8F2] px-2.5 py-0.5 rounded-full inline-block mb-1">
            Causa e Efeito • Toque Direto
          </span>
          <h2 className="text-xl font-bold text-[#1E293B]">
            Estouro Suave & Revelação de Personagens
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#E8F8F2] text-[#2D6A4F] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#4FA88E]" />
            <span>Balões Estourados: {poppedCount}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#F7F3EE] hover:bg-[#EFEAE2] text-[#64748B] hover:text-[#1E293B] border border-[#EDE4DA] transition-colors"
            title="Reiniciar balões"
            aria-label="Reiniciar balões"
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
            <span>Toque ou clique em qualquer balão que estiver flutuando para estourar suavemente.</span>
        )}
          </div>

      {/* Sky Canvas Stage */}
        <div
          ref={containerRef}
          className="w-full h-[360px] sm:h-[400px] relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#E0F2FE]/40 via-[#FAF8F5] to-[#E8F8F2]/40 border-2 border-[#D4ECF9] shadow-inner my-2 cursor-pointer"
        >
          {/* Soft background clouds */}
          <div className="absolute top-4 left-8 text-[#A0D2EB]/30 text-5xl pointer-events-none">☁️</div>
          <div className="absolute top-16 right-12 text-[#A0D2EB]/30 text-6xl pointer-events-none">☁️</div>
          <div className="absolute bottom-6 left-1/3 text-[#A0D2EB]/20 text-4xl pointer-events-none">☁️</div>

          {/* Floating Balloons */}
          {balloons.map((b) => {
            if (b.popped) {
              // Popped state: display the revealed animal surprise
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
                  height: `${b.size * 1.25}px`,
                }}
                aria-label={`Balão flutuante. Toque para estourar`}
              >
                {/* Balloon Body */}
                <div
                  className="w-full h-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-md border-2 border-white/60 relative flex items-center justify-center transition-all"
                  style={{ backgroundColor: b.colorHex }}
                >
                  {/* Gentle shine reflection */}
                  <div className="absolute top-2 left-3 w-4 h-8 rounded-full bg-white/50 -rotate-20" />

                  {/* Cute friendly face on balloon */}
                  <span className="text-xl sm:text-2xl opacity-60">✨</span>

                  {/* Knot and string */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: b.colorHex }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300/60" />
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
