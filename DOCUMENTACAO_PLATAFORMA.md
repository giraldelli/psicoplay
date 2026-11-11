# Documento de Especificação de Software • Plataforma PsicoPlay

**Projeto:** Plataforma Terapêutica Digital para Neurodesenvolvimento  
**Desenvolvedor:** Gabriel Giraldelli Santos  
**Contato:** giraldelli.studio@gmail.com  
**Versão:** 1.0.0  
**Data:** 11 de Novembro de 2026  

---

## 1. Visão Geral e Objetivos do Projeto

### 1.1 Objetivo Geral
A **PsicoPlay** é uma plataforma terapêutica digital e clínica desenvolvida especificamente para apoiar **profissionais da saúde e educação** (psicólogos, terapeutas ocupacionais, fonoaudiólogos, psicopedagogos e educadores especiais) no atendimento, avaliação e intervenção lúdico-cognitiva de crianças e jovens com necessidades específicas de aprendizagem e desenvolvimento.

### 1.2 Objetivos Específicos
- **Estimulação Cognitiva Segura:** Disponibilizar jogos digitais adaptados com alta previsibilidade de causa e efeito, sem punições estressantes, sustos ou sobrecargas sensoriais.
- **Monitoramento em Tempo Real (Therapist HUD):** Permitir que o profissional acompanhe métricas clínicas ao vivo durante a execução das atividades (toques, tentativas, nível de autonomia e tempo de foco).
- **Prontuário e Perfil Sensorial:** Centralizar o mapeamento de sensibilidades sensoriais (auditiva, visual, tátil), hiperfocos e técnicas de descompressão do paciente.
- **Acessibilidade Multiplataforma Total:** Proporcionar uma experiência fluida em computadores desktop, notebooks, tablets e smartphones com suporte touch de alta precisão.
- **Ambiente Totalmente Silencioso:** Eliminar ruídos intrusivos e efeitos sonoros estridentes, garantindo conforto acústico essencial para pacientes com hipersensibilidade auditiva (comum no TEA).

---

## 2. Público-Alvo

### 2.1 Pacientes / Crianças Atendidas
- Crianças no **Transtorno do Espectro Autista (TEA)**.
- Indivíduos com **TDAH (Transtorno do Déficit de Atenção com Hiperatividade)**.
- Crianças com **deficiência intelectual**, atrasos no desenvolvimento da linguagem e dificuldades de coordenação motora fina.

### 2.2 Usuários Operacionais (Profissionais)
- **Profissionais da Saúde e Educação:** Terapeutas Ocupacionais, Psicólogos infantis, Neuropsicólogos, Psicopedagogos, Fonoaudiólogos e Professores de Educação Especial (AEE).
- **Clínicas e Consultórios:** Espaços de atendimento multidisciplinar que necessitam de registro longitudinal das sessões e geração de relatórios estruturados para famílias e escolas.

---

## 3. Requisitos Funcionais (RF)

### 3.1 Módulo de Autenticação e Segurança
- **[RF01] Controle de Acesso por Papel:** Acesso público restrito à Landing Page institucional; acesso irrestrito às áreas clínicas (Pacientes, Jogos, Sessões, Agenda, Relatórios) liberado apenas após autenticação do profissional.
- **[RF02] Autenticação com Clerk:** Login/cadastro seguro via e-mail e métodos sociais, localizado em Português do Brasil e sem obrigatoriedade de SMS/número telefônico nacional.

### 3.2 Módulo de Pacientes e Perfil Sensorial
- **[RF03] Gestão de Pacientes:** Cadastro, edição, listagem e arquivamento de prontuários com dados cadastrais completos e responsável legal.
- **[RF04] Mapeamento Sensorial:** Registro de hipersensibilidades (auditiva, tátil, visual), hiperfocos de interesse e estratégias recomendadas de regulação emocional.

### 3.3 Módulo de Jogos Digitais Terapêuticos
- **[RF05] Pareamento por Cor ou Forma:** Classificação de blocos tridimensionais suaves em caixas correspondentes com pistas visuais e retorno acolhedor.
- **[RF06] Associação de Figuras Reais:** Pareamento de objetos fotográficos do cotidiano (copo, escova, tênis) para generalização da autonomia diária.
- **[RF07] Quebra-Cabeça de Encaixe com Pino de Madeira:** Estimulação do movimento de pinça e coordenação óculo-manual através de peças estilo madeira realista.
- **[RF08] Toque Direto (Balões Suaves):** Estímulo de causa e efeito imediato onde toques na tela estouram balões pastéis revelando figuras amigáveis.
- **[RF09] Pintura Digital Guiada por Toque:** Preenchimento automático de áreas do desenho por toque simples, evitando frustrações de preensão de lápis.
- **[RF10] Oficina Sensorial 3D (Three.js - Estilo City Bloxx):**
  - Seleção prévia entre 4 temas estilizados: *Edifício Urbano*, *Floresta & Natureza*, *Castelo Real Mágico* e *Confeitaria de Bolos*.
  - Contagem regressiva de 3 segundos para preparação e transição suave.
  - Movimento pendular suave de um bloco preso a um cabo de guindaste.
  - Soltura do bloco por toque na tela, botão táctil ou tecla de espaço.
  - Queda livre estritamente vertical com aceleração contínua da gravidade.
  - Mecânica arcade de encaixe: blocos grudam na torre mesmo em zigue-zague desde que haja sobreposição mínima (15%).
  - Simulação de vento e instabilidade: desvios acumulam balanço harmônico na torre; instabilidade excessiva (> 100%) provoca o tombamento da torre.
  - Câmera dinâmica com afastamento progressivo (*zoom-out*), mantendo sempre visíveis pelo menos 5 andares da torre e o guindaste.
  - Botão de Tela Cheia (*Fullscreen*) nativo.

