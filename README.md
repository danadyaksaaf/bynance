# ⚡ Bynance — Landing Page

A small marketing landing page for a fictional product, Bynance — an AI-powered finance toolkit. This repo contains a homepage, features, pricing, and demo pages with responsive styles and light/dark theme support. ✨

## 🔍 Quick Preview

- Open `index.html` in your browser (double-click or serve with a simple local server).
- Demo page: `html/demo.html` (contains an embedded video frame with ambient glow).
- Features page: `html/feature.html` (cards with hover transform animations).

## 🚀 What’s included

- `index.html` — main landing page (hero, CTA).
- `html/feature.html` — features overview with animated cards.
- `html/demo.html` — demo page with rounded video embed and ambient glow.
- `html/pricing.html` — pricing cards and plans.
- `css/style.css` — site styles (light + dark theme variables, card hover animations, embed glow).
- `js/script.js` — small scripts for load/scroll animations.
- `js/darkmode.js` — dark mode toggle (keeps theme variables consistent).

## ✨ Highlights

- Theme-aware ambient glow for video embeds that matches the site colors.
- Smooth hover transforms and staggered reveal animations for feature cards.
- Responsive layout with sensible breakpoints for mobile.

## ⚙️ Development Notes

- Change the demo video by editing the YouTube ID in `html/demo.html` iframe `src`.
- Tweak colors in `css/style.css` by editing the CSS variables at the top (`:root` and `.dark-mode`).
- For local testing you can run a simple Python HTTP server from the project root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 🧾 License & Credits

This is a demo/sample project for learning and prototyping. Use and modify freely.

---
Made with ❤️ and a pinch of CSS magic.
