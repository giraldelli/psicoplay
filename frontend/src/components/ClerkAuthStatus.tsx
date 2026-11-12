import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import { LogIn, ShieldAlert } from 'lucide-react';

interface ClerkAuthStatusProps {
  isConfigured: boolean;
}

export const ClerkAuthStatus: React.FC<ClerkAuthStatusProps> = ({ isConfigured }) => {
  if (!isConfigured) {
    return (
      <div
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
        title="Adicione VITE_CLERK_PUBLISHABLE_KEY no arquivo .env para ativar a autenticação"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden xl:inline">Clerk: Adicione a chave no .env</span>
        <span className="xl:hidden">Configurar Clerk</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#3E8EBF] hover:bg-[#2C6E96] text-white transition-all shadow-xs cursor-pointer select-none"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar / Cadastro</span>
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2.5 bg-[#F7F3EE] border border-[#EDE4DA] rounded-2xl px-2.5 py-1">
          <ClerkUserInfo />
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-7 h-7 rounded-xl',
              },
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
};

const ClerkUserInfo: React.FC = () => {
  const { user } = useUser();
  const primeiroNome = user?.firstName || user?.username || 'Terapeuta';

  return (
    <div className="text-left hidden lg:block">
      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider leading-none">
          Terapeuta
        </span>
      </div>
      <span className="text-xs font-bold text-[#1E293B] block leading-tight">
        {primeiroNome}
      </span>
    </div>
  );
};

