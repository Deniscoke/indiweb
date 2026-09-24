import type { Project } from './types'

/** Every screenshot is a 1440×900 viewport capture (see scripts/capture-screenshots.mjs). */
export const PROJECT_IMAGE_SIZE = { width: 1440, height: 900 } as const

export const projects: Project[] = [
  {
    slug: 'elevator-servis',
    title: 'Elevátor Servis',
    client: 'Servis výtahů, Banská Bystrica',
    market: 'SK',
    tags: ['Web', 'B2B', 'Služby'],
    summary:
      'Web pro servisní firmu, který mluví jazykem správců domů a vede je k nezávazné poptávce.',
    description:
      'Elevátor Servis se stará o více než 300 výtahů v Banské Bystrici a okolí. Web má správcům domů, firmám a institucím rychle ukázat, s čím jim firma pomůže, a důvěryhodně je dovést k poptávce. Stojí na konkrétních situacích, se kterými lidé volají — od opakovaných poruch až po uvíznutí ve výtahu.',
    highlights: [
      'Texty postavené na problémech zákazníků',
      'Samostatná stránka pro každou službu',
      'Viditelná nonstop havarijní linka',
      'Srozumitelný postup převzetí výtahu do servisu',
    ],
    liveUrl: 'https://elevatorservis.sk',
    image: '/projects/elevator-servis.webp',
  },
  {
    slug: 'esencia-viva',
    title: 'Esencia Viva',
    client: 'Masáže a aromaterapie',
    market: 'CZ',
    tags: ['Web', 'Rezervace', 'E-shop'],
    summary:
      'Jemný, atmosférický web, na kterém si klienti rezervují sezení i koupí produkty.',
    description:
      'Esencia Viva nabízí masáže, aromaterapii a práci s bylinkami. Web měl přenést klid, který klienti zažijí na sezení, a zároveň zvládnout praktické věci: rezervace, prodej produktů a věrnostní program. Výsledkem je vzdušný design s atmosférickým úvodem a kompletním právním zázemím pro e-shop.',
    highlights: [
      'Atmosférický úvod a klidný vizuální jazyk',
      'Rezervace prvního sezení',
      'E-shop s produkty a věrnostním programem',
      'Obchodní podmínky, ochrana údajů a cookies',
    ],
    liveUrl: 'https://esenciaviva.cz',
    image: '/projects/esencia-viva.webp',
  },
]
