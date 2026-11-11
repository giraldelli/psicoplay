import { useUser } from '@clerk/clerk-react';
import { isClerkConfigured } from './clerkConfig.ts';

interface RetornoAuthStatus {
  isAutenticado: boolean;
  isConfigurado: boolean;
  isCarregado: boolean;
  nomeUsuario: string;
}

export function useAuthStatus(): RetornoAuthStatus {
  const configurado = isClerkConfigured();

  if (!configurado) {
    return {
      isAutenticado: false,
      isConfigurado: false,
      isCarregado: true,
      nomeUsuario: 'Terapeuta',
    };
  }

  return ObterAuthStatusClerk();
}

function ObterAuthStatusClerk(): RetornoAuthStatus {
  const { isSignedIn, user, isLoaded } = useUser();

  return {
    isAutenticado: Boolean(isSignedIn),
    isConfigurado: true,
    isCarregado: isLoaded,
    nomeUsuario: user?.firstName || user?.username || 'Terapeuta',
  };
}

