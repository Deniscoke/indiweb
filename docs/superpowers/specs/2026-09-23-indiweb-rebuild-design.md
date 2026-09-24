# IndiWeb — rebuild webu (návrh)

**Dátum:** 2026-09-23
**Stav:** implementované na vetve feat/rebuild
**Autori:** Denis Mitrović (zadanie), Claude (návrh)

## 1. Cieľ

Nahradiť súčasnú jednostránku (jedno `index.html`, jedna služba „weby na míru", nefunkčný `mailto:` formulár) webom, ktorý:

- predstaví IndiWeb ako tím troch ľudí (Denis, Adam, Ondra), ktorí robia weby, vizualizácie, 3D / Gaussian splaty, AI agentov a konzultácie,
- dokazuje schopnosti reálnymi projektmi a vlastným produktom **Aria**,
- zbiera dopyty cez formulár, ktorý **spoľahlivo doručí** správu na `info.indiweb@gmail.com`,
- dá sa priebežne dopĺňať (nové projekty, profily členov) úpravou obsahových súborov, bez zásahu do komponentov.

### Mimo rozsahu (fáza 1)

- AI asistent / chat na webe — **fáza 2**, samostatný návrh. Fáza 1 s ním v kóde nepočíta, len mu nezatarasí cestu.
- Rezervačný kalendár — zámerne vypustený, jediná konverzná akcia je formulár.
- Blog, samostatné podstránky služieb, viacjazyčnosť.
- Presun Arie na `aria.indiweb.cz` — rieši sa v repozitári Arie a v DNS, IndiWeb mení iba jednu URL v obsahu.

## 2. Rozhodnutia

| Téma | Rozhodnutie |
|---|---|
| Jazyk webu | čeština (`lang="cs"`) |
| Konverzia | jeden formulár → e-mail na `info.indiweb@gmail.com` |
| Vizuál | tmavý prémiový štýl, vylepšený; 3D/splaty nie v hero, ale v portfóliu |
| Stack | Next.js (App Router) + TypeScript + Tailwind CSS, hosting Vercel (existujúci projekt) |
| Odosielanie e-mailov | Resend, volaný zo servera (Server Action); API kľúč len v env premennej |
| Aria | vlastná sekcia na úvodnej stránke + podstránka `/aria`; plná Aria stránka ostáva samostatný projekt, cieľovo na `aria.indiweb.cz` |
| Domény | cieľovo `indiweb.cz` a `aria.indiweb.cz`; kým nie sú, beží na `*.vercel.app` |

## 3. Mapa stránok

```
/                    úvodná stránka (všetky sekcie nižšie)
/aria                predstavenie produktu Aria
/projekty/[slug]     case study každého klientskeho projektu
```

Ďalšie stránky generované frameworkom: `sitemap.xml`, `robots.txt`, stránka 404 v dizajne webu.

## 4. Úvodná stránka — sekcie

| # | Sekcia | Obsah |
|---|---|---|
| 1 | Header | logo IndiWeb, menu (Služby · Aria · Projekty · O nás · Kontakt), tlačidlo „Napište nám" → `#kontakt`. Po scrollnutí sa rozmaže pozadie (ako teraz). Na mobile menu v rozbaľovacom paneli. |
| 2 | Hero | nadpis v duchu „Weby a digitální zážitky, které za vás pracují", podnadpis spomenie AI; hlavné tlačidlo → formulár, vedľajšie „Ukázky práce" → `#projekty`. |
| 3 | Služby | **Weby** ako hlavná veľká karta; pod ňou tri menšie: *3D a Gaussian splaty*, *AI agenti a integrace*, *Konzultace*. |
| 4 | Aria | výrazný blok „Aria — náš AI hlasový agent": čo robí (24/7 telefonáty, rezervácie, dotazy, odkazy), pre koho (malé firmy, reštaurácie), tlačidlá „Více o Arii" → `/aria` a „Vyzkoušet" → externá Aria URL. Vizuálne odlíšené od klientskych projektov — Aria je produkt, nie zákazka. |
| 5 | Projekty | karty klientskych projektov: screenshot v rámčeku zariadenia, názov, typ klienta, tagy, „Živá ukázka →" (externe); klik na kartu → `/projekty/[slug]`. |
| 6 | Jak pracujeme | 4 kroky: Poptávka → Návrh → Výroba → Spuštění. |
| 7 | O nás | tri karty (Denis, Adam, Ondra): meno, rola, krátke bio, voliteľne fotka. Ak má člen `website`, karta je odkaz, ktorý ho otvorí v novej karte (Denis → `https://mojweb2.vercel.app`). Bez `website` je karta neklikateľná. |
| 8 | Kontakt | formulár (sekcia 7 tohto dokumentu) + priamy e-mail ako alternatíva. |
| 9 | Footer | © rok, e-mail, odkazy na sekcie. IČO iba ak bude dodané. |

## 5. Podstránky

**`/aria`** — hero s názvom a claimom, čo Aria vybavuje (zoznam schopností), pre koho je, ako prebieha nasadenie, CTA „Vyzkoušet Aria" (externá URL) a „Chci Ariu pro svou firmu" → formulár na úvodnej stránke s predvolenou službou *AI agent*.

**`/projekty/[slug]`** — názov, klient a trh (SK/CZ), veľký screenshot, popis zadania a riešenia, zoznam toho, čo web obsahuje (highlights), tagy, „Otevřít web →". Dole navigácia na ďalší projekt a CTA na formulár. 3D/splat viewer sa pridá až s prvým projektom, ktorý ho potrebuje (načíta sa až po kliknutí).

Neexistujúci `slug` → 404.

## 6. Obsahový model

Všetok obsah je v `content/*.ts`, typovaný. Komponenty obsah iba zobrazujú.

```ts
// content/projects.ts
type Project = {
  slug: string;            // "elevator-servis"
  title: string;           // "Elevátor Servis"
  client: string;          // "Servis výtahů, Banská Bystrica"
  market: "SK" | "CZ";
  tags: string[];          // ["Web", "Služby", "B2B"]
  summary: string;         // 1 veta na karte
  description: string;     // odsek na podstránke
  highlights: string[];    // čo web obsahuje
  liveUrl: string;         // "https://elevatorservis.sk"
  image: string;           // "/projects/elevator-servis.webp"
};

// content/services.ts
type ServiceId = "web" | "3d" | "ai" | "konzultace";
type Service = { id: ServiceId; title: string; summary: string; points: string[]; featured?: boolean };

// content/team.ts
type TeamMember = { slug: string; name: string; role: string; bio: string; website?: string; photo?: string };

// content/aria.ts
type Product = { name: string; headline: string; tagline: string; description: string; url: string; capabilities: string[]; audience: string[]; rollout: { title: string; text: string }[] };

// content/site.ts — e-mail, názov, popis pre SEO, URL webu
```

Počiatočný obsah:
- **Projekty:** Elevátor Servis (`elevatorservis.sk`, SK, B2B servis výťahov), Esencia Viva (`esenciaviva.cz`, CZ, masáže a aromaterapia, rezervácie, e-shop, vernostný program).
- **Aria:** URL `https://aria-eta-five.vercel.app` (neskôr `https://aria.indiweb.cz`).
- **Tím:** Denis (web `https://mojweb2.vercel.app`), Adam, Ondra — role a bio doplnia členovia; dovtedy neutrálny text označený v súbore komentárom `// TODO: doplnit`.

Texty webu píše Claude v češtine, tím ich skontroluje.

## 7. Kontaktný formulár

**Polia:** Jméno (povinné, 2–100 znakov), E-mail (povinné, formát), O co máte zájem (voliteľný výber, hodnoty `ServiceId | "jine"`: Web · 3D / vizualizace · AI agent · Konzultace · Jiné), Zpráva (povinná, 10–5000 znakov), skryté pole `website` (honeypot).

**Tok:**
1. Prehliadač: natívna validácia + hlásenia pri poliach.
2. Odoslanie → Server Action `sendInquiry`.
3. Server: validácia cez `zod` (rovnaká schéma ako klient). Vyplnený honeypot → vráti úspech, nič neodošle.
4. Resend: `from: "IndiWeb <onboarding@resend.dev>"`, `to: info.indiweb@gmail.com`, `replyTo: <e-mail odosielateľa>` (na dopyt sa dá rovno odpovedať), predmet `Nová poptávka — <jméno> (<služba>)`.
5. Výsledok do UI: `success` | `invalid` (chyby pri poliach) | `error`.

**Chybové stavy:**
- `invalid` → hlásenia pri konkrétnych poliach, vyplnené hodnoty zostanú.
- `error` (Resend zlyhal alebo chýba `RESEND_API_KEY`) → správa „Odeslání se nepovedlo" + klikateľný `info.indiweb@gmail.com` a tlačidlo „Zkopírovat zprávu", aby sa text nestratil. Server chybu zaloguje (vidno vo Vercel Logs).
- Počas odosielania je tlačidlo zablokované (žiadne dvojité odoslanie).

**Známe obmedzenie:** bez rate-limitu. Honeypot + validácia stačia na štart; ak príde spam, doplní sa Vercel BotID.

CTA z `/aria` vedie na `/?sluzba=ai#kontakt` a formulár podľa parametra predvyplní službu. Neznáma hodnota parametra sa ignoruje.

## 8. Vizuálny systém

- **Farby:** pozadie takmer čierne (`#08080a` ako doteraz), svetlý text, jedna akcentová farba — chladná indigová (odvodená z existujúcej žiary `rgb(120 130 255)`), použitá striedmo: tlačidlá, zvýraznené slová, focus stavy. Kontrast textu minimálne WCAG AA.
- **Písmo:** Inter na bežný text; výraznejšie display písmo na nadpisy. Podmienka výberu: úplná podpora češtiny (`latin-ext`: ě š č ř ž ý á í é ů ú). Načítanie cez `next/font`.
- **Portfólio:** screenshoty projektov v CSS rámčeku okna prehliadača. Súčasné fotky: `macbook.png` → vizuál karty Weby, `phone.png` → vizuál sekcie Aria (telefón = hovory), `tablet.png` sa vypúšťa (biele pozadie, rozmazané okraje). Všetky obrázky cez `next/image` (WebP/AVIF, lazy loading), zdrojové súbory skonvertované do WebP.
- **Písmo nadpisov:** Bricolage Grotesque (overená podpora `latin-ext` v `next/font`).
- **Pohyb:** jemné odhalenie sekcií pri scrollovaní, rotujúce slovo v hero (prevzaté zo súčasného webu). Pri `prefers-reduced-motion` všetko statické.
- **Responzivita:** mobil (od 360 px) → desktop; žiadny horizontálny scroll.
- **Prístupnosť:** sémantické nadpisy, `alt` texty, viditeľný focus, polia formulára s `label`.

## 9. Technická štruktúra

```
app/
  layout.tsx                  fonty, metadáta, header, footer
  page.tsx                    úvodná stránka
  aria/page.tsx
  projekty/[slug]/page.tsx    generateStaticParams z content/projects.ts
  not-found.tsx
  sitemap.ts, robots.ts
  opengraph-image.tsx         náhľad pri zdieľaní
  actions/send-inquiry.ts     Server Action
components/                   sekcie a UI prvky (jeden komponent = jedna zodpovednosť)
content/                      obsah (sekcia 6)
lib/inquiry-options.ts        voľby služieb, typy stavu formulára (bez zod — importuje ho klient)
lib/inquiry-schema.ts         zod schéma a parseInquiry (server)
lib/inquiry-email.ts          zostavenie notifikačného e-mailu
public/projects/              screenshoty projektov
```

Všetky stránky sú statické (generované pri builde); dynamická je iba Server Action formulára.

**Env premenné:** `RESEND_API_KEY` (Vercel → Production + Preview). `.env.example` v repe, `.env*.local` v `.gitignore`.

**Súčasný web:** `index.html` a `images/` sa odstránia; história ostáva v gite. Použiteľné obrázky sa presunú do `public/` a skonvertujú.

## 10. Testovanie

- **Unit testy (Vitest):** `inquiry-schema` (validné/nevalidné vstupy, hranice dĺžok, honeypot) a `sendInquiry` s namockovaným Resendom (úspech, chyba Resendu, chýbajúci kľúč, honeypot).
- **Build:** `next build` bez chýb a typových chýb, lint čistý.
- **Manuálne v prehliadači:** všetky stránky na desktope a mobile (375 px), menu, interné aj externé odkazy, 404, odoslanie formulára v preview deploymente na skutočný e-mail.

## 11. Nasadenie

1. `vercel.json` v repe s `"framework": "nextjs"` prepíše framework preset projektu (overené v dokumentácii Vercelu), takže ručná zmena v nastaveniach nie je potrebná. Root Directory ostáva prázdne.
2. Tím založí Resend účet na `info.indiweb@gmail.com` a vloží `RESEND_API_KEY` do Vercel env.
3. Push do `main` → automatický deploy.
4. Neskôr: doména `indiweb.cz` → tento Vercel projekt; `aria.indiweb.cz` → Vercel projekt Arie; zmena URL v `content/aria.ts` a `content/site.ts`.

## 12. Čo treba od tímu

| Čo | Kedy | Blokuje? |
|---|---|---|
| Resend API kľúč | pred spustením formulára | len formulár — web beží aj bez neho, formulár ukáže záložný e-mail |
| Role a bio Adama a Ondru | kedykoľvek | nie (placeholder) |
| Fotky členov | voliteľné | nie |
| Ďalšie projekty (URL + pár viet) | priebežne | nie |
| IČO / fakturačné údaje do pätičky | voliteľné | nie |
| Kontrola textov | po prvom deployi | nie |
