# Spec — Ajustes Front-end: Homepage, Reviews, Design System e Header

## 1. Contexto

Este documento descreve as tasks de front-end para evolução visual e de navegação do projeto.

### Foco desta entrega

- Ajustar links da homepage para avaliações e fórum.
- Alterar o layout das avaliações para coluna.
- Mapear o design kit e criar uma base inicial de design system.
- Aplicar o design system nas páginas principais.
- Aumentar o tamanho da logo no header.

Todas as alterações devem respeitar a arquitetura, componentes, estilos e convenções já existentes no projeto.

---

## 2. Objetivo geral

Melhorar a experiência visual e a navegação inicial da aplicação, criando uma base visual mais consistente para as próximas features, especialmente reviews e fórum.

---

## 3. Escopo

### 3.1 Incluído

- Ajuste de links na homepage.
- Ajuste visual da listagem/seção de avaliações.
- Criação de documentação inicial de design system.
- Criação ou atualização de tokens visuais, se aplicável.
- Aplicação de cores e tipografia nas páginas principais.
- Ajuste do tamanho da logo no header.
- Validação de responsividade.
- Validação de build/lint, se disponíveis no projeto.

### 3.2 Fora do escopo

- Alterações no backend.
- Alterações em contratos de API.
- Alterações em autenticação.
- Criação de novas features de fórum.
- Criação de categorias, tags ou filtros novos.
- Implementação de sistema completo de componentes.
- Redesign total da aplicação.
- Alterações em regras de negócio.
- Alterações estruturais de rotas, salvo links/navegação necessários.

---

## 4. Premissas

- O projeto já possui estrutura front-end configurada.
- O projeto possui ou terá uma página/listagem de avaliações.
- O projeto possui ou terá uma página inicial de fórum.
- O design kit será usado como fonte primária de cores, tipografia e imagens.
- Caso alguma rota ainda não exista, o link deve apontar para a rota planejada e documentar o ponto como pendente.
- Caso algum token não esteja claro no design kit, marcar como `TODO` em vez de inventar valores arbitrários.

---

## 5. Restrições técnicas

- Não alterar backend.
- Não alterar regras de negócio.
- Não alterar contratos de API.
- Não duplicar componentes se já existirem componentes reutilizáveis.
- Não criar páginas novas sem necessidade.
- Não inventar identidade visual fora do design kit.
- Evitar cores hardcoded após criação dos tokens.
- Manter responsividade mobile e desktop.
- Manter navegação client-side quando aplicável.
- Seguir padrões atuais do projeto.

---

## 6. Tasks

### Task 1 — Atualizar links da homepage para avaliações e fórum

#### Objetivo

Atualizar a homepage para que o usuário consiga navegar corretamente para:

- Listagem completa de avaliações.
- Página inicial do fórum.

#### Escopo

Alterar ou criar links, botões ou cards na homepage relacionados a avaliações e fórum.

#### Requisitos funcionais

**Link para avaliações**

- O usuário deve conseguir acessar a listagem completa de avaliações a partir da homepage.
- Texto sugerido:

```txt
Ver todas as avaliações
```

**Link para fórum**

- O usuário deve conseguir acessar a página inicial do fórum a partir da homepage.
- Texto sugerido:

```txt
Ir para o fórum
```

#### Requisitos técnicos

- Reutilizar componentes de navegação já existentes (links, botões ou cards).
- Manter navegação client-side quando aplicável.
- Não alterar regras de negócio, backend ou contratos de API.

#### Arquivos prováveis

- `src/app/page.tsx`
- `src/components/home/*`
- `src/components/Nav.tsx`

#### Critérios de aceite

- Link para avaliações está visível e funcional.
- Link para fórum está visível e funcional.
- Navegação leva para as rotas corretas.
- Não há regressão visual na homepage.
- Não há alteração em backend, contratos de API ou autenticação.

---

### Task 2 — Alterar layout das avaliações para coluna

#### Objetivo

Alterar o layout das avaliações para exibição em coluna, melhorando a leitura e o foco em cada card.

#### Escopo

