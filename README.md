# Yasmeen Birthday Surprise ♡

A responsive, mobile-first birthday website with:
- Black and romantic pink styling
- English/Arabic language toggle and RTL layout
- Animated stars, reveal transitions, hearts and confetti
- Photo gallery with full-screen lightbox
- Interactive envelope and birthday letter
- Interactive cake candles
- Optional synthesized ambient tone (not a song or audio file)

## Run locally
You can simply open `index.html` in your browser. For a more reliable local preview, open the folder in VS Code and run it with the Live Server extension.

## Personalize the website
1. Open `index.html`.
2. Your eight photos are already included in `images/` and connected to the Memories gallery. To replace one later, overwrite the corresponding `yasmeen-photo-1` through `yasmeen-photo-8` file or update its image path in `index.html`.
3. Edit the birthday note in the `#modalCopy` section in `index.html`. The script has a bilingual version too, so update `modalCopy` in `script.js` if you want a different message in both languages.
4. Edit the English/Arabic hero messages in `index.html` (`data-en` and `data-ar` attributes).
5. The site uses Google Fonts and sample images from Unsplash, so those external resources need an internet connection. Local photos work offline.

## Deploy to Vercel (free static site)
### Option A — GitHub (recommended)
1. Extract the ZIP.
2. Create a new repository on GitHub and upload the contents of this folder (`index.html`, `style.css`, `script.js`, `images/`, `README.md`).
3. Sign in to https://vercel.com with GitHub.
4. Choose **Add New → Project**, then import your repository.
5. Framework preset: **Other**. Leave Build Command and Output Directory empty/default; this is a static site.
6. Click **Deploy**. Vercel will provide a public `*.vercel.app` link.
7. Send the link to Yasmeen. You can redeploy by pushing later changes to GitHub.

### Option B — Vercel CLI
Install Node.js, then run:
```bash
npm install -g vercel
cd yasmeen-birthday-website
vercel
```
Follow the prompts. Use `vercel --prod` for a production deployment.

No API key or backend is required.


## Add the birthday song
Place your MP3 file in the `music/` folder and name it exactly `birthday-song.mp3`.
The music button (♫) plays and pauses that local file. Browsers generally require a user tap before audio can start.
