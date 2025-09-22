FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY envs.ts ./
COPY eslint.config.mjs ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY src ./src
COPY test ./test

# Compilamos a producción
RUN npm run build

# Exponemos el puerto (el mismo de Nest)
EXPOSE 3000

# Arranque en producción



CMD ["node", "dist/src/main.js"]