Ajustar a listagem ou seção de avaliações onde os cards aparecem em grid, linha horizontal ou layout com múltiplas colunas.

#### Comportamento atual possível

```txt
Avaliação 1 | Avaliação 2 | Avaliação 3
```

#### Comportamento desejado

```txt
Avaliação 1
Avaliação 2
Avaliação 3
```

#### Requisitos funcionais

- Cada avaliação deve ocupar um card/linha própria.
- A listagem deve ter espaçamento vertical consistente.
- As informações essenciais da avaliação devem continuar visíveis.
- A experiência de leitura deve ser confortável em mobile e desktop.

#### Requisitos técnicos

- Preferir layout com `flex flex-col`, `space-y-*`, `gap-*` ou equivalente.
- Preservar os componentes de card já existentes sempre que possível.
- Não alterar formato dos dados.
- Não alterar chamadas de API.
- Não alterar backend.
- Evitar reescrita desnecessária dos componentes.

#### Sugestão de implementação

```tsx
<div className="flex flex-col gap-4">
  {reviews.map((review) => (
    <ReviewCard key={review.id} review={review} />
  ))}
</div>
```

Adaptar conforme a estrutura real do projeto.

#### Arquivos prováveis

- `src/app/reviews/*`
- `src/components/reviews/*`
- `src/features/reviews/*`
- `src/components/home/*`
- `src/app/page.tsx`

#### Critérios de aceite

- As avaliações aparecem em coluna.
- Os cards mantêm as informações essenciais.
- O espaçamento entre cards está consistente.
- O layout funciona em mobile.
- O layout funciona em desktop.
- Não há quebra visual.
- Não há regressão na renderização dos dados.
- Não há erro no console.
- Não houve alteração em backend ou contratos de API.

---

### Task 3 — Mapear design kit e criar design system inicial

#### Objetivo

Analisar o design kit do projeto e criar uma base inicial de design system para padronizar:

- Cores.
- Tipografia.
- Uso de imagens.
- Elementos visuais recorrentes.

#### Escopo

Criar documentação e/ou tokens técnicos reutilizáveis com base no design kit.

#### Entregáveis esperados

- Criar documentação em `docs/design-system.md`.
- Caso o projeto já tenha outro local padrão para documentação, usar o padrão existente.
- Criar ou atualizar arquivos técnicos, se aplicável:
  - `tailwind.config.ts`
  - `src/app/globals.css`
  - `src/styles/tokens.css`
  - `src/styles/theme.css`

Adaptar conforme a estrutura real do projeto.

#### 3.1 Cores

**Objetivo**

Mapear as cores principais do design kit e convertê-las em tokens reutilizáveis.

**Categorias esperadas**

- `primary`
- `secondary`
- `background`
- `surface`
- `foreground`
- `muted`
- `border`
- `success`
- `warning`
- `danger`

**Exemplo de documentação**

```md
## Colors

### Primary

- `primary`: #...
- `primary-foreground`: #...

### Background

- `background`: #...
- `surface`: #...

### Text

- `foreground`: #...
- `muted-foreground`: #...

### Border

- `border`: #...
```

**Exemplo com CSS variables**

```css
:root {
  --color-primary: #000000;
  --color-primary-foreground: #ffffff;

  --color-background: #ffffff;
  --color-surface: #f8f8f8;

  --color-foreground: #111111;
  --color-muted-foreground: #666666;

  --color-border: #e5e5e5;
}
```

**Exemplo com Tailwind**

```ts
theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      background: "var(--color-background)",
      foreground: "var(--color-foreground)",
      surface: "var(--color-surface)",
      border: "var(--color-border)",
    },
  },
}
```

**Critérios de aceite específicos — Cores**

- As cores principais do design kit foram mapeadas.
- As cores possuem nomes semânticos.
- Os tokens podem ser reutilizados nos componentes.
- Cores hardcoded devem ser evitadas nas próximas tasks.
- Valores incertos foram documentados como `TODO`.
- Nenhuma cor foi inventada sem justificativa.

#### 3.2 Tipografia

**Objetivo**

