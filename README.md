# ParkMeFree

ParkMeFree est une application de gestion de parkings développée avec Vue 3 et Vite.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) (version 6 ou supérieure) 

## Installation

1. Clonez le dépôt :

   \`\`\`bash
   git clone https://github.com/ZoeMaitre/ParkMeFree.git
   cd votre-repo
   \`\`\`

2. Installez les dépendances :

   \`\`\`bash
   npm install
   \`\`\`

## Configuration

3. Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement nécessaires. Vous pouvez utiliser le fichier `.env.example` comme modèle.

   Exemple :

   \`\`\`env
   VITE_WS_URL=ws://localhost:3000
   VITE_API_URL=https://parkmefree.onrender.com/api
   \`\`\`

## Utilisation

Pour démarrer le serveur de développement, exécutez :

\`\`\`bash
npm run dev
\`\`\`

## Build

Pour générer une version de production, exécutez :

\`\`\`bash
npm run build
\`\`\`

Les fichiers de build seront générés dans le dossier `dist`.
