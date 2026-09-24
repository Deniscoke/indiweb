import type { TeamMember } from './types'

// TODO: doplnit — role a bio si každý člen týmu upraví sám.
export const team: TeamMember[] = [
  {
    slug: 'denis',
    name: 'Denis Mitrović',
    role: 'Spoluzakladatel',
    bio: 'Stojí za weby a digitálními zážitky IndiWebu.',
    website: 'https://mojweb2.vercel.app',
  },
  {
    slug: 'adam',
    name: 'Adam',
    role: 'Spoluzakladatel',
    bio: 'Provází projekty od prvního nápadu až po spuštění.',
  },
  {
    slug: 'ondra',
    name: 'Ondra',
    role: 'Spoluzakladatel',
    bio: 'Provází projekty od prvního nápadu až po spuštění.',
  },
]
