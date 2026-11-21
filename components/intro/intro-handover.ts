import type { IntroSound } from './intro-sound'

// Choosing another language at the entrance opens another page, and that page
// mounts its own intro. The document stays the same, though, so the soundtrack
// the click unlocked can be handed from the old intro to the new one here.
let carried: { sound: IntroSound | null } | null = null

/** Leaves the intro, with its sound, for the page that is about to open. */
export function carryIntro(sound: IntroSound | null): void {
  carried = { sound }
}

/** Whether a page is arriving through the entrance and should start its intro at once. */
export function introIsCarried(): boolean {
  return carried !== null
}

/** Picks the carried intro up; it can be taken once. */
export function takeCarriedIntro(): { sound: IntroSound | null } | null {
  const arriving = carried
  carried = null
  return arriving
}
