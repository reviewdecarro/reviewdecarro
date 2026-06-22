# Task — Formulário de review em etapas

**Data:** 2026-06-19
**Área:** `apps/web/app/reviews/new`

## Objetivo

Transformar o formulário de criação de reviews em um fluxo progressivo por etapas, com no máximo quatro campos gerais por seção e todas as avaliações por estrelas reunidas na etapa final.

## Implementação

Dividir o formulário em quatro etapas:

1. **Veículo:** marca, modelo, ano e versão.
2. **Experiência:** título, conteúdo, meses de uso e quilometragem.
3. **Prós e contras:** pontos positivos e negativos.
4. **Avaliações:** todas as oito categorias de avaliação por estrelas.

- Exibir indicador com etapa atual, total e percentual concluído.
- Animar o preenchimento da barra ao mudar de etapa, usando uma transição CSS suave e um efeito de brilho semelhante a loading.
- Desabilitar as animações quando `prefers-reduced-motion` estiver ativo.
- Exibir os controles `Voltar` e `Continuar`, substituindo `Continuar` por `Publicar review` somente na última etapa.
- Preservar todos os valores preenchidos ao navegar entre etapas.
- Mover o foco para o título da nova etapa após avançar ou voltar.
- Retornar à primeira etapa e limpar os dados ao selecionar `Criar outra` após o sucesso.

## Validação e comportamento

- Exigir marca, modelo, ano e versão antes de sair da primeira etapa.
- Exigir título com pelo menos 3 caracteres e conteúdo com pelo menos 10 caracteres antes de sair da segunda etapa.
- Manter prós, contras, meses de uso e quilometragem opcionais.
- Exigir uma nota para todas as categorias antes da publicação.
- Manter autenticação, carregamento dos selects dependentes, tratamento de erros, tela de sucesso e contrato atual de `POST /reviews`.
- Não alterar o payload ou a API do backend.

## Critérios de aceite

- Cada etapa apresenta somente os campos definidos para sua seção.
- Voltar e avançar não apaga os valores já informados.
- Uma etapa inválida não permite o avanço e apresenta uma mensagem adequada.
- A barra progride suavemente a cada etapa e informa seu estado para tecnologias assistivas.
- A publicação ocorre somente na última etapa e mantém o fluxo de sucesso atual.
- O layout permanece responsivo.
- `pnpm --filter app lint` passa.
- `pnpm --filter app build` passa.
