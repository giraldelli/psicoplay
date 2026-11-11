import React from 'react';
import { HeartHandshake, Mail, User, Sparkles, Shield, Heart } from 'lucide-react';

export const Rodape: React.FC = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FAF8F5] border-t border-[#EDE4DA] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Coluna 1: Marca & Propósito */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A8E6CF] via-[#A0D2EB] to-[#D1C4E9] p-0.5 shadow-xs flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-[#4FA88E]" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#1E293B]">
                  Psico<span className="text-[#3E8EBF]">Play</span>
                </span>
                <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F8F2] text-[#2D6A4F]">
                  <Sparkles className="w-2.5 h-2.5 text-[#4FA88E]" /> Clínica
                </span>
              </div>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-md">
              Plataforma desenvolvida especialmente para profissionais da saúde e educação 
              no acolhimento e desenvolvimento de crianças no Espectro Autista (TEA), 
              TDAH e dificuldades de integração sensorial.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#2D6A4F] font-semibold bg-[#E8F8F2] w-fit px-3 py-1.5 rounded-lg border border-[#A8E6CF]/50">
              <Shield className="w-3.5 h-3.5 text-[#4FA88E]" />
              <span>Ambiente clínico seguro e sensorialmente adaptado</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <a href="#sobre" className="hover:text-[#3E8EBF] transition-colors">
                  Sobre a Plataforma
                </a>
              </li>
              <li>
                <a href="#jogos" className="hover:text-[#3E8EBF] transition-colors">
                  Jogos Terapêuticos
                </a>
              </li>
              <li>
                <a href="#metodologia" className="hover:text-[#3E8EBF] transition-colors">
                  Metodologia & TEA
                </a>
              </li>
              <li>
                <a href="#area-terapeuta" className="hover:text-[#3E8EBF] transition-colors">
                  Área do Terapeuta
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Desenvolvedor & Contato */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
              Desenvolvimento & Contato
            </h4>
            <div className="space-y-2.5 text-sm text-[#64748B]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#3E8EBF] shrink-0" />
                <span className="font-semibold text-[#1E293B]">Gabriel Giraldelli Santos</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3E8EBF] shrink-0" />
                <a
                  href="mailto:giraldelli.studio@gmail.com"
                  className="hover:text-[#3E8EBF] underline underline-offset-2 transition-colors break-all"
                  title="Enviar e-mail para o desenvolvedor"
                >
                  giraldelli.studio@gmail.com
                </a>
              </div>
              <p className="text-xs text-[#94A3B8] pt-1">
                Sugestões clínicas, suporte ou parcerias institucionais.
              </p>
            </div>
          </div>

        </div>

        {/* Linha Divisória e Copyright */}
        <div className="pt-8 border-t border-[#EDE4DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {anoAtual} <strong>PsicoPlay</strong>. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-1 text-[#64748B]">
            <span>Criado com dedicação por</span>
            <strong className="text-[#1E293B]">Gabriel Giraldelli Santos</strong>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-0.5" />
          </div>
        </div>

      </div>
    </footer>
  );
};

