# Usa Node.js como base
FROM node:lts

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install --only=production

# Copiar el resto del código
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]