### 3.4 Módulo de Sessão Clínica & Therapist HUD
- **[RF11] Painel Lateral ao Vivo (Therapist HUD):** Registro em tempo real de contagem de toques, erros, tempo decorrido e nível de suporte empregado (Independente, Dica Verbal, Apoio Físico).
- **[RF12] Modo Paciente:** Ocultação do painel de métricas durante a interação para evitar distrações na visão da criança.
- **[RF13] Persistência de Métricas:** Gravação dos registros das sessões vinculados ao paciente e ao profissional logado.

### 3.5 Módulo de Agenda, Calendário e Relatórios
- **[RF14] Agendamento de Sessões:** Calendário de atendimentos com status de realização.
- **[RF15] Emissão de Relatórios:** Painel com evolução de acertos, autonomia e frequência para acompanhamento multidisciplinar.

---

## 4. Requisitos Não-Funcionais (RNF)

- **[RNF01] 100% Silencioso (Conforto Acústico):** A aplicação não emite alertas agudos, sons de erro ou músicas de fundo, prevenindo crises de desregulação por sobrecarga auditiva.
- **[RNF02] Performance e Taxa de Quadros (60 FPS):** Renderização WebGL via Three.js otimizada para computadores modestos, tablets e smartphones, com baixo consumo de CPU/GPU.
- **[RNF03] Paleta de Cores Calmante (Craft Floor):** Uso de tons pastéis e terrosos acolhedores (mint, terracota suave, pedra quente, lavanda), evitando vermelhos alarmantes ou cores fluorescentes agressivas.
- **[RNF04] Multiplataforma e Responsividade:** Layout adaptável de 320px a monitores 4K ultrawide, com `touch-action: none` e eventos `pointerdown` para eliminar latências de toque em telas móveis.
- **[RNF05] Segurança de Dados e Conformidade LGPD:** Isolamento de dados clínicos por usuário autenticado através de políticas Row Level Security (RLS) no PostgreSQL.
- **[RNF06] Tolerância a Falhas e Ergonomia Cognitiva:** Erros nos jogos nunca geram telas punitivas ou pontuações negativas; o sistema fornece encorajamento gentil (*"Quase lá! Vamos tentar o próximo andar"*).

---

## 5. Arquitetura e Stack Tecnológico

### 5.1 Frontend
- **Framework Base:** React 19 com arquitetura baseada em Componentes Funcionais e Hooks modernos.
- **Linguagem:** TypeScript (tipagem estrita, ausência total de tipos `any`).
- **Build Tool & Bundler:** Vite 8 com suporte a Hot Module Replacement (HMR) ultrarrápido.
- **Estilização e Layout:** Tailwind CSS com design system customizado em tons pastéis e neutros.
- **Ícones da Interface:** Lucide React (iconografia limpa, acessível e universal).
- **Gráficos e Renderização Tridimensional:** Three.js (`^0.187.0`) para a Oficina Sensorial 3D e renderização de física com WebGL.

### 5.2 Autenticação & Identidade
- **Provedor:** Clerk Authentication (`@clerk/clerk-react`).
- **Internacionalização:** `@clerk/localizations` com tradução completa para o Português do Brasil (`ptBR`).
- **Configuração:** Login via e-mail/senha, sem necessidade de número de celular/SMS, integrado a chaves seguras de ambiente.

### 5.3 Backend & Banco de Dados
- **Banco de Dados Relacional:** PostgreSQL hospedado e gerenciado via Supabase.
- **Segurança de Linha (RLS):** Tabelas protegidas por políticas que garantem que cada profissional acesse estritamente os seus próprios pacientes e sessões.
- **Tabelas Principais:**
  - `pacientes`: Cadastro clínico, dados de contato e preferências.
  - `perfis_sensoriais`: Mapeamento de estímulos auditivos, táteis e visuais.
  - `sessoes`: Histórico de encontros clínicos e observações terapêuticas.
  - `metricas_jogos`: Indicadores de autonomia, toques e precisão por atividade.

### 5.4 Hospedagem e Entrega (Deploy)
- **Plataforma:** Vercel.
- **Configuração:** `vercel.json` com `outputDirectory: "dist"` e build pipeline automatizado do monorepo.

---

## 6. Informações de Propriedade e Contato

- **Propriedade Intelectual:** Todos os direitos reservados.
- **Idealizador e Desenvolvedor:** Gabriel Giraldelli Santos
- **E-mail de Contato Profissional:** giraldelli.studio@gmail.com
