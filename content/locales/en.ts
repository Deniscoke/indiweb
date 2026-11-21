import type { Dictionary } from './cs'

/** Every text of the site in English. Same shape as the Czech source (cs.ts). */
export const en: Dictionary = {
  site: {
    title: 'IndiWeb — custom websites, 3D, and AI agents',
    description:
      'Denis, Adam, and Ondra. We design websites, 3D visualizations, and AI agents that answer the phone for you.',
    shareImage: {
      alt: 'IndiWeb — websites, 3D, and AI agents',
      headline: 'Websites, 3D, and AI agents',
      tagline: 'Custom websites · 3D and Gaussian splats · AI voice agents',
    },
  },

  common: {
    skipToContent: 'Skip to content',
    opensInNewWindow: '(opens in a new window)',
    tags: 'Tags',
    markets: { SK: 'Slovakia', CZ: 'Czechia' },
  },

  nav: {
    sluzby: 'Services',
    splaty: '3D',
    aria: 'Aria',
    projekty: 'Work',
    fab: 'Assets',
    'o-nas': 'About',
    kontakt: 'Contact',
  },

  header: {
    contact: 'Get in touch',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menu: 'Menu',
    mainNav: 'Main navigation',
    languages: 'Language',
  },

  footer: {
    tagline: 'Made with care.',
    nav: 'Footer',
    privacy: 'Privacy notice',
  },

  hero: {
    lines: ['Design it.', 'Build it.', 'Light it up.'],
    subtitle:
      'Websites, 3D visualizations, and AI agents by Denis, Adam, and Ondra. Custom-made, fast, and with AI at every step.',
    hint: 'We reply within 24 hours, no strings attached.',
    contact: 'Get in touch',
    work: 'See our work',
  },

  media: {
    laptopAlt: 'A half-open MacBook in the dark',
    phoneAlt: 'A smartphone in the dark',
  },

  services: {
    title: 'The website is the foundation. 3D and AI are what set it apart.',
    lead: 'We design and build custom websites. And where it makes sense, we add 3D, splats, or an AI agent that takes some of the work off your hands.',
    items: {
      web: {
        title: 'Custom websites',
        summary: 'Fast, clear websites that tell visitors what matters and lead them to get in touch.',
        points: [
          'Custom design and development, no templates',
          'Bookings, online store, multiple languages',
          'SEO and fast loading built in',
          'Updates and support after launch',
        ],
      },
      '3d': {
        title: '3D and Gaussian splats',
        summary:
          'Interactive 3D environments and photorealistic splats of real spaces you can walk through right in the browser.',
        points: ['Virtual tours of real spaces', '3D product visualizations', 'Interactive scenes for the web'],
      },
      ai: {
        title: 'AI agents and integrations',
        summary: 'Voice and chat agents that answer your customers, and AI wired into the way you work.',
        points: [
          'A voice agent for your phone line',
          'Chatbots for your website',
          'Automation and integrations with your systems',
        ],
      },
      konzultace: {
        title: 'Consulting',
        summary:
          'We help you decide what makes sense — a website, AI, or both — and what you can safely skip.',
        points: [
          'An audit of your current website',
          'A plan for your digital setup',
          'Where AI will actually save you time',
        ],
      },
    },
  },

  splat: {
    eyebrow: 'In collaboration with Splatoo',
    title: 'Walk through a castle. Right in your browser.',
    lead: 'The hall of the castle in Žďár nad Sázavou as a Gaussian splat: look around, zoom in on the details, and move through the space as if you were standing in it. Your customers can get to know your place the same way, before they ever set foot in it.',
    sceneTitle: 'Žďár nad Sázavou castle — main hall',
    loading: 'Loading the 3D tour…',
    open: 'Open in Splatoo',
    collaboration: [
      'We work with Splatoo on 3D tour projects',
      "We’re working on bringing splats into Unreal Engine",
      "We’re extending Splatoo with AI features and AI tool integrations",
    ],
  },

  aria: {
    headline: 'Aria — our AI voice agent',
    tagline: 'The AI voice agent that picks up every call.',
    description:
      'Aria answers your phone around the clock — she handles questions, takes bookings, and takes messages. You look after the customers in front of you, and no call goes unanswered.',
    capabilities: [
      'Answers the phone 24/7, even when your hands are full',
      'Takes bookings for appointments and tables',
      'Answers common questions — opening hours, prices, address',
      'Takes messages so nothing slips through',
    ],
    audience: [
      'Restaurants and cafés',
      'Salons and studios',
      'Repair shops and tradespeople',
      "Small businesses that can’t keep up with the phone",
    ],
    rollout: [
      { title: 'Intro call', text: 'We go through the calls you get and what Aria should handle.' },
      {
        title: 'Setup',
        text: 'We teach Aria your services, prices, opening hours, and booking rules.',
      },
      { title: 'Trial run', text: 'You try her out yourself before she talks to your customers.' },
      { title: 'Launch', text: 'You forward your number and Aria starts answering calls.' },
    ],
    more: 'More about Aria',
    try: 'Try Aria',
    page: {
      metaTitle: 'Aria — the AI voice agent that answers every call',
      metaDescription:
        'Aria answers your phone around the clock: she handles questions, takes bookings, and takes messages. No call goes unanswered.',
      serviceType: 'AI voice agent',
      eyebrow: 'Our own product',
      cta: 'I want Aria for my business',
      capabilitiesTitle: 'A phone that never goes unanswered.',
      audienceTitle: "For anyone who can’t get to the phone.",
      rolloutTitle: 'How we get Aria up and running for you.',
      closingTitle: 'Want Aria on your line?',
      closingLead: "Tell us what kind of calls you get. We’ll get back to you within 24 hours.",
    },
  },

  voiceDemo: {
    call: 'Talk to Aria',
    connecting: 'Connecting…',
    hangUp: 'End call',
    status: {
      speaking: 'Aria is speaking…',
      listening: 'Listening…',
      connecting: 'Connecting…',
    },
    notices: {
      unavailable: "The demo isn’t available right now. Please try again later, or just send us a message.",
      busy: 'That was a lot of calls in a row. Please try again in a few minutes.',
      microphone: 'You need a microphone to talk to Aria. Please allow access in your browser.',
      failed: "The call couldn’t connect. Check your microphone and try again.",
    },
    quote: '“{text}”',
    chooseVoice: "Choose Aria’s voice",
    voices: {
      marketa: 'Clear, pleasant female voice',
      katy: 'Young, natural female voice',
      marek: 'Smooth, calm male voice',
      kuba: 'Relaxed male voice',
    },
    finePrint: 'Live demo via ElevenLabs · up to {minutes} minutes · microphone required ·',
    privacyLink: 'How we process your voice',
    languageNote: 'The live demo of Aria currently speaks Czech.',
  },

  projects: {
    title: 'Every client gets a website that fits them. Not a template.',
    lead: 'An elevator company needs something different than a therapist does. See what that looks like in practice.',
    screenshotAlt: 'Homepage of the {title} website',
    liveDemo: 'Live demo',
    back: 'All projects',
    openSite: 'Visit the site',
    wantSimilar: 'I want a site like this',
    about: 'About the project',
    features: 'What the site does',
    next: 'Next project',
    items: {
      'elevator-servis': {
        client: 'Elevator service, Banská Bystrica',
        tags: ['Website', 'B2B', 'Services'],
        summary:
          "A website for a service company that speaks property managers’ language and leads them to a no-obligation quote request.",
        description:
          'Elevátor Servis looks after more than 300 elevators in and around Banská Bystrica. The website has to show property managers, companies, and institutions at a glance what the firm can do for them, and earn enough trust for them to request a quote. It is built around the real situations people call about — from recurring faults to someone stuck in an elevator.',
        highlights: [
          'Copy built around customer problems',
          'A dedicated page for every service',
          'A clearly visible 24/7 emergency line',
          "A clear process for taking over an elevator’s maintenance",
        ],
      },
      'esencia-viva': {
        client: 'Massage and aromatherapy',
        tags: ['Website', 'Bookings', 'Online store'],
        summary: 'A gentle, atmospheric website where clients book sessions and buy products.',
        description:
          'Esencia Viva offers massage, aromatherapy, and herbal care. The website had to convey the calm clients feel during a session and still handle the practical side: bookings, product sales, and a loyalty program. The result is an airy design with an atmospheric opening and all the legal groundwork an online store needs.',
        highlights: [
          'An atmospheric opening and a calm visual language',
          'First-session booking',
          'An online store with products and a loyalty program',
          'Terms and conditions, privacy, and cookies',
        ],
      },
    },
  },

  fab: {
    eyebrow: 'IndiWeb Store on Fab',
    title: 'We build for games, too. Our assets run in Unreal Engine.',
    lead: 'On Fab, the Epic Games marketplace, we sell our own plugins, effects, and environments for Unreal Engine 5. Developers download them and have them running in their game within minutes.',
    facts: ['Unreal Engine 5', 'C++ and Blueprints', 'Multiplayer'],
    factsLabel: 'Technology',
    opensOnFab: '(opens in a new window on Fab)',
    productsOnFab: {
      one: '{count} product on Fab',
      other: '{count} products on Fab',
    },
    store: 'The full store on Fab',
    kinds: {
      'combat-vfx': 'VFX · Niagara',
      'arena-match': 'Plugin · Multiplayer',
      'voxel-spell-fx': 'Plugin · Spells',
      'gravity-lift': 'Plugin · Gameplay',
      'lumenroute-scifi': 'Environment · Sci-fi',
      'multiplayer-objectives': 'Plugin · Multiplayer',
      'swap-destruction': 'Plugin · Physics',
      'fp-parkour': 'Plugin · Movement',
      'combat-feedback': 'UI kit',
      'lumenroute-floor': 'Materials',
      'lumenroute-cargo': 'Materials',
      'options-rebinding': 'Plugin · UI',
      'pixel-grid': 'Tool · Editor',
      'cook-path-guard': 'Tool · Editor',
      'bench-walk': 'Tool · Performance',
    },
  },

  process: {
    title: 'From first message to launch in four steps.',
    steps: [
      { title: 'Inquiry', text: "Send us a few lines about your project. We’ll reply within 24 hours." },
      { title: 'Proposal', text: 'We go through your goals, propose a solution, and tell you the price up front.' },
      { title: 'Build', text: 'We build in stages, show you progress along the way, and refine it with you.' },
      { title: 'Launch', text: 'We go live, hand everything over, and stay on hand for changes.' },
    ],
  },

  team: {
    title: 'Three guys who make websites, 3D, and AI.',
    lead: 'A small team means you talk to us directly — no middlemen, no handoffs.',
    personalSite: 'Personal site',
    members: {
      denis: { role: 'Co-founder', bio: "The one behind IndiWeb’s websites and digital experiences." },
      adam: { role: 'Co-founder', bio: 'Sees projects through from the first idea to launch.' },
      ondra: { role: 'Co-founder', bio: 'Sees projects through from the first idea to launch.' },
    },
  },

  contact: {
    title: "Let’s make it happen.",
    lead: "Send us a few lines about your project. We’ll get back to you within 24 hours with some first ideas, no strings attached.",
    emailPrompt: 'Prefer email?',
    form: {
      label: 'Inquiry form',
      name: 'Name',
      email: 'Email',
      service: 'What are you interested in?',
      optional: '(optional)',
      servicePlaceholder: 'Choose a service',
      services: {
        web: 'Website',
        '3d': '3D / visualization',
        ai: 'AI agent',
        konzultace: 'Consulting',
        jine: 'Something else',
      },
      message: 'Your project',
      honeypot: 'Website (leave blank)',
      submit: 'Send inquiry',
      sending: 'Sending…',
      consentBefore: "We’ll use your details only to reply to your inquiry. Read more in our",
      consentLink: 'privacy notice',
      consentAfter: '.',
      successTitle: 'Thanks, we got your message.',
      successText: "We’ll get back to you within 24 hours at the email address you gave us.",
      errorTitle: "Your message didn’t go through.",
      errorBefore: 'Please try again, or email us directly at',
      errorAfter: '.',
      copy: 'Copy message',
      copied: 'Message copied',
      errors: {
        nameRequired: 'Enter your name.',
        nameTooShort: 'Your name must be at least 2 characters long.',
        nameTooLong: 'Your name can be at most 100 characters long.',
        emailRequired: 'Enter your email.',
        emailInvalid: 'Enter a valid email address.',
        serviceInvalid: 'Choose a service from the list.',
        messageRequired: 'Write us a message.',
        messageTooShort: 'Your message must be at least 10 characters long.',
        messageTooLong: 'Your message can be at most 5,000 characters long.',
      },
    },
  },

  intro: {
    choose: 'Choose your language',
    enter: 'Enter in English',
    withSound: 'with sound',
    skip: 'Skip intro',
  },

  notFound: {
    eyebrow: 'Error 404',
    title: "This page doesn’t exist.",
    text: 'It may have moved, or there’s a typo in the link. Try starting from the home page.',
    home: 'Back to home',
  },
}
