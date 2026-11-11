# PsicoPlay - Plataforma para Profissionais da Saúde e Educação & Jogos Terapêuticos

Plataforma para profissionais da saúde e educação com jogos adaptados para TEA e transtornos cognitivos, prontuário, acompanhamento de reações e calendário.

---

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

```
psicoplay/
├── backend/                  # Serviços, tipos e integrações de dados
│   ├── api.ts                # API e endpoints clínicos
│   ├── db.ts                 # Serviço de persistência de dados
│   ├── schema.sql            # Definição das tabelas e esquemas Supabase
│   ├── supabase.ts          # Cliente e configuração do Supabase
│   ├── types.ts              # Definições de tipos e interfaces do domínio
│   ├── package.json          # Dependências do backend
│   └── tsconfig.json         # Configuração TypeScript do backend
│
├── frontend/                 # Aplicação Web (React 19 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Componentes de interface e serviços compartilhados
│   │   ├── games/            # Jogos terapêuticos e estimulação cognitiva
│   │   ├── utils/            # Regras psicopedagógicas e utilitários
│   │   ├── views/            # Visões principais (Dashboard, Prontuário, Calendário, etc.)
│   │   ├── App.tsx           # Componente raiz da aplicação
│   │   ├── index.css         # Estilos globais Tailwind CSS
│   │   └── main.tsx          # Ponto de entrada React
│   ├── index.html            # Estrutura HTML base
│   ├── vite.config.ts        # Configuração do Vite com suporte a aliases
│   ├── tsconfig.json         # Configuração TypeScript do frontend
│   └── package.json          # Dependências e scripts do frontend
│
├── .gitignore
├── .env                      # Variáveis de ambiente (Clerk e Supabase)
├── pnpm-workspace.yaml
└── package.json              # Scripts orquestradores na raiz
```

---

## Autenticação com Clerk

A autenticação de terapeutas é gerenciada pelo [Clerk](https://clerk.com).

Para ativar o login e gerenciamento de perfil:
1. Obtenha sua chave pública no [Dashboard do Clerk](https://dashboard.clerk.com/) em **API Keys**.
2. Adicione no arquivo `.env` na raiz do projeto:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
A aplicação utiliza tradução oficial para **Português do Brasil (`ptBR`)** e disponibiliza o controle de sessão diretamente na barra de navegação superior.

---

## Como Executar

### 1. Instalar as dependências do Frontend
```bash
cd frontend
npm install
```

### 2. Executar em modo de desenvolvimento
Você pode executar diretamente da raiz:
```bash
npm run dev
```
Ou a partir da pasta `frontend`:
```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.