Mapear a tipografia do design kit e definir uma escala inicial para uso no projeto.

**Itens a mapear**

- `font family`
- `font sizes`
- `font weights`
- `line heights`
- `letter spacing`, se aplicável
- Uso recomendado

**Categorias sugeridas**

- `display`
- `heading-1`
- `heading-2`
- `heading-3`
- `body`
- `body-sm`
- `caption`
- `label`

**Exemplo de documentação**

```md
## Typography

### Heading 1

- Font size: ...
- Font weight: ...
- Line height: ...
- Usage: títulos principais de página.

### Body

- Font size: ...
- Font weight: ...
- Line height: ...
- Usage: textos comuns.

### Caption

- Font size: ...
- Font weight: ...
- Line height: ...
- Usage: textos auxiliares, metadados e informações secundárias.
```

**Exemplo com CSS variables**

```css
:root {
  --font-sans: Inter, sans-serif;

  --text-display-size: 3rem;
  --text-display-line-height: 1.1;

  --text-h1-size: 2.25rem;
  --text-h1-line-height: 1.2;

  --text-body-size: 1rem;
  --text-body-line-height: 1.5;

  --text-caption-size: 0.875rem;
  --text-caption-line-height: 1.4;
}
```

**Critérios de aceite específicos — Tipografia**

- A fonte principal foi identificada.
- Os tamanhos principais foram documentados.
- Os pesos principais foram documentados.
- Os line-heights principais foram documentados.
- Os usos recomendados foram documentados.
- A tipografia pode ser reutilizada nas páginas.
- Valores incertos foram documentados como `TODO`.

#### 3.3 Imagens

**Objetivo**

Definir diretrizes iniciais para uso de imagens no projeto.

**Casos de uso esperados**

- `logo`
- `hero image`
- `review cards`
- `vehicle thumbnails`
- `avatars`
- `empty states`
- `icons`

**Regras esperadas**

Documentar:

- Onde ficam os assets.
- Quais proporções devem ser usadas.
- Como imagens devem se comportar em cards.
- Como imagens devem se comportar em mobile.
- Quando usar fallback.
- Quando usar imagem otimizada, como `next/image`, se aplicável.

**Exemplo de documentação**

```md
## Images

### Logo

- Usar arquivo: `/logo.svg`
- Deve manter proporção original.
- Deve ser clicável no header e levar para homepage.

### Vehicle thumbnail

- Aspect ratio recomendado: 16:9.
- Deve usar `object-fit: cover`.
- Deve possuir fallback quando não houver imagem.
```

**Critérios de aceite específicos — Imagens**

- O uso de logo foi documentado.
- O uso de imagens em cards foi documentado.
- O uso de thumbnails foi documentado.
- O comportamento responsivo foi documentado.
- Os fallbacks foram documentados, se aplicável.
- O uso de otimização de imagem foi documentado, se aplicável.

#### Critérios de aceite gerais da Task 3

- Existe uma documentação inicial de design system.
- Cores foram mapeadas.
- Tipografia foi mapeada.
- Imagens foram documentadas.
- Tokens técnicos foram criados ou atualizados quando aplicável.
- A implementação respeita o design kit.
- Não foram inventadas cores ou fontes sem necessidade.
- Itens incertos foram marcados como `TODO`.
- A documentação é clara o suficiente para orientar futuras implementações.

---

### Task 4 — Aplicar design system nas páginas principais

#### Objetivo

Aplicar o design system criado nas páginas principais da aplicação, padronizando cores e tipografia.

#### Escopo

Aplicar os tokens e padrões definidos na Task 3 nas principais telas do front-end.

#### Prioridade de páginas

1. Homepage
2. Página/listagem de avaliações
3. Página de detalhe de avaliação
4. Página do fórum, se existir
5. Header
6. Footer

#### Requisitos funcionais

- A experiência visual deve ficar mais consistente.
- A hierarquia visual dos títulos deve ficar clara.
- Textos secundários devem usar estilo secundário/muted.
- Botões e links devem seguir o padrão visual.
- Cards devem ter aparência consistente.

