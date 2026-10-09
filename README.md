# SKULLVI Talent Engine : interface web

Interface React du Mini-Challenge « Talent Engine » (SKULLVI – GevConsulting HCP) :
formulaire de candidature public, et espace recruteur (classement, détail du score).

Le projet complet (présentation, logique de scoring, modèle de données, limites) est
décrit dans le README du backend : **[lien vers le README principal]**.

## Stack

React, TypeScript, Vite, React Router, Axios.

## Lancement

Prérequis : Node.js 18 ou supérieur, et le backend démarré (par défaut sur le port 5001).

```bash
npm install
cp .env.example .env        # Windows : copy .env.example .env
npm run dev
```

L'application est disponible sur http://localhost:5173.

| Variable | Rôle | Valeur par défaut |
|---|---|---|
| `VITE_API_URL` | adresse du backend | `http://localhost:5001` |

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | vérification des types TypeScript et build de production |
| `npm run lint` | analyse du code avec ESLint |

## Organisation du code

- `src/data/models` : types TypeScript reflétant les réponses de l'API
- `src/pages` : un dossier par entité (candidatures, programmes, compétences, accueil, connexion)
- `src/components` : composants réutilisables (`Button`, `Input`, `Card`, `Alert`, `Navbar`…)
- `src/providers` : routeur et gestion de la session (`AuthProvider`)

## Parcours

- **Candidat** (sans compte) : liste des programmes ouverts, puis formulaire de candidature.
- **Recruteur** : connexion en deux étapes (mot de passe, puis code reçu par e-mail), puis
  création de programmes, classement des candidatures et page de détail du score.