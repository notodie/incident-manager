# Incident Manager

Une application web pour la gestion des incidents et des plans de continuité d'activité.

## Fonctionnalités

- Gestion des incidents
  - Déclaration d'incidents
  - Suivi de l'état des incidents
  - Affectation des responsables
  - Filtrage et recherche

- Plans de continuité d'activité
  - Création et gestion des plans
  - Étapes détaillées
  - Association aux services

- Tests de reprise
  - Simulation des scénarios d'incident
  - Suivi des résultats
  - Rapports automatiques

- Gestion des utilisateurs
  - Authentification
  - Rôles (administrateur, utilisateur standard, équipe technique)
  - Permissions

## Prérequis

- Node.js 18 ou supérieur
- PostgreSQL 12 ou supérieur
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/incident-manager.git
cd incident-manager
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Modifier le fichier `.env` avec vos paramètres :
- `DATABASE_URL` : URL de connexion à la base de données PostgreSQL
- `NEXTAUTH_SECRET` : Clé secrète pour l'authentification
- `NEXTAUTH_URL` : URL de l'application (http://localhost:3000 en développement)
- `SMTP_*` : Configuration du serveur SMTP pour les notifications

4. Initialiser la base de données :
```bash
npx prisma generate
npx prisma db push
```

5. Créer un utilisateur administrateur :
```bash
npx prisma db seed
```

## Démarrage

1. Lancer l'application en mode développement :
```bash
npm run dev
# ou
yarn dev
```

2. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement

1. Construire l'application :
```bash
npm run build
# ou
yarn build
```

2. Démarrer l'application en production :
```bash
npm start
# ou
yarn start
```

## Structure du projet

```
src/
  ├── app/                    # Pages et routes de l'application
  │   ├── api/               # API routes
  │   ├── auth/              # Pages d'authentification
  │   ├── incidents/         # Pages de gestion des incidents
  │   ├── plans/             # Pages de gestion des plans
  │   └── tests/             # Pages de gestion des tests
  ├── components/            # Composants React réutilisables
  ├── hooks/                 # Hooks personnalisés
  └── lib/                   # Utilitaires et configurations
prisma/
  └── schema.prisma         # Schéma de la base de données
```

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM pour la base de données
- [NextAuth.js](https://next-auth.js.org/) - Authentification
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [React Hook Form](https://react-hook-form.com/) - Gestion des formulaires
- [Zod](https://github.com/colinhacks/zod) - Validation des données

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