#### Requisitos técnicos

- Substituir cores hardcoded por tokens.
- Aplicar classes ou variáveis de tipografia consistentes.
- Evitar criar estilos duplicados.
- Reutilizar componentes existentes.
- Não alterar regras de negócio.
- Não alterar chamadas de API.
- Não alterar backend.

#### Exemplos de ajuste

Evitar:

```tsx
<h1 className="text-[#111111] text-[42px]">Avaliações de carros</h1>
```

Preferir:

```tsx
<h1 className="text-foreground text-4xl font-bold">Avaliações de carros</h1>
```

Evitar:

```tsx
<div className="bg-[#f8f8f8]">
```

Preferir:

```tsx
<div className="bg-surface">
```

Adaptar os nomes conforme os tokens reais do projeto.

#### Elementos a revisar

- Títulos
- Subtítulos
- Parágrafos
- Links
- Botões
- Cards
- Badges
- Inputs
- Headers de seção
- Empty states
- Footer
- Header

#### Arquivos prováveis

- `src/app/page.tsx`
- `src/app/reviews/*`
- `src/app/forum/*`
- `src/components/*`
- `src/features/*`
- `src/app/globals.css`
- `tailwind.config.ts`

#### Critérios de aceite

- As páginas principais usam tokens de cores.
- As páginas principais usam escala tipográfica consistente.
- Não há uso desnecessário de cores hardcoded.
- Cards possuem aparência consistente.
- Botões possuem aparência consistente.
- Links possuem aparência consistente.
- A hierarquia de títulos está clara.
- Textos secundários usam estilo adequado.
- O layout mobile continua funcionando.
- O layout desktop continua funcionando.
- Não há regressão funcional.
- Não há erro no console.
- Não houve alteração em backend ou contratos de API.

---

### Task 5 — Aumentar tamanho da logo no header

#### Objetivo

Aumentar o tamanho da logo no header para melhorar a presença visual da marca.

#### Escopo

Ajustar somente a apresentação da logo no header.

#### Requisitos funcionais

- A logo deve aparecer maior no header.
- A logo deve continuar clicável.
- O clique na logo deve levar para a homepage.
- O header deve continuar visualmente equilibrado.

#### Requisitos técnicos

- Identificar o componente de header atual.
- Ajustar tamanho da logo sem quebrar o alinhamento.
- Garantir responsividade.
- Garantir que a logo não fique pixelada.
- Se usar `next/image`, manter `width`, `height` e `alt` adequados.
- Se usar SVG, preferir redimensionamento via classe CSS mantendo proporção.
- Não alterar links de navegação além do necessário.
- Não alterar backend.

#### Exemplo com imagem

```tsx
<Image
  src="/logo.svg"
  alt="Papo Auto"
  width={160}
  height={40}
  className="h-10 w-auto"
/>
```

#### Exemplo com texto

```tsx
<Link href="/" className="text-2xl font-bold">
  Papo Auto
</Link>
```

Adaptar conforme implementação real.

#### Arquivos prováveis

- `src/components/header/*`
- `src/components/layout/*`
- `src/app/layout.tsx`
- `src/app/page.tsx`

#### Critérios de aceite

- A logo está maior.
- A logo mantém boa qualidade visual.
- O header continua alinhado.
- O menu não quebra em desktop.
- O menu não quebra em mobile.
- O clique na logo continua levando para a homepage.
- Não há erro no console.
- Não houve alteração em backend ou contratos de API.

---

## 7. Ordem recomendada de execução

### Etapa 1 — Base visual

Executar primeiro:

- Task 3 — Mapear design kit e criar design system inicial

Motivo:

A Task 3 cria a base visual para as demais alterações.

### Etapa 2 — Aplicação visual

Executar depois:

- Task 4 — Aplicar design system nas páginas principais
- Task 5 — Aumentar tamanho da logo no header

Motivo:

Com os tokens definidos, fica mais seguro aplicar cores, tipografia e ajustes visuais.

### Etapa 3 — Ajustes de navegação e layout

Executar por fim:

