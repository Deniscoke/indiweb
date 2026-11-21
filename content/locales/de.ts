import type { Dictionary } from './cs'

/** Every text of the site in German. Same shape as the Czech dictionary (cs.ts). */
export const de: Dictionary = {
  site: {
    title: 'IndiWeb – Websites nach Maß, 3D und KI-Agenten',
    description:
      'Denis, Adam und Ondra. Wir gestalten Websites, 3D-Visualisierungen und KI-Agenten, die für Sie ans Telefon gehen.',
    shareImage: {
      alt: 'IndiWeb – Websites, 3D und KI-Agenten',
      headline: 'Websites, 3D und KI-Agenten',
      tagline: 'Websites nach Maß · 3D und Gaussian Splats · KI-Sprachagenten',
    },
  },

  common: {
    skipToContent: 'Zum Inhalt springen',
    opensInNewWindow: '(öffnet in neuem Fenster)',
    tags: 'Schlagwörter',
    markets: { SK: 'Slowakei', CZ: 'Tschechien' },
  },

  nav: {
    sluzby: 'Leistungen',
    splaty: '3D',
    aria: 'Aria',
    projekty: 'Projekte',
    fab: 'Assets',
    'o-nas': 'Über uns',
    kontakt: 'Kontakt',
  },

  header: {
    contact: 'Schreiben Sie uns',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    menu: 'Menü',
    mainNav: 'Hauptnavigation',
    languages: 'Sprache',
  },

  footer: {
    tagline: 'Mit Sorgfalt gemacht.',
    nav: 'Fußzeile',
    privacy: 'Datenschutz',
  },

  hero: {
    lines: ['Gestalten.', 'Bauen.', 'Licht an.'],
    subtitle:
      'Websites, 3D-Visualisierungen und KI-Agenten von Denis, Adam und Ondra. Maßgeschneidert, schnell und mit KI in jedem Schritt.',
    hint: 'Antwort innerhalb von 24 Stunden, unverbindlich.',
    contact: 'Schreiben Sie uns',
    work: 'Projekte ansehen',
  },

  media: {
    laptopAlt: 'Halb geöffnetes MacBook im Dunkeln',
    phoneAlt: 'Smartphone im Dunkeln',
  },

  services: {
    title: 'Die Website ist die Basis. 3D und KI machen sie besser.',
    lead: 'Wir gestalten und entwickeln Websites nach Maß. Und wo es sinnvoll ist, kommen 3D, Splats oder ein KI-Agent dazu, der Ihnen ein gutes Stück Arbeit abnimmt.',
    items: {
      web: {
        title: 'Websites nach Maß',
        summary:
          'Schnelle, übersichtliche Websites, die Besuchern das Wesentliche sagen und sie zur Anfrage führen.',
        points: [
          'Design und Entwicklung nach Maß, keine Templates',
          'Terminbuchung, Onlineshop, Mehrsprachigkeit',
          'SEO und kurze Ladezeiten von Anfang an',
          'Anpassungen und Betreuung auch nach dem Launch',
        ],
      },
      '3d': {
        title: '3D und Gaussian Splats',
        summary:
          'Interaktive 3D-Welten und fotorealistische Splats von Räumen, die sich direkt im Browser begehen lassen.',
        points: ['Virtuelle Rundgänge durch Räume', '3D-Produktvisualisierungen', 'Interaktive Szenen für Ihre Website'],
      },
      ai: {
        title: 'KI-Agenten und Integrationen',
        summary:
          'Sprach- und Chat-Agenten, die Ihren Kunden antworten, und KI, die an Ihre Abläufe angebunden ist.',
        points: [
          'Sprachagent fürs Telefon',
          'Chatbots für die Website',
          'Automatisierung und Anbindung an Ihre Systeme',
        ],
      },
      konzultace: {
        title: 'Beratung',
        summary:
          'Wir helfen Ihnen zu entscheiden, was sinnvoll ist – Website, KI oder beides – und was Sie sich getrost sparen können.',
        points: [
          'Audit Ihrer bestehenden Website',
          'Konzept für Ihre digitale Lösung',
          'Wo KI Ihnen wirklich Zeit spart',
        ],
      },
    },
  },

  splat: {
    eyebrow: 'In Zusammenarbeit mit Splatoo',
    title: 'Durchs Schloss spazieren. Direkt im Browser.',
    lead: 'Ein Saal von Schloss Žďár nad Sázavou als Gaussian Splat: Sehen Sie sich um, zoomen Sie an Details heran und gehen Sie durch den Raum, als stünden Sie mittendrin. Genauso können Ihre Kunden Ihre Räumlichkeiten kennenlernen, noch bevor sie sie betreten.',
    sceneTitle: 'Schloss Žďár nad Sázavou – Hauptsaal',
    loading: '3D-Rundgang wird geladen…',
    open: 'In Splatoo öffnen',
    collaboration: [
      'Mit Splatoo setzen wir gemeinsam 3D-Rundgänge um',
      'Wir arbeiten an der Integration von Splats in die Unreal Engine',
      'Wir erweitern Splatoo um KI-Funktionen und die Anbindung von KI-Tools',
    ],
  },

  aria: {
    headline: 'Aria – unser KI-Sprachagent',
    tagline: 'Der KI-Sprachagent, der jeden Anruf annimmt.',
    description:
      'Aria geht rund um die Uhr für Sie ans Telefon – sie beantwortet Fragen, nimmt Reservierungen entgegen und notiert Nachrichten. Sie kümmern sich um die Kunden vor Ort, und kein Anruf geht verloren.',
    capabilities: [
      'Nimmt Anrufe rund um die Uhr an, auch wenn Sie alle Hände voll zu tun haben',
      'Nimmt Termin- und Tischreservierungen entgegen',
      'Beantwortet häufige Fragen – Öffnungszeiten, Preise, Adresse',
      'Notiert Nachrichten, damit Ihnen nichts entgeht',
    ],
    audience: [
      'Restaurants und Cafés',
      'Salons und Studios',
      'Werkstätten und Handwerksbetriebe',
      'Kleine Unternehmen, die mit dem Telefon nicht nachkommen',
    ],
    rollout: [
      {
        title: 'Erstgespräch',
        text: 'Wir klären, welche Anrufe bei Ihnen eingehen und was Aria übernehmen soll.',
      },
      {
        title: 'Einrichtung',
        text: 'Wir bringen Aria Ihre Leistungen, Preise, Öffnungszeiten und Reservierungsregeln bei.',
      },
      { title: 'Testbetrieb', text: 'Sie probieren Aria selbst aus, bevor sie mit Ihren Kunden spricht.' },
      { title: 'Start', text: 'Sie leiten Ihre Nummer um, und Aria nimmt die Anrufe an.' },
    ],
    more: 'Mehr über Aria',
    try: 'Aria ausprobieren',
    page: {
      metaTitle: 'Aria – der KI-Sprachagent, der jeden Anruf annimmt',
      metaDescription:
        'Aria geht rund um die Uhr für Sie ans Telefon: Sie beantwortet Fragen, nimmt Reservierungen an und notiert Nachrichten.',
      serviceType: 'KI-Sprachagent',
      eyebrow: 'Unser eigenes Produkt',
      cta: 'Aria für mein Unternehmen',
      capabilitiesTitle: 'Ein Telefon, das nie ins Leere klingelt.',
      audienceTitle: 'Für alle, die nicht jeden Anruf schaffen.',
      rolloutTitle: 'So startet Aria bei Ihnen.',
      closingTitle: 'Aria auch bei Ihnen?',
      closingLead: 'Schreiben Sie uns, welche Anrufe bei Ihnen eingehen. Wir melden uns innerhalb von 24 Stunden.',
    },
  },

  voiceDemo: {
    call: 'Mit Aria sprechen',
    connecting: 'Wird verbunden…',
    hangUp: 'Anruf beenden',
    status: {
      speaking: 'Aria spricht…',
      listening: 'Ich höre Ihnen zu…',
      connecting: 'Verbindung wird aufgebaut…',
    },
    notices: {
      unavailable:
        'Die Demo ist gerade nicht verfügbar. Bitte versuchen Sie es später noch einmal oder schreiben Sie uns einfach.',
      busy: 'Das waren viele Anrufe hintereinander. Bitte versuchen Sie es in ein paar Minuten noch einmal.',
      microphone: 'Für das Gespräch mit Aria wird ein Mikrofon benötigt. Bitte erlauben Sie den Zugriff im Browser.',
      failed: 'Die Verbindung kam nicht zustande. Bitte prüfen Sie Ihr Mikrofon und versuchen Sie es erneut.',
    },
    quote: '„{text}“',
    chooseVoice: 'Wählen Sie Arias Stimme',
    voices: {
      marketa: 'Klare, angenehme Frauenstimme',
      katy: 'Junge, natürliche Frauenstimme',
      marek: 'Samtige, ruhige Männerstimme',
      kuba: 'Entspannte Männerstimme',
    },
    finePrint: 'Live-Demo über ElevenLabs · höchstens {minutes} Minuten · Mikrofon erforderlich ·',
    privacyLink: 'So verarbeiten wir Ihre Stimme',
    languageNote: 'Aria spricht in dieser Live-Demo derzeit Tschechisch.',
  },

  projects: {
    title: 'Jeder Kunde bekommt eine Website, die zu ihm passt. Nicht zu einem Template.',
    lead: 'Ein Aufzugsunternehmen braucht etwas anderes als eine Therapeutin. Sehen Sie selbst, wie das in der Praxis aussieht.',
    screenshotAlt: 'Startseite der Website {title}',
    liveDemo: 'Live-Demo',
    back: 'Alle Projekte',
    openSite: 'Website öffnen',
    wantSimilar: 'Ähnliche Website anfragen',
    about: 'Über das Projekt',
    features: 'Was die Website kann',
    next: 'Nächstes Projekt',
    items: {
      'elevator-servis': {
        client: 'Aufzugsservice, Banská Bystrica',
        tags: ['Website', 'B2B', 'Dienstleistungen'],
        summary:
          'Website für einen Aufzugsservice, die die Sprache der Hausverwaltungen spricht und sie zur unverbindlichen Anfrage führt.',
        description:
          'Elevátor Servis betreut mehr als 300 Aufzüge in Banská Bystrica und Umgebung. Die Website soll Hausverwaltungen, Unternehmen und Institutionen schnell zeigen, wobei die Firma ihnen hilft, und sie mit einem seriösen Auftritt zur Anfrage führen. Sie baut auf den konkreten Situationen auf, in denen Menschen anrufen – von wiederkehrenden Störungen bis zum Steckenbleiben im Aufzug.',
        highlights: [
          'Texte, die bei den Problemen der Kunden ansetzen',
          'Eine eigene Seite für jede Leistung',
          'Gut sichtbare 24-Stunden-Notrufnummer',
          'Verständlicher Ablauf für die Übernahme eines Aufzugs in die Wartung',
        ],
      },
      'esencia-viva': {
        client: 'Massagen und Aromatherapie',
        tags: ['Website', 'Buchung', 'Onlineshop'],
        summary:
          'Eine sanfte, stimmungsvolle Website, auf der Kundinnen und Kunden Termine buchen und Produkte kaufen.',
        description:
          'Esencia Viva bietet Massagen, Aromatherapie und die Arbeit mit Kräutern an. Die Website sollte die Ruhe vermitteln, die Kundinnen und Kunden bei einer Behandlung erleben, und zugleich das Praktische erledigen: Terminbuchung, Produktverkauf und Treueprogramm. Entstanden ist ein luftiges Design mit stimmungsvollem Einstieg und allen Rechtstexten für den Onlineshop.',
        highlights: [
          'Stimmungsvoller Einstieg und ruhige Bildsprache',
          'Buchung der ersten Behandlung',
          'Onlineshop mit Produkten und Treueprogramm',
          'AGB, Datenschutz und Cookies',
        ],
      },
    },
  },

  fab: {
    eyebrow: 'IndiWeb Store auf Fab',
    title: 'Wir bauen auch für Games. Unsere Assets laufen in der Unreal Engine.',
    lead: 'Auf Fab, dem Marktplatz von Epic Games, verkaufen wir eigene Plugins, Effekte und Umgebungen für die Unreal Engine 5. Entwickler laden sie herunter und haben sie in wenigen Minuten im Spiel.',
    facts: ['Unreal Engine 5', 'C++ und Blueprint', 'Multiplayer'],
    factsLabel: 'Technologien',
    opensOnFab: '(öffnet in neuem Fenster auf Fab)',
    productsOnFab: {
      one: '{count} Produkt auf Fab',
      other: '{count} Produkte auf Fab',
    },
    store: 'Der ganze Store auf Fab',
    kinds: {
      'combat-vfx': 'VFX · Niagara',
      'arena-match': 'Plugin · Multiplayer',
      'voxel-spell-fx': 'Plugin · Zauber',
      'gravity-lift': 'Plugin · Gameplay',
      'lumenroute-scifi': 'Umgebung · Sci-Fi',
      'multiplayer-objectives': 'Plugin · Multiplayer',
      'swap-destruction': 'Plugin · Physik',
      'fp-parkour': 'Plugin · Bewegung',
      'combat-feedback': 'UI-Kit',
      'lumenroute-floor': 'Materialien',
      'lumenroute-cargo': 'Materialien',
      'options-rebinding': 'Plugin · UI',
      'pixel-grid': 'Tool · Editor',
      'cook-path-guard': 'Tool · Editor',
      'bench-walk': 'Tool · Performance',
    },
  },

  process: {
    title: 'Von der ersten Nachricht bis zum Launch in vier Schritten.',
    steps: [
      {
        title: 'Anfrage',
        text: 'Sie schreiben uns ein paar Sätze zu Ihrem Projekt. Wir melden uns innerhalb von 24 Stunden.',
      },
      {
        title: 'Konzept',
        text: 'Wir klären die Ziele, schlagen eine Lösung vor und nennen den Preis vorab.',
      },
      {
        title: 'Umsetzung',
        text: 'Wir bauen Schritt für Schritt, zeigen laufend den Stand und feilen nach Ihren Wünschen.',
      },
      {
        title: 'Launch',
        text: 'Wir gehen live, übergeben alles und bleiben für Anpassungen erreichbar.',
      },
    ],
  },

  team: {
    title: 'Drei Jungs, die Websites, 3D und KI machen.',
    lead: 'Kleines Team heißt: Sie sprechen direkt mit uns – ohne Vermittler und ohne Weiterreichen.',
    personalSite: 'Persönliche Website',
    members: {
      denis: { role: 'Mitgründer', bio: 'Steht hinter den Websites und digitalen Erlebnissen von IndiWeb.' },
      adam: { role: 'Mitgründer', bio: 'Begleitet Projekte von der ersten Idee bis zum Launch.' },
      ondra: { role: 'Mitgründer', bio: 'Begleitet Projekte von der ersten Idee bis zum Launch.' },
    },
  },

  contact: {
    title: 'Legen wir los.',
    lead: 'Schreiben Sie uns ein paar Sätze zu Ihrem Projekt. Wir melden uns innerhalb von 24 Stunden mit ersten Ideen, unverbindlich.',
    emailPrompt: 'Lieber per E-Mail?',
    form: {
      label: 'Anfrageformular',
      name: 'Name',
      email: 'E-Mail',
      service: 'Was interessiert Sie?',
      optional: '(optional)',
      servicePlaceholder: 'Leistung auswählen',
      services: {
        web: 'Website',
        '3d': '3D / Visualisierung',
        ai: 'KI-Agent',
        konzultace: 'Beratung',
        jine: 'Sonstiges',
      },
      message: 'Ihr Projekt',
      honeypot: 'Website (bitte nicht ausfüllen)',
      submit: 'Anfrage senden',
      sending: 'Wird gesendet…',
      consentBefore: 'Ihre Angaben verwenden wir nur, um Ihre Anfrage zu beantworten. Mehr dazu in unserer',
      consentLink: 'Datenschutzerklärung',
      consentAfter: '.',
      successTitle: 'Danke, Ihre Nachricht ist angekommen.',
      successText: 'Wir melden uns innerhalb von 24 Stunden unter der angegebenen E-Mail-Adresse.',
      errorTitle: 'Das Senden hat nicht geklappt.',
      errorBefore: 'Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an',
      errorAfter: '.',
      copy: 'Nachricht kopieren',
      copied: 'Nachricht kopiert',
      errors: {
        nameRequired: 'Bitte geben Sie Ihren Namen ein.',
        nameTooShort: 'Der Name muss mindestens 2 Zeichen lang sein.',
        nameTooLong: 'Der Name darf höchstens 100 Zeichen lang sein.',
        emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
        emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        serviceInvalid: 'Bitte wählen Sie eine Leistung aus der Liste.',
        messageRequired: 'Bitte schreiben Sie uns eine Nachricht.',
        messageTooShort: 'Die Nachricht muss mindestens 10 Zeichen lang sein.',
        messageTooLong: 'Die Nachricht darf höchstens 5000 Zeichen lang sein.',
      },
    },
  },

  intro: {
    choose: 'Sprache wählen',
    enter: 'Weiter auf Deutsch',
    withSound: 'mit Ton',
    skip: 'Intro überspringen',
  },

  notFound: {
    eyebrow: 'Fehler 404',
    title: 'Diese Seite gibt es nicht.',
    text: 'Vielleicht wurde sie verschoben, oder im Link steckt ein Tippfehler. Versuchen Sie es über die Startseite.',
    home: 'Zur Startseite',
  },
}
