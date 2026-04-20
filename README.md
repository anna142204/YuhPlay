
# Yuhlearn

Application web de simulation et d'apprentissage autour de l'investissement.

Le projet combine:
- un parcours pédagogique (Learning path)
- un mode de simulation de marché (Playground)
- un système de récompenses (Rewards)
- une expérience gamifiée avec XP, missions et streak journalier

## Fonctionnalités principales

### 1) Learning path
- progression par unités
- étapes de cours + quiz
- investissement guidé selon la progression

### 2) Playground (simulation)
- scénarios de marché (balanced, bull, bear, volatile)
- achat/vente sur actifs avec portefeuille en direct
- limites auto-sell / auto-buy
- suivi de performance (retour, drawdown, diversification)
- missions journalières avec rewards XP

### 3) Rewards
- achievements (streak et objectifs globaux)
- rewards de complétion d'unités
- boutique cosmétique
- unlock promo en fin de parcours

### 4) Profil et gamification
- XP + niveau
- barre de progression
- streak journalier affiché dans la sidebar
- persistance locale de l'état (localStorage)

## Stack technique

- React 18
- Vite 6
- TypeScript
- Tailwind CSS 4
- Radix UI (composants UI)
- Lucide React (icônes)

## Prérequis

- Node.js 18+ recommandé
- npm

## Installation

1. Installer les dépendances

```bash
npm install
```

2. Lancer le serveur de développement

```bash
npm run dev
```

3. Ouvrir l'URL affichée dans le terminal (souvent http://localhost:5173)

## Scripts disponibles

- npm run dev : lance l'application en mode développement
- npm run build : génère le build de production

## Structure du projet

- src/app/App.tsx : orchestration globale, états, tabs, logique métier
- src/app/components : composants UI et pages
- src/app/data/assets.ts : données des actifs
- src/styles : styles globaux, theme, fonts, Tailwind

## Persistance et données

L'application sauvegarde une partie de l'état utilisateur en localStorage:
- progression unités
- portefeuille et soldes
- rewards claimés
- missions et cycle journalier
- streak de connexion

## Notes

- Le projet a été initialement bootstrapé depuis une base Figma Make puis fortement adapté.

## Site publié

- Lien de production: [YuhPlay](https://yuhlearn-simulator.netlify.app/)

## Crédits

- Projet par Lovelace

  
