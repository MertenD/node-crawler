# Setzen Sie das Basis-Image
FROM node:16-alpine

# Setzen Sie das Arbeitsverzeichnis
WORKDIR /app

# Kopieren Sie die Datei package.json (und die dazugehörige package-lock.json, falls vorhanden)
COPY package*.json ./

# Installieren Sie alle Abhängigkeiten
RUN npm install

# Kopieren Sie den Rest des Anwendungsquellcodes
COPY . .

# Bauen Sie Ihre Next.js-Anwendung
RUN npm install && npm run build

# Exponieren Sie den Port für den Next.js-Server (standardmäßig 3000)
EXPOSE 3002

# Führen Sie den Next.js-Server aus
CMD ["npm", "start"]

