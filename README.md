# ProMarket — Marketplace de petites annonces

Plateforme web de petites annonces multi-acteurs (particuliers, vendeurs professionnels et administrateur) avec messagerie intégrée, favoris, notifications et interface trilingue (FR / EN / AR).

## Stack technique

- **Frontend** : React 19, React Router 7, Axios, i18n (FR/EN/AR), contextes React (auth, langue, thème)
- **Backend** : Node.js, Express, MySQL (mysql2), JWT, bcryptjs, Multer + Cloudinary
- **Base de données** : MySQL 8, schéma fourni dans `backend/database/schema.sql`

## Structure du projet

```
├── backend/          # API REST Express (port 5000)
│   ├── config/       # Connexion MySQL
│   ├── controllers/  # Logique métier
│   ├── database/     # schema.sql
│   ├── middleware/   # Auth (JWT) + admin
│   ├── routes/       # Endpoints API
│   └── uploads/      # Fichiers envoyés (ignoré par Git)
└── frontend/         # Application React (port 3000)
    ├── public/
    └── src/
        ├── components/
        ├── context/
        ├── i18n/
        ├── pages/
        ├── services/   # Client API
        └── utils/
```

## Prérequis

- Node.js 18+
- MySQL 8+
- Cloudinary (optionnel — pour le téléversement d'images)

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/syntaxerror789/Marketplace.git
cd Marketplace

# 2. Base de données
mysql -u root -p < backend/database/schema.sql
```

### Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans `backend/` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=marketplace_annonces
JWT_SECRET=votre_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Démarrer le serveur :

```bash
npm start
# ou sous npm run dev (nodemon)
```

### Frontend

```bash
cd frontend
npm install
npm start
```

L'application est disponible sur `http://localhost:3000` et l'API sur `http://localhost:5000`.

## Fonctionnalités

- **Comptes & authentification** : inscription, connexion (JWT), mot de passe oublié/réinitialisation, profils publiques
- **Annonces** : création, édition, publication, filtres (catégorie, prix, état), recherche, tri, pagination
- **Favoris** / **Messagerie** avec fichiers / **Notifications**
- **Rôle vendeur** : tableau de bord, demandes de partenariat
- **Rôle admin** : modération des annonces et utilisateurs
- **i18n** : français, anglais, arabe + thème clair/sombre

## Scripts utiles

| Script            | Description                          |
|-------------------|--------------------------------------|
| `npm start` (backend) | Lance l'API Express sur le port 5000 |
| `npm start` (frontend) | Lance l'app React en développement  |

## Licence

MIT