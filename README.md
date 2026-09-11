# FlashCards

Application web (PWA) pour créer des jeux de cartes mémoire (clés → valeurs) et les réviser où que vous soyez, même hors ligne.

## Fonctionnalités

- **Gestion des jeux de cartes** : créer, renommer, modifier, **dupliquer**, trier (A → Z, Z → A, création) et supprimer vos jeux.
- **Import de cartes** :
  - JSON ou tableau **Markdown** (`chat` → `cat`) via collage ou fichier (`.json`, `.md`, `.txt`) ;
  - saisie manuelle ;
  - **restauration globale** d'une sauvegarde (ajout à l'existant).
- **Export** : un jeu en JSON ou Markdown, ou **tous les jeux** dans un fichier de sauvegarde global.
- **Mémorisation** :
  - **Simple** : les cartes défilent dans l'ordre ;
  - **Désordre** : cartes mélangées ;
  - **Interrogation** : carte retournée puis notée « Je savais » / « À revoir », avec barre de progression et **récapitulatif** en fin de partie (score, cartes à revoir).
  - **Pause et reprise d'interrogation** : quitter une partie ne perd pas l'historique — à la reprise, un écran propose de *reprendre là où vous en étiez* ou de *recommencer*.
- **Mode sombre** : bouton manuel, suivi de la préférence système par défaut (persisté).
- **PWA** : installable, fonctionne hors ligne (précache automatique).
- **Toasts** de confirmation/succès/erreur à chaque action.

## Technologies

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) + Vite 6
- [Tailwind CSS](https://tailwindcss.com/) v4
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Service Worker, manifest)
- [Vitest](https://vitest.dev/) + [ESLint](https://eslint.org/) (`eslint-plugin-vue`)

## Démarrage

Prérequis : **Node.js ≥ 18** (20 recommandé).

```bash
npm install     # installer les dépendances
npm run dev     # serveur de développement
```

## Scripts

| Commande            | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Serveur de développement (Vite)               |
| `npm run build`     | Build de production + génération du Service Worker |
| `npm run preview`   | Prévisualiser le build local                  |
| `npm run test`      | Exécuter les tests unitaires (Vitest)         |
| `npm run lint`      | Vérification ESLint                           |

## Structure du projet

```
flashCards/
├─ src/
│  ├─ assets/            # icônes et images
│  ├─ components/        # App, Memrise, DataSets, InsertData, DataTable, ToastHost
│  ├─ composables/       # useToast (système de notifications)
│  ├─ utils/             # cards.js : parsing/export des cartes + tests (cards.test.js)
│  ├─ App.vue            # écran d'accueil, navigation, mode sombre
│  ├─ main.js            # point d'entrée, bootstrap du thème
│  └─ style.css          # design system Tailwind (boutons, cartes, mode sombre)
├─ public/
├─ index.html
├─ vite.config.js        # base /flashCards/ + configuration PWA
└─ package.json
```

## Données & stockage

Les données sont stockées en `localStorage` (aucun serveur requis) :

| Clé                     | Contenu                                          |
| ----------------------- | ------------------------------------------------ |
| `flashCardDatasets`     | Jeux de cartes : `[{ id, name, cards: [{ key, value }] }]` |
| `flashCardsTheme`       | Préférence de thème (`dark` / `light`)           |
| `flashCardsQuizSession` | Interrogation en pause (historique, reprise)     |
| `listKeysValues`        | Ancien format, migré automatiquement             |

Exemple de structure d'un jeu :

```json
[
  {
    "id": "lx2k3m0abc",
    "name": "Anglais",
    "cards": [
      { "key": "chat", "value": "cat" },
      { "key": "chien", "value": "dog" }
    ]
  }
]
```

## Déploiement

Le dépôt inclut un workflow GitHub Actions (`.github/workflows/deploy.yml`) : à chaque `push` sur `main`, l'application est buildée et publiée sur la branche `gh-pages`.

Site publié : [https://kaenoo.github.io/flashCards/](https://kaenoo.github.io/flashCards/)