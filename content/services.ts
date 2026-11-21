import type { Dictionary } from './locales/cs'
import { SERVICE_IDS, type Service, type ServiceId } from './types'

/** The service shown with a picture. */
export const FEATURED_SERVICE: ServiceId = 'web'

/** The services in their fixed order, with their texts in one language. */
export function localizedServices(dict: Dictionary): Service[] {
  return SERVICE_IDS.map((id) => ({ id, featured: id === FEATURED_SERVICE, ...dict.services.items[id] }))
}
