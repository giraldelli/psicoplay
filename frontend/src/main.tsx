import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { ptBR } from '@clerk/localizations';
import App from './App.tsx';
import './index.css';
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from './utils/clerkConfig.ts';

const elementoRaiz = document.getElementById('root');
if (!elementoRaiz) {
  throw new Error('Elemento root não encontrado no documento.');
}

const raiz = createRoot(elementoRaiz);

if (isClerkConfigured()) {
  raiz.render(
    <StrictMode>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        localization={ptBR}
        afterSignOutUrl="/"
      >
        <App />
      </ClerkProvider>
    </StrictMode>
  );
} else {
  raiz.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
