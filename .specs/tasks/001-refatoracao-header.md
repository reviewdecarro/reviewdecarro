# Task 001 — Refatoração do Header

## Contexto

O header precisa ser refatorado para seguir o layout visual de referência salvo em:

```txt
apps/web/docs/.specs/tasks/home-papo-auto.png.jpg
```

A referência mostra um header com fundo branco, logo colorida à esquerda, navegação horizontal ao lado da logo e ações de autenticação alinhadas à direita.

## Objetivo

Refatorar o header da aplicação web para ficar consistente com o print de referência, preservando a navegação atual e melhorando a adaptação do componente ao fundo branco.

## Escopo

### Incluído

- Usar a logo colorida no header.
- Manter o fundo do header branco.
- Ajustar espaçamentos horizontais e verticais conforme a referência.
- Alinhar logo, links de navegação e ações de autenticação em uma única linha no desktop.
- Manter os links principais:
  - `Início`
  - `Avaliações`
  - `Fórum`
- Manter ações de autenticação:
  - `Cadastrar`
  - `Entrar`
- Ajustar cores de texto, bordas, hover/active states e botões para contraste adequado em fundo claro.
- Preservar comportamento responsivo mobile.

### Fora do escopo

- Alterar rotas.
- Alterar autenticação.
- Alterar backend.
- Alterar contratos de API.
- Redesenhar hero, cards de avaliações ou demais seções da página.
- Criar novas funcionalidades de navegação.

## Requisitos visuais

- O header deve ter fundo branco.
- A logo colorida deve aparecer à esquerda, com proporção preservada.
- A navegação principal deve ficar próxima da logo no desktop.
- As ações `Cadastrar` e `Entrar` devem ficar alinhadas à direita.
- O botão `Entrar` deve usar a cor primária da marca.
- O link/botão `Cadastrar` deve ter aparência discreta, sem competir visualmente com `Entrar`.
- A altura do header deve ser próxima da referência e não deve parecer comprimida.
- A borda inferior deve ser sutil.

## Requisitos responsivos

- Em desktop, exibir logo, navegação principal e ações de autenticação na mesma linha.
- Em mobile, preservar menu compacto/hambúrguer se já existir.
- Em mobile, evitar quebra, sobreposição ou corte da logo e dos botões.
- O header deve continuar sticky se esse for o comportamento atual do componente.

## Requisitos técnicos

- Reutilizar o componente atual de navegação sempre que possível.
- Usar assets existentes em `public/logos/`.
- Preferir tokens semânticos definidos em `globals.css`.
- Evitar cores hardcoded quando houver token disponível.
- Não duplicar lógica de autenticação.
- Não alterar regras de sessão, logout ou redirecionamento.

## Arquivos prováveis

- `apps/web/components/Nav.tsx`
- `apps/web/app/globals.css`
- `apps/web/public/logos/papo-auto-logo-color.svg`

## Critérios de aceite

- O header bate visualmente com o print de referência em desktop.
- A logo colorida aparece corretamente em fundo branco.
- Os links `Início`, `Avaliações` e `Fórum` continuam funcionais.
- As ações `Cadastrar` e `Entrar` continuam funcionais para usuários deslogados.
- O menu de conta/logout continua funcional para usuários logados.
- O comportamento mobile não apresenta regressão.
- Não há sobreposição de elementos em larguras comuns de desktop e mobile.
- `pnpm --filter app lint` passa.
