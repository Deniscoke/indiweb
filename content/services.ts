import type { Service } from './types'

export const services: Service[] = [
  {
    id: 'web',
    featured: true,
    title: 'Weby na míru',
    summary:
      'Rychlé a přehledné weby, které návštěvníkům řeknou to podstatné a dovedou je k poptávce.',
    points: [
      'Návrh i vývoj na míru, žádné šablony',
      'Rezervace, e-shop, více jazyků',
      'SEO a rychlé načítání v základu',
      'Úpravy a péče i po spuštění',
    ],
  },
  {
    id: '3d',
    title: '3D a Gaussian splaty',
    summary:
      'Interaktivní 3D prostředí a fotorealistické splaty prostor, kterými se dá projít přímo v prohlížeči.',
    points: ['Virtuální prohlídky prostor', '3D vizualizace produktů', 'Interaktivní scény na web'],
  },
  {
    id: 'ai',
    title: 'AI agenti a integrace',
    summary:
      'Hlasoví a chatovací agenti, kteří odpovídají vašim zákazníkům, a AI napojená na vaše procesy.',
    points: [
      'Hlasový agent na telefon',
      'Chatboti na web',
      'Automatizace a napojení na vaše systémy',
    ],
  },
  {
    id: 'konzultace',
    title: 'Konzultace',
    summary:
      'Pomůžeme vám rozhodnout, co dává smysl — web, AI, nebo obojí — a co si klidně ušetříte.',
    points: [
      'Audit současného webu',
      'Návrh digitálního řešení',
      'Kde vám AI reálně ušetří čas',
    ],
  },
]