- Task 1 — Atualizar links da homepage para avaliações e fórum
- Task 2 — Alterar layout das avaliações para coluna

Motivo:

São ajustes localizados e podem ser aplicados depois da base visual.

---

## 8. Critérios de aceite gerais

A entrega será considerada concluída quando:

- Homepage carrega corretamente.
- Links da homepage funcionam.
- Link para avaliações navega corretamente.
- Link para fórum navega corretamente.
- Cards de avaliação aparecem em coluna.
- Header continua alinhado.
- Logo está maior e proporcional.
- Cores estão consistentes.
- Tipografia está consistente.
- Design system inicial foi documentado.
- Tokens visuais foram criados ou atualizados, se aplicável.
- Layout mobile não quebrou.
- Layout desktop não quebrou.
- Não existem erros no console.
- Build do projeto passa.
- Lint passa, se configurado.
- Não houve alteração em backend.
- Não houve alteração em contratos de API.
- Não houve alteração em regras de negócio.

---

## 9. Checklist de validação manual

Antes de finalizar, validar manualmente:

### Homepage

- A homepage abre sem erros.
- O link para avaliações está visível.
- O link para fórum está visível.
- O link para avaliações navega para a rota correta.
- O link para fórum navega para a rota correta.
- A homepage continua responsiva.

### Reviews

- A listagem de avaliações abre sem erros.
- As avaliações aparecem em coluna.
- Os cards mantêm as informações necessárias.
- O espaçamento vertical está adequado.
- A listagem funciona em mobile.
- A listagem funciona em desktop.

### Design system

- Existe documentação de design system.
- Cores principais foram mapeadas.
- Tipografia principal foi mapeada.
- Uso de imagens foi documentado.
- Tokens técnicos foram criados/atualizados se aplicável.
- Itens incertos estão marcados como `TODO`.

### Páginas principais

- Homepage usa tokens de design.
- Reviews usam tokens de design.
- Fórum usa tokens de design, se a página existir.
- Header usa tokens de design.
- Footer usa tokens de design, se aplicável.
- Não há cores hardcoded desnecessárias.

### Header

- Logo está maior.
- Logo mantém proporção.
- Logo não está pixelada.
- Header continua alinhado.
- Menu desktop não quebrou.
- Menu mobile não quebrou.
- Logo continua navegando para a homepage.

---

## 10. Checklist técnico

Executar, se os scripts existirem no projeto:

```bash
npm run lint
npm run build
npm run test
```

Ou, se o projeto usar `pnpm`:

```bash
pnpm lint
pnpm build
pnpm test
```

Ou, se o projeto usar `yarn`:

```bash
yarn lint
yarn build
yarn test
```

Caso algum script não exista, documentar no resumo final.

---

## 11. Prompt para execução pelo agente

Implemente as tasks descritas neste arquivo, focando exclusivamente no front-end.

Antes de alterar qualquer arquivo, analise a estrutura atual do projeto e identifique os componentes, páginas, estilos globais, tokens e padrões já existentes.

Siga a arquitetura e convenções do projeto.

Não altere backend, regras de negócio, contratos de API ou autenticação.

Priorize simplicidade, consistência visual, responsividade e reutilização de componentes existentes.

Use o design kit como fonte primária para cores, tipografia e imagens.

Não invente tokens visuais sem necessidade. Quando algum valor não estiver claro no design kit, documente como `TODO`.

Ao final, valide build, lint e comportamento visual das páginas afetadas.

Entregue um resumo com:

- Arquivos alterados.
- Decisões tomadas.
- Pendências encontradas.
- Validações executadas.
- Eventuais riscos ou pontos de atenção.

---

## 12. Resultado esperado

Ao final da implementação, o projeto deve ter:

- Homepage com navegação clara para avaliações e fórum.
- Avaliações exibidas em coluna.
- Design system inicial documentado.
- Cores e tipografias aplicadas de forma mais consistente.
- Header com logo maior e bem alinhada.
- Nenhuma alteração no backend.
- Nenhuma alteração em regras de negócio.
- Interface mais coesa e preparada para evolução do fórum e das avaliações.