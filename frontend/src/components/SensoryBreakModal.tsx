import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wind, Sun, Heart, Check } from 'lucide-react';
import { audio } from './AudioService.ts';

interface SensoryBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SensoryBreakModal: React.FC<SensoryBreakModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'inspire' | 'segure' | 'expire'>('inspire');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === 'inspire') {
              audio.playChime(1);
              return 'segure';
            }
            if (currentPhase === 'segure') {
              audio.playChime(3);
              return 'expire';
            }
            audio.playChime(0);
            return 'inspire';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const phaseDetails = {
    inspire: { text: 'Inspire suavemente pelo nariz...', color: 'text-[#2D6A4F]', bg: 'bg-[#E8F8F2]' },
    segure: { text: 'Segure o ar com calma...', color: 'text-[#5E35B1]', bg: 'bg-[#EDE7F6]' },
    expire: { text: 'Solte o ar devagar pela boca...', color: 'text-[#1E3A8A]', bg: 'bg-[#D4ECF9]' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3E50]/40 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF8F5] border border-[#EDE4DA] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EDE4DA] text-[#64748B] hover:text-[#1E293B] transition-colors"
          title="Fechar pausa sensorial"
          aria-label="Fechar pausa sensorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sensory badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F2] text-[#2D6A4F] text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#4FA88E]" />
          <span>Espaço de Regulação Sensorial</span>
        </div>

        <h2 className="text-xl font-extrabold text-[#1E293B] mb-1">
          Momento de Respiração & Calma
        </h2>
        <p className="text-xs text-[#64748B] mb-6">
          Diminua os estímulos visuais e auditivos. Respire no ritmo do círculo para regular os batimentos e a atenção.
        </p>

        {/* Breathing Animated Circle */}
        <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out ${
              phase === 'inspire'
                ? 'scale-110 bg-[#A8E6CF]/30'
                : phase === 'segure'
                ? 'scale-110 bg-[#D1C4E9]/40'
                : 'scale-90 bg-[#A0D2EB]/30'
            }`}
          />
          <div
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-md ${phaseDetails[phase].bg}`}
          >
            <Wind className={`w-8 h-8 mb-1 ${phaseDetails[phase].color} animate-pulse`} />
            <span className={`text-2xl font-black ${phaseDetails[phase].color}`}>
              {seconds}s
            </span>
          </div>
        </div>

        <p className={`text-sm font-bold my-4 transition-colors ${phaseDetails[phase].color}`}>
          {phaseDetails[phase].text}
        </p>

        {/* Calming quick sensory tips */}
        <div className="grid grid-cols-2 gap-2 text-left text-xs bg-white/80 p-3 rounded-2xl border border-[#EDE4DA] mb-6">
          <div className="flex items-center gap-1.5 text-[#475569]">
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Abaixe as luzes da sala</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#475569]">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Ofereça um gole de água</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-[#4FA88E] hover:bg-[#3d8c75] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Pronto para Retornar com Tranquilidade</span>
        </button>
      </div>
    </div>
  );
};
