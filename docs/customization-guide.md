# OceanCatch - Seafood & Fresh Fish Market Customization Guide

Welcome to the **OceanCatch** theme customization guide. This guide explains how to configure, customize, and deploy your fresh seafood marketplace website.

---

## 1. Quick Start

1. Open `index.html` in your browser to view **Home Page 1 (General Landing)**.
2. Open `home-2.html` to view **Home Page 2 (Daily Seafood Market Focus)**.
3. Open `docs/documentation.html` for the interactive developer manual.

---

## 2. Branding & Colors

Open `assets/css/style.css` and update the root CSS custom properties:

```css
:root {
  --color-primary: #0284c7;        /* Main ocean blue */
  --color-primary-dark: #0369a1;   /* Deep harbor blue */
  --color-secondary: #0f172a;      /* Text and dark headers */
  --color-coral: #f97316;          /* Call to action & badges */
  --color-seafoam: #10b981;        /* Freshness eco badges */
}
```

---

## 3. Modifying Products & Daily Catch

All product catalog items are stored in `assets/js/products.js`.

To add a new seafood product:
```javascript
{
  id: 'prod-custom-fish',
  name: 'King Snapper',
  category: 'fish',
  categoryLabel: 'Fresh Fish',
  price: 29.00,
  rating: 4.8,
  reviews: 42,
  badge: 'Daily Catch',
  badgeClass: 'badge-fresh',
  origin: 'Pacific Coral Reefs',
  image: 'https://your-image-url.jpg',
  desc: 'Sweet, tender white meat with high moisture retention.',
  cuts: ['Whole Cleaned', 'Curry Cut', 'Fillet'],
  available: true
}
```

---

## 4. Modifying Recipes

All recipes are stored in `assets/js/recipes.js`.
You can adjust prep times, categories, ingredients, and difficulty levels.

---

## 5. Contact & Phone Orders

Update your phone number and email address globally across HTML files:
- Phone: `+1 (800) 555-FISH`
- Email: `orders@oceancatchmarket.com`
- Harbor Pier: `Pier 44, Harbor Bay Coastal Docks`

---

## 6. RTL & Dark Mode

- Dark Mode and RTL states are stored in browser `localStorage`.
- No backend required; works seamlessly out of the box on static hosts (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3).
