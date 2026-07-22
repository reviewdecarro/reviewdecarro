# Estágio de build
FROM node:24-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependências a partir da pasta apps/api
COPY apps/api/package*.json ./
RUN npm ci

# Copia todo o resto do projeto e faz o build
COPY . .
RUN cd apps/api && npm run build

# Estágio de produção
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia as dependências de produção para a raiz do container
COPY apps/api/package*.json ./
RUN npm ci --only=production

# Copia o resultado do build (a pasta dist) que foi gerado dentro de apps/api
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]