# SUKAKA ART — Single-Page Tattoo Studio Website

Dark, cinematic, luxury tattoo studio website. 100% vanilla — HTML, CSS, JS.
No build step, no dependencies.

```
SukakaArt/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── artist.jpg          ← About section portrait
    ├── tattoo-1.jpg
    ├── tattoo-2.jpg
    ├── tattoo-3.jpg
    ├── tattoo-4.jpg
    ├── tattoo-5.jpg
    ├── tattoo-6.jpg
    ├── tattoo-7.jpg
    └── tattoo-8.jpg
```

If an image is missing, a tasteful red-tinted placeholder is shown automatically.

---

## 1. Run it locally

Just double-click `index.html` — or for full features (Maps iframe, fonts):

```bash
cd ~/Documents/SukakaArt
python3 -m http.server 5500
# open http://localhost:5500
```

---

## 2. Add the images

Download the photos from the Drive folder you shared and rename them:

```
Drive file              →   Save as
─────────────────────────────────────────────
06253f91…mp4 (video)    →   (skip — not used)
IMG_1877.HEIC           →   images/tattoo-1.jpg   (convert HEIC→JPG)
IMG_2161.HEIC           →   images/tattoo-2.jpg   (convert HEIC→JPG)
Photoroom_20250414_213000.jpeg → images/tattoo-3.jpg
Photoroom_20250414_213959.jpeg → images/tattoo-4.jpg
Photoroom_20250511_140948.jpeg → images/tattoo-5.jpg
Photoroom_20250511_141226.jpeg → images/tattoo-6.jpg
Photoroom_20250619_124403.jpeg → images/tattoo-7.jpg
Photoroom_20250918_181538.jpg  → images/tattoo-8.jpg
Photoroom_20250918_192243.jpg  → images/artist.jpg   (use the best portrait)
```

> macOS converts HEIC → JPG by opening in Preview → File → Export → JPEG.

---

## 3. Replace every `[FILL IN]`

Search the project for the string `[FILL IN]` and update:

| Where | What |
|---|---|
| `index.html` — About section | Artist bio (2 paragraphs) |
| `index.html` — Services cards | Three prices |
| `index.html` — Contact details | Address, phone, email, hours |
| `index.html` — Social links (3 places) | Instagram / Facebook / WhatsApp URLs |
| `index.html` — Maps iframe `src` | Your real Google Maps Embed link |
| `script.js` — `WHATSAPP_NUMBER` | Country code + number (e.g. `919999999999`) |

### Update the Google Maps iframe

1. Open Google Maps → search **Sukaka Art**
2. Click **Share** → **Embed a map** → **Copy HTML**
3. From the copied HTML, take only the `src="..."` value
4. Paste it as the `src` of the `<iframe>` in `index.html` (Contact section)

---

## 4. Publish on a FREE 24/7 domain

You have **3 great options**. Recommended: **Netlify Drop** (literally drag-and-drop, takes 30 seconds).

### Option A — Netlify Drop (easiest, no signup needed for first deploy)

1. Go to **https://app.netlify.com/drop**
2. Drag the entire `SukakaArt` folder onto the page
3. Done. You get a live URL like `https://sukaka-art.netlify.app` running 24/7
4. Click **Site settings → Change site name** to choose your subdomain
5. (Optional) Sign in to keep the site permanent and enable form submissions

> You can later attach a free `.tk` / `.cf` domain or buy a custom one (`sukakaart.com`) and connect it under **Domain settings**.

### Option B — Vercel (also one-click, GitHub-friendly)

1. Push the folder to a GitHub repo (e.g. `sukaka-art-site`)
2. Go to **https://vercel.com/new** → import the repo
3. Framework = **Other** → Deploy
4. URL: `https://sukaka-art.vercel.app` (free, 24/7, HTTPS)

### Option C — GitHub Pages (free, custom domain support)

```bash
cd ~/Documents/SukakaArt
git init
git add .
git commit -m "initial: sukaka art site"
gh repo create sukaka-art-site --public --source=. --push
```

Then on GitHub: **Settings → Pages → Source: `main` / root → Save**.
Live at `https://<your-username>.github.io/sukaka-art-site/`.

### Option D — Cloudflare Pages (fastest CDN, unlimited bandwidth)

1. Push to GitHub (same as Option C)
2. Go to **https://pages.cloudflare.com** → Connect repo
3. Build command: *(leave empty)* — Output dir: `/`
4. Live at `https://sukaka-art.pages.dev`

---

## 5. Free custom domain ideas

If you want something prettier than `*.netlify.app`:

| Provider | Cost | Example |
|---|---|---|
| **Freenom** *(when available)* | Free | `sukakaart.tk` |
| **is-a.dev / js.org** | Free for devs | `sukakaart.is-a.dev` |
| **Namecheap / Hostinger** | ~₹650/yr | `sukakaart.com` |

All four hosts above let you connect any custom domain for free (HTTPS auto-issued).

---

## Features Built In

- Ink-splash page loader (1.5 s)
- Animated red ink-drop cursor trail (desktop only)
- Letter-by-letter hero title reveal
- Auto-hiding navbar on scroll-down, reappears on scroll-up
- Smooth anchor scrolling
- IntersectionObserver scroll-reveal (fade + scale) on every section
- Pulsing "Book Now" CTA with red glow
- Hover-zoom gallery with red overlay + lightbox (← → ESC keys)
- Form submits via WhatsApp deep-link (configurable in `script.js`)
- Fully mobile responsive — burger menu under 880 px
- Reduced-motion friendly (respects OS setting)

Enjoy. Ink is not just art. It's identity.
