import type { Product } from './types'

export const aria: Product = {
  name: 'Aria',
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
  ],
}
