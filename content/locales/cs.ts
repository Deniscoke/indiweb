import type { PluralForms } from '@/lib/i18n'
import type { FabSlug } from '../fab'
import type { ProjectSlug } from '../projects'
import type { NavSection } from '../site'
import type { TeamSlug } from '../team'
import type { Market, ProjectText, ServiceId, ServiceText, Step, TeamMemberText } from '../types'
import type { InquiryService } from '@/lib/inquiry-options'
import type { VoiceSlug } from '@/lib/voice-agent'

/**
 * Every text of the site in Czech, the source language. The other languages
 * (en.ts, de.ts) must have exactly this shape. Plain data only: the dictionary
 * is handed to client components, so it cannot hold functions. `{name}` marks a
 * value filled in by the code (see `format` and `plural` in lib/i18n.ts).
 */
export const cs = {
  site: {
    title: 'IndiWeb — weby na míru, 3D a AI agenti',
    description:
      'Denis, Adam a Ondra. Navrhujeme weby, 3D vizualizace a AI agenty, kteří za vás zvednou telefon.',
    /** The picture shown when a page is shared (app/[lang]/opengraph-image.tsx). */
    shareImage: {
      alt: 'IndiWeb — weby, 3D a AI agenti',
      headline: 'Weby, 3D a AI agenti',
      tagline: 'Weby na míru · 3D a Gaussian splaty · AI hlasoví agenti',
    },
  },

  common: {
    skipToContent: 'Přeskočit na obsah',
    opensInNewWindow: '(otevře se v novém okně)',
    tags: 'Štítky',
    markets: { SK: 'Slovensko', CZ: 'Česko' } satisfies Record<Market, string>,
  },

  nav: {
    sluzby: 'Služby',
    splaty: '3D',
    aria: 'Aria',
    projekty: 'Projekty',
    fab: 'Assety',
    'o-nas': 'O nás',
    kontakt: 'Kontakt',
  } satisfies Record<NavSection, string>,

  header: {
    contact: 'Napište nám',
    openMenu: 'Otevřít menu',
    closeMenu: 'Zavřít menu',
    menu: 'Menu',
    mainNav: 'Hlavní navigace',
    languages: 'Jazyk',
  },

  footer: {
    tagline: 'Tvoříme s péčí.',
    nav: 'Patička',
    privacy: 'Ochrana osobních údajů',
  },

  hero: {
    /** Three lines spread across the hero, lit by the pointer. */
    lines: ['Navrhneme.', 'Postavíme.', 'Rozsvítíme.'],
    subtitle:
      'Weby, 3D vizualizace a AI agenti od Denise, Adama a Ondry. Na míru, rychle a s AI v každém kroku.',
    hint: 'Odpovídáme do 24 hodin, nezávazně.',
    contact: 'Napište nám',
    work: 'Ukázky práce',
  },

  media: {
    laptopAlt: 'Pootevřený MacBook ve tmě',
    phoneAlt: 'Chytrý telefon ve tmě',
  },

  services: {
    title: 'Web je základ. 3D a AI jsou důvod, proč bude lepší.',
    lead: 'Navrhujeme a stavíme weby na míru. A když to dává smysl, přidáme 3D, splaty nebo AI agenta, který za vás odvede kus práce.',
    items: {
      web: {
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
      '3d': {
        title: '3D a Gaussian splaty',
        summary:
          'Interaktivní 3D prostředí a fotorealistické splaty prostor, kterými se dá projít přímo v prohlížeči.',
        points: ['Virtuální prohlídky prostor', '3D vizualizace produktů', 'Interaktivní scény na web'],
      },
      ai: {
        title: 'AI agenti a integrace',
        summary:
          'Hlasoví a chatovací agenti, kteří odpovídají vašim zákazníkům, a AI napojená na vaše procesy.',
        points: [
          'Hlasový agent na telefon',
          'Chatboti na web',
          'Automatizace a napojení na vaše systémy',
        ],
      },
      konzultace: {
        title: 'Konzultace',
        summary:
          'Pomůžeme vám rozhodnout, co dává smysl — web, AI, nebo obojí — a co si klidně ušetříte.',
        points: [
          'Audit současného webu',
          'Návrh digitálního řešení',
          'Kde vám AI reálně ušetří čas',
        ],
      },
    } satisfies Record<ServiceId, ServiceText>,
  },

  splat: {
    eyebrow: 'Ve spolupráci se Splatoo',
    title: 'Projděte se zámkem. Přímo v prohlížeči.',
    lead: 'Sál zámku ve Žďáru nad Sázavou jako Gaussian splat: rozhlédněte se, přibližte si detaily a projděte prostor, jako byste v něm stáli. Stejně tak mohou vaši zákazníci poznat vaše místo dřív, než do něj vstoupí.',
    sceneTitle: 'Žďár nad Sázavou — zámek, hlavní sál',
    loading: 'Načítám 3D prohlídku…',
    open: 'Otevřít ve Splatoo',
    collaboration: [
      'Se Splatoo spolupracujeme na projektech 3D prohlídek',
      'Pracujeme na integraci splatů do Unreal Enginu',
      'Rozšiřujeme Splatoo o AI prvky a napojení AI nástrojů',
    ],
  },

  aria: {
    headline: 'Aria — náš AI hlasový agent',
    tagline: 'AI hlasový agent, který vezme každý telefon.',
    description:
      'Aria za vás 24 hodin denně zvedá telefony — odpovídá na dotazy, přijímá rezervace a zapisuje vzkazy. Vy se věnujete zákazníkům na místě a žádný hovor nepropadne.',
    capabilities: [
      'Zvedá telefony 24/7, i když máte plné ruce práce',
      'Přijímá rezervace termínů a stolů',
      'Odpovídá na časté dotazy — otevírací dobu, ceny, adresu',
      'Zapisuje vzkazy, abyste o nic nepřišli',
    ],
    audience: [
      'Restaurace a kavárny',
      'Salony a studia',
      'Servisy a řemeslníci',
      'Malé firmy, které nestíhají telefon',
    ],
    // TODO: doplnit — postup nasazení ověří tým podle toho, jak Ariu reálně nasazuje.
    rollout: [
      { title: 'Úvodní hovor', text: 'Projdeme, jaké hovory vám chodí a co má Aria vyřizovat.' },
      {
        title: 'Nastavení',
        text: 'Naučíme Ariu vaše služby, ceny, otevírací dobu a pravidla rezervací.',
      },
      { title: 'Zkušební provoz', text: 'Vyzkoušíte si ji sami, než ji pustíte k zákazníkům.' },
      { title: 'Spuštění', text: 'Přesměrujete číslo a Aria začne zvedat telefony.' },
    ] satisfies Step[],
    more: 'Více o Arii',
    try: 'Vyzkoušet Ariu',
    /** The page at /aria. */
    page: {
      metaTitle: 'Aria — AI hlasový agent, který zvedne každý telefon',
      // For search results: the description above, cut to fit.
      metaDescription:
        'Aria za vás 24 hodin denně zvedá telefony: odpovídá na dotazy, přijímá rezervace a zapisuje vzkazy. Žádný hovor nepropadne.',
      /** What kind of service Aria is, for search engines. */
      serviceType: 'AI hlasový agent',
      eyebrow: 'Náš vlastní produkt',
      cta: 'Chci Ariu pro svou firmu',
      capabilitiesTitle: 'Telefon, který nikdy nezvoní naprázdno.',
      audienceTitle: 'Pro všechny, kdo nestíhají zvedat telefon.',
      rolloutTitle: 'Jak Ariu spustíme u vás.',
      closingTitle: 'Chcete Ariu i u vás?',
      closingLead: 'Napište nám, jaké hovory vám chodí. Ozveme se do 24 hodin.',
    },
  },

  voiceDemo: {
    call: 'Promluvit s Ariou',
    connecting: 'Připojuji…',
    hangUp: 'Ukončit hovor',
    status: {
      speaking: 'Aria mluví…',
      listening: 'Poslouchám vás…',
      connecting: 'Spojuji…',
    },
    notices: {
      unavailable: 'Ukázka teď není k dispozici. Zkuste to prosím později, nebo nám rovnou napište.',
      busy: 'To už bylo hodně hovorů za sebou. Zkuste to prosím znovu za pár minut.',
      microphone: 'Na hovor s Ariou je potřeba mikrofon. Povolte ho prosím v prohlížeči.',
      failed: 'Hovor se nepodařilo spojit. Zkontrolujte mikrofon a zkuste to znovu.',
    },
    /** What Aria just said, in the language's quotation marks. */
    quote: '„{text}“',
    chooseVoice: 'Vyberte Ariin hlas',
    voices: {
      marketa: 'Jasný, příjemný ženský hlas',
      katy: 'Mladý, přirozený ženský hlas',
      marek: 'Sametový, klidný mužský hlas',
      kuba: 'Uvolněný mužský hlas',
    } satisfies Record<VoiceSlug, string>,
    finePrint: 'Živá ukázka přes ElevenLabs · nejvýš {minutes} minuty · potřebuje mikrofon ·',
    privacyLink: 'Jak zpracováváme hlas',
    /** Shown under the demo when not empty, e.g. to say that Aria speaks Czech. */
    languageNote: '',
  },

  projects: {
    title: 'Každý klient dostane web, který sedí jemu. Ne šabloně.',
    lead: 'Výtahová firma potřebuje něco jiného než terapeutka. Podívejte se, jak to vypadá v praxi.',
    screenshotAlt: 'Úvodní obrazovka webu {title}',
    liveDemo: 'Živá ukázka',
    back: 'Všechny projekty',
    openSite: 'Otevřít web',
    wantSimilar: 'Chci podobný web',
    about: 'O projektu',
    features: 'Co web umí',
    next: 'Další projekt',
    items: {
      'elevator-servis': {
        client: 'Servis výtahů, Banská Bystrica',
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
      },
      'esencia-viva': {
        client: 'Masáže a aromaterapie',
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
      },
    } satisfies Record<ProjectSlug, ProjectText>,
  },

  fab: {
    eyebrow: 'IndiWeb Store na Fabu',
    title: 'Stavíme i pro hry. Naše assety běží v Unreal Enginu.',
    lead: 'Na Fabu, obchodě Epic Games, prodáváme vlastní pluginy, efekty a prostředí pro Unreal Engine 5. Vývojáři si je stáhnou a mají je ve hře během pár minut.',
    facts: ['Unreal Engine 5', 'C++ i Blueprint', 'Multiplayer'],
    factsLabel: 'Technologie',
    opensOnFab: '(otevře se v novém okně na Fabu)',
    /** "15 produktů na Fabu", "3 produkty na Fabu", "1 produkt na Fabu". */
    productsOnFab: {
      one: '{count} produkt na Fabu',
      few: '{count} produkty na Fabu',
      other: '{count} produktů na Fabu',
    } as PluralForms,
    store: 'Celý obchod na Fabu',
    /** What each listing is, in a few words. */
    kinds: {
      'combat-vfx': 'VFX · Niagara',
      'arena-match': 'Plugin · Multiplayer',
      'voxel-spell-fx': 'Plugin · Kouzla',
      'gravity-lift': 'Plugin · Gameplay',
      'lumenroute-scifi': 'Prostředí · Sci-fi',
      'multiplayer-objectives': 'Plugin · Multiplayer',
      'swap-destruction': 'Plugin · Fyzika',
      'fp-parkour': 'Plugin · Pohyb',
      'combat-feedback': 'UI kit',
      'lumenroute-floor': 'Materiály',
      'lumenroute-cargo': 'Materiály',
      'options-rebinding': 'Plugin · UI',
      'pixel-grid': 'Nástroj · Editor',
      'cook-path-guard': 'Nástroj · Editor',
      'bench-walk': 'Nástroj · Výkon',
    } satisfies Record<FabSlug, string>,
  },

  process: {
    title: 'Od první zprávy po spuštění ve čtyřech krocích.',
    steps: [
      { title: 'Poptávka', text: 'Napíšete nám pár vět o projektu. Ozveme se do 24 hodin.' },
      { title: 'Návrh', text: 'Projdeme cíle, navrhneme řešení a řekneme cenu předem.' },
      { title: 'Výroba', text: 'Stavíme po částech, průběžně ukazujeme a ladíme podle vás.' },
      { title: 'Spuštění', text: 'Spustíme, předáme a zůstáváme k dispozici pro úpravy.' },
    ] satisfies Step[],
  },

  team: {
    title: 'Tři kluci, kteří tvoří weby, 3D a AI.',
    lead: 'Malý tým znamená, že mluvíte přímo s námi — bez prostředníků a přeposílání.',
    personalSite: 'Osobní web',
    // TODO: doplnit — role a bio si každý člen týmu upraví sám.
    members: {
      denis: { role: 'Spoluzakladatel', bio: 'Stojí za weby a digitálními zážitky IndiWebu.' },
      adam: { role: 'Spoluzakladatel', bio: 'Provází projekty od prvního nápadu až po spuštění.' },
      ondra: { role: 'Spoluzakladatel', bio: 'Provází projekty od prvního nápadu až po spuštění.' },
    } satisfies Record<TeamSlug, TeamMemberText>,
  },

  contact: {
    title: 'Pojďme do toho.',
    lead: 'Napište nám pár vět o svém projektu. Ozveme se do 24 hodin s prvními nápady, nezávazně.',
    emailPrompt: 'Raději e-mailem?',
    form: {
      label: 'Poptávkový formulář',
      name: 'Jméno',
      email: 'E-mail',
      service: 'O co máte zájem',
      optional: '(nepovinné)',
      servicePlaceholder: 'Vyberte službu',
      services: {
        web: 'Web',
        '3d': '3D / vizualizace',
        ai: 'AI agent',
        konzultace: 'Konzultace',
        jine: 'Jiné',
      } satisfies Record<InquiryService, string>,
      message: 'Váš projekt',
      honeypot: 'Web (nevyplňujte)',
      submit: 'Odeslat poptávku',
      sending: 'Odesílám…',
      /** The sentence under the button: before the link, the link, after it. */
      consentBefore: 'Vaše údaje použijeme jen k odpovědi na poptávku. Více v dokumentu',
      consentLink: 'Zásady ochrany osobních údajů',
      consentAfter: '.',
      successTitle: 'Díky, zpráva dorazila.',
      successText: 'Ozveme se vám do 24 hodin na e-mail, který jste uvedli.',
      errorTitle: 'Odeslání se nepovedlo.',
      /** Around our e-mail address: "…napište přímo na info@… ." */
      errorBefore: 'Zkuste to prosím znovu, nebo nám napište přímo na',
      errorAfter: '.',
      copy: 'Zkopírovat zprávu',
      copied: 'Zpráva zkopírována',
      /** Validation messages, sent back by the server. */
      errors: {
        nameRequired: 'Vyplňte jméno.',
        nameTooShort: 'Jméno musí mít alespoň 2 znaky.',
        nameTooLong: 'Jméno může mít nejvýše 100 znaků.',
        emailRequired: 'Vyplňte e-mail.',
        emailInvalid: 'Zadejte platný e-mail.',
        serviceInvalid: 'Vyberte službu ze seznamu.',
        messageRequired: 'Napište nám zprávu.',
        messageTooShort: 'Zpráva musí mít alespoň 10 znaků.',
        messageTooLong: 'Zpráva může mít nejvýše 5000 znaků.',
      },
    },
  },

  // The entrance shows these in every language at once, one lens per language.
  intro: {
    choose: 'Vyberte jazyk',
    enter: 'Vstoupit česky',
    withSound: 'se zvukem',
    skip: 'Přeskočit intro',
  },

  notFound: {
    eyebrow: 'Chyba 404',
    title: 'Tahle stránka neexistuje.',
    text: 'Možná byla přesunuta, nebo je v odkazu překlep. Zkuste to z úvodní stránky.',
    home: 'Zpět na úvod',
  },
}

export type Dictionary = typeof cs
