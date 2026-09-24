# IndiWeb

Web IndiWebu — Denis, Adam a Ondra. Next.js 16, Tailwind CSS 4, nasadenie na Verceli.

## Vývoj

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest
npm run lint
npm run build
```

## Kde sa čo upravuje

| Čo | Súbor |
|---|---|
| Texty úvodu, navigácia, e-mail, fotky | `content/site.ts` |
| Služby | `content/services.ts` |
| Projekty v portfóliu | `content/projects.ts` |
| Tím (role, bio, osobné weby, fotky) | `content/team.ts` |
| Aria (texty, URL) | `content/aria.ts` |
| Postup spolupráce | `content/process.ts` |
| Farby a písma | `app/globals.css` |

## Nový projekt do portfólia

1. Pridaj blok do `content/projects.ts` (`slug`, texty, `liveUrl`, `image: '/projects/<slug>.webp'`).
2. Vygeneruj screenshot (používa Microsoft Edge vo Windows):
   ```bash
   node scripts/capture-screenshots.mjs <slug>=<url>
   ```
3. `npm test` overí, že screenshot existuje a má správny rozmer. Podstránka `/projekty/<slug>` sa vytvorí sama.

## Formulár

Dopyty chodia cez [Resend](https://resend.com) na `info.indiweb@gmail.com`.

- Resend účet musí byť založený na `info.indiweb@gmail.com` — testovací odosielateľ `onboarding@resend.dev` doručuje iba majiteľovi účtu.
- API kľúč nastav vo Verceli ako `RESEND_API_KEY` (Production aj Preview). Lokálne do `.env.local` (vzor: `.env.example`).
- Bez kľúča web funguje, formulár pri odoslaní ukáže záložný e-mail.
- Po kúpe domény: overiť ju v Resende a zmeniť odosielateľa v `lib/inquiry-email.ts`.

## Nasadenie

Každý push do `main` nasadí Vercel automaticky (`vercel.json` nastavuje framework Next.js). Iné vetvy dostanú preview URL.
Voliteľne `NEXT_PUBLIC_SITE_URL` — kanonická adresa webu; inak sa použije produkčná doména z Vercelu.

Po prvom nasadení skontroluj, že `/robots.txt`, `/sitemap.xml` a `og:image` host ukazujú na skutočnú doménu. Až bude vlastná doména hotová, nastav `NEXT_PUBLIC_SITE_URL`.

## Intro (úvodná animácia)

Svetelná scéna je „Aperture Light" od **Filipa Zrnzevića** ([CodePen](https://codepen.io/filipz/pen/01a08bf0-ef4f-7088-ac72-0c7fca61a657)), prevzatá bez zmien v `components/intro/aperture/engine.js`. Nápis IndiWeb, časovanie a správanie sú v `components/intro/intro-cinematic.tsx` a `lib/intro.ts`.

- **Pred nasadením na produkciu je potrebný súhlas autora** (pen nemá uvedenú licenciu).
- Prehrá sa raz za návštevu (sessionStorage), dá sa preskočiť (tlačidlo, klik, Esc); vynechá sa pri „obmedziť pohyb" a bez WebGL 2.
- Three.js sa načíta len keď sa intro reálne prehráva.
- Dĺžka a rýchlosť: `SCENE_START`, `SCENE_END`, `SCENE_RATE` v `lib/intro.ts`; poloha nápisu: `INTRO_TEXT_Y`.
