# 🎴 Flashcards App

Application de révision par flashcards développée avec Next.js, React et TypeScript.

## 📋 Fonctionnalités

- ✨ **Création de cartes** : Créez et éditez vos propres flashcards
- 📚 **Organisation en decks** : Organisez vos cartes par catégories
- 🔄 **Modes de révision** : Normal, inversé, cartes incorrectes, favoris
- ⭐ **Favoris** : Marquez vos cartes importantes
- 📊 **Statistiques** : Suivez vos progrès et votre taux de réussite
- ⚙️ **Paramètres** : Import/Export JSON, délai autoplay, etc.
- 🎯 **Mode autoplay** : Révision automatique avec délai configurable

## 🚀 Démarrage

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build

```bash
npm run build
npm start
```

## 📁 Structure du projet

```
flashcards-app/
│
├── app/
│   ├── page.tsx               # Écran de révision principal
│   ├── create/
│   │   └── page.tsx           # Création / édition de cartes
│   ├── stats/
│   │   └── page.tsx           # Statistiques détaillées
│   ├── settings/
│   │   └── page.tsx           # Paramètres
│   ├── _components/
│   │   ├── Layout.tsx         # Layout global avec navigation
│   │   ├── Card.tsx           # Affichage de carte avec flip
│   │   ├── CardActions.tsx    # Boutons d'action
│   │   ├── CardForm.tsx       # Formulaire de création
│   │   ├── DeckSelector.tsx   # Sélecteur de deck
│   │   ├── StatsSummary.tsx   # Résumé des stats
│   │   └── ToggleSwitch.tsx   # Switch pour options
│   ├── globals.css
│   └── layout.tsx
│
├── lib/
│   ├── types.ts               # Types TypeScript
│   ├── storage.ts             # Gestion localStorage
│   ├── utils.ts               # Fonctions utilitaires
│   ├── stats.ts               # Calculs statistiques
│   └── autoplay.ts            # Gestion du mode autoplay
│
├── data/
│   └── defaultCards.json      # Données de test par défaut
│
└── public/
    └── icons/                 # Icônes (PWA)
```

## 💾 Stockage des données

Les données sont stockées localement dans le navigateur via **localStorage** :

- Decks de cartes
- Flashcards
- Statistiques de révision
- Paramètres utilisateur

## 🎨 Technologies

- **Next.js 15** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **localStorage** - Persistance des données

## ✨ Fonctionnalités implémentées

### 🎴 Révision
- ✅ Tirage de carte aléatoire
- ✅ Système ✔️/✖️ (réussite/échec)
- ✅ Mode révision inversée
- ✅ Mode "cartes ratées uniquement"
- ✅ Mode favoris ⭐
- ✅ Shuffle intelligent
- ✅ Statistiques de session en temps réel
- ✅ Design minimaliste et élégant avec excellent contraste

### ✨ Création
- ✅ Double input (langue cible + traduction)
- ✅ Gestion des decks/catégories
- ✅ Modification et suppression de cartes
- ✅ Recherche dans les flashcards
- ✅ Organisation par collections

### 📊 Statistiques
- ✅ Nombre de cartes apprises
- ✅ % de réussite global
- ✅ Nombre total de cartes
- ✅ Cartes les plus difficiles
- ✅ Filtrage par deck
- ✅ Détail par deck

### ⚙️ Paramètres
- ✅ Import/Export JSON
- ✅ Téléchargement de backup
- ✅ Configuration du délai autoplay
- ✅ Mode de révision par défaut
- ✅ Suppression de toutes les données

## 📦 Données par défaut

L'application inclut des decks de démonstration :
- 🇬🇧 Anglais - Vocabulaire de base
- 🇪🇸 Espagnol - Verbes courants
- 💻 Programmation - JavaScript

## 🔄 Import / Export

Exportez vos données au format JSON pour sauvegarde ou partage, et importez-les sur un autre appareil.

## 📝 License

MIT
