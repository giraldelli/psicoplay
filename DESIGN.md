# Diretrizes de Design & Sistema Visual - PsicoPlay

Documentação de design e craft do frontend orientada pela metodologia **Impeccable**, especializada em interfaces clínicas e neurodivergentes (TEA, TDAH).

---

## 1. Princípios de Design & Sensibilidade Clínica

1. **Baixa Aversão Sensorial (Calming Palette):**
   - Ausência total de tons neon estridentes, animações abruptas ou ruídos visuais excessivos.
   - Ambientes térmicos acolhedores com fundo linho/areia (`#FAF8F5`, `#F7F3EE`) que reduzem o cansaço ocular.

2. **Tipografia Intencional & Legibilidade:**
   - Tipografias primárias: `Nunito` e `Plus Jakarta Sans`, garantindo caracteres abertos e confortáveis para dislexia e atrasos de leitura.
   - Largura máxima de linha para parágrafos: 60 a 68 caracteres (`max-w-[65ch]`), facilitando o rastreamento ocular.
   - Textos de títulos sem degradês artificiais (`gradient-text`), utilizando cores sólidas e de alto contraste.

3. **Hierarquia Clara & Ausência de Clutter:**
   - Títulos fortes e autoexplicativos sem necessidade de kickers/eyebrows redundantes.
   - Espaçamento vertical generoso, priorizando respiração entre seções clínicas.

4. **Microinterações Orgânicas:**
   - Easing exponencial suave (`ease-out`) em vez de saltos elásticos (`bounce`) que causam desconforto cognitivo.
   - Confirmações táteis e auditivas suaves através do `AudioService` (frequências médias-baixas e volumes controlados).

---

## 2. Paleta de Cores e Tokens

| Token | Valor Hex | Finalidade Clínica |
|---|---|---|
| `bg-base` | `#FAF8F5` | Superfície base suave (linho claro) |
| `surface-card` | `#FFFFFF` | Cartões e painéis com contraste definido |
| `surface-subtle` | `#F7F3EE` | Elementos de apoio, inputs e divisores |
| `border-soft` | `#EDE4DA` | Delimitação sutil e elegante |
| `brand-sage` | `#2D6A4F` | Identificação de sucesso e regulação emocional |
| `brand-mint` | `#A8E6CF` | Destaques sutis e acolhimento visual |
| `brand-blue` | `#2C6E96` | Foco, CTAs principais e links interativos |
| `text-primary` | `#1E293B` | Leitura primária com contraste WCAG AAA |
| `text-secondary` | `#475569` | Textos descritivos e dados de apoio |

---

## 3. Estados Interativos e Acessibilidade

- **Foco por Teclado (`focus-visible`):** Contorno nítido de 2px em `#2C6E96` com offset de 2px, garantindo conformidade WCAG sem poluir o clique do mouse.
- **Seleção de Texto:** `background: #B7E4C7; color: #1B4332;` para uma experiência de marca coesa.
- **Barra de Rolagem:** Fina (7px), cantos arredondados e cor neutra integrada ao fundo.

