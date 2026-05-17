# 🐾 DoGame

**משחק התאמת גזעי כלבים אינטראקטיבי בעברית.** עוזר לאנשים השוקלים לאמץ או לרכוש כלב להבין איזה גזע יתאים לסגנון החיים שלהם — לפני שמביאים כלב הביתה.

> ⅓ מהכלבים בעולם מוחזרים למחסות בשנה הראשונה. הסיבה הראשונה: אי-התאמה. DoGame בנוי כדי לעזור לבחור נכון.

## Features

- 🎮 **שאלון דינמי** של 9–15 שאלות, מסתגל לתשובות קודמות
- 🧮 **אלגוריתם משוקלל** של 10 צירי תכונות (גודל, אנרגיה, אילוף, אקלים…) + 5 חוקי deal-breaker
- 🐶 **37 גזעים פופולריים בישראל** (כולל הכלב הכנעני) עם תמונות אמיתיות מוויקיפדיה
- 📊 **תוצאות עשירות** — top 5 גזעים, אחוזי התאמה, חוזקות, watch-outs, רדאר השוואה
- 🔗 **קישור לוויקיפדיה** בעברית/אנגלית לכל גזע
- 💾 **שמירה מקומית** ב-localStorage (ללא הרשמה, ללא ענן)
- 🎨 **עיצוב Claymorphism** — חם, ילדותי, RTL מלא
- 🎬 **אנימציות עשירות** — magnetic buttons, count-up, confetti, parallax, scroll reveals
- ♿ **נגישות**: prefers-reduced-motion, aria-live, focus rings, SR-friendly radar

## Tech Stack

- **Next.js 16** (App Router, Turbopack, static export)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (RTL, design tokens)
- **Motion** (formerly Framer Motion) — wrapped in `<MotionConfig reducedMotion="user">`
- **Zustand** — quiz state + localStorage persistence
- **Lucide React** — icons
- **Heebo** + **Rubik** — Hebrew-optimized typography
- **Wikipedia REST API** — breed photos and articles (CC-licensed)

## Local Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export → ./out
npm run lint
```

## Project Structure

```
app/                  # Next.js App Router routes (landing, quiz, result, breed/[slug], about)
components/           # UI primitives, quiz, result, breed, landing, providers
lib/                  # traits, breeds (data + matcher), quiz (engine + deal-breakers)
data/                 # breeds.json (37 breeds), questions.json (quiz bank)
store/                # Zustand quiz store
scripts/              # enrich-breeds.mjs (Wikipedia image fetcher)
```

## Deployment

The site is a 100% static export — works on any static host.

### Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy out --project-name=dogame
```

### Connecting via Git (auto-deploy)

In the Cloudflare dashboard:
- Pages → Create → Connect to Git → select this repo
- Build command: `npm run build`
- Build output: `out`
- Production branch: `main`

## License

Code: MIT. Breed photos: CC-licensed via Wikimedia Commons (attribution to Wikipedia).

🐾 נבנה באהבה לכלבי ישראל ולמשפחות שלהם.
