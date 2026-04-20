
# Yuhlearn

Web application for investment simulation and learning.

The project combines:
- a guided learning path
- a market simulation mode (Playground)
- a rewards system (Rewards)
- a gamified experience with XP, missions, and daily streaks

## Main features

### 1) Learning path
- unit-based progression
- lesson steps + quizzes
- guided investing based on progress

### 2) Playground (simulation)
- market scenarios (balanced, bull, bear, volatile)
- buy/sell assets with a live portfolio
- auto-sell / auto-buy limits
- performance tracking (return, drawdown, diversification)
- daily missions with XP rewards

### 3) Rewards
- achievements (streaks and global objectives)
- unit completion rewards
- cosmetic shop
- promo unlock at the end of the learning path

### 4) Profile and gamification
- XP + level
- progress bar
- daily streak displayed in the sidebar
- local state persistence (localStorage)

## Technical stack

- React 18
- Vite 6
- TypeScript
- Tailwind CSS 4
- Radix UI (UI components)
- Lucide React (icons)

## Prerequisites

- Node.js 18+ recommended
- npm

## Installation

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open the URL shown in the terminal (usually http://localhost:5173)

## Available scripts

- npm run dev: starts the application in development mode
- npm run build: generates a production build

## Project structure

- src/app/App.tsx: global orchestration, state, tabs, and business logic
- src/app/components: UI components and pages
- src/app/data/assets.ts: asset data
- src/styles: global styles, theme, fonts, Tailwind

## Persistence and data

The application saves part of the user state in localStorage:
- unit progression
- portfolio and balances
- claimed rewards
- missions and daily cycle
- login streak

## Notes

- The project was initially bootstrapped from a Figma Make base and then heavily customized.

## Published site

- Production link: [YuhPlay](https://yuhlearn-simulator.netlify.app/)

## Credits

- Project by Lovelace

  
