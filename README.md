# Vinted Listing Pro (MVP V1)

Application web full-stack pour générer rapidement des fiches Vinted crédibles et professionnelles.

## Stack
- Frontend: React + Vite (créé manuellement, sans `create-vite`)
- Backend: Node.js + Express
- Stockage: fichier JSON local (`backend/src/data/listings.json`)

## Fonctionnalités V1
- Formulaire produit complet (14 champs demandés)
- Upload 1 à 10 photos, prévisualisation avant/après, réorganisation, choix photo principale
- Amélioration d’image locale (recadrage carré, redimensionnement homogène, luminosité/contraste/nettété légers)
- Génération automatique de contenu (titre, description simple/premium, mots-clés, checklist transparence)
- Module prix/marge (3 paliers de prix + marge/bénéfice estimés)
- Export rapide (copie texte + téléchargement images améliorées)
- Historique local (statut brouillon/publié/vendu + filtres marque/catégorie)
- Données de démonstration incluses: Nike, Adidas, Levi’s

## Structure

```bash
.
├── backend
│   ├── package.json
│   ├── server.js
│   └── src/data/listings.json
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components
│       │   ├── HistoryPanel.jsx
│       │   ├── ImageModule.jsx
│       │   ├── ProductForm.jsx
│       │   └── ResultPanel.jsx
│       ├── pages
│       │   └── DashboardPage.jsx
│       └── utils
│           └── helpers.js
└── package.json
```

## Installation et lancement

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API backend: http://localhost:3001

## V2 proposée (IA avancée)
- Suggestion IA de catégorie/sous-catégorie via vision + texte
- Génération multi-variantes A/B de titres/descriptions selon tendances Vinted
- Estimation de prix basée sur ventes comparables en temps réel
- Détection automatique des défauts visibles (sans suppression trompeuse)
- Suppression de fond avancée (segmentation IA) avec option “fond neutre” contrôlée
- Assistant de publication cross-plateformes (Vinted, Leboncoin, Depop)
