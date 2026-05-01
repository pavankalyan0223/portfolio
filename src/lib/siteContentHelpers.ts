import type { HeroAction, SiteContent } from '../types/content'

const CONTACT_ORDER = [
  'email',
  'linkedin',
  'github',
  'twitter',
  'website',
] as const

export type ContactEntry = { key: string; value: string }

export function getOrderedContactEntries(
  contact: Record<string, string | undefined> | undefined,
): ContactEntry[] {
  if (!contact || typeof contact !== 'object') return []
  const entries: ContactEntry[] = []
  for (const [rawKey, rawVal] of Object.entries(contact)) {
    if (typeof rawVal !== 'string') continue
    const v = rawVal.trim()
    if (!v) continue
    entries.push({ key: rawKey.toLowerCase(), value: v })
  }
  entries.sort((a, b) => {
    const ia = CONTACT_ORDER.indexOf(a.key as (typeof CONTACT_ORDER)[number])
    const ib = CONTACT_ORDER.indexOf(b.key as (typeof CONTACT_ORDER)[number])
    const aKnown = ia !== -1
    const bKnown = ib !== -1
    if (aKnown && bKnown) return ia - ib
    if (aKnown) return -1
    if (bKnown) return 1
    return a.key.localeCompare(b.key)
  })
  return entries
}

export function contactHref(entry: ContactEntry): string | null {
  const { key, value } = entry
  if (key === 'email') {
    return `mailto:${encodeURIComponent(value)}`
  }
  if (key === 'tel' || key === 'phone') {
    const digits = value.replaceAll(/\s+/g, '')
    return digits ? `tel:${digits}` : null
  }
  if (/^https?:\/\//i.test(value)) return value
  if (key === 'github') {
    const path = value.replace(/^https?:\/\/(www\.)?github\.com\/?/i, '').replace(/^\/+/, '')
    return `https://github.com/${path}`
  }
  if (key === 'linkedin') {
    return /^https?:\/\//i.test(value)
      ? value
      : `https://${value.replace(/^\/+/, '')}`
  }
  if (key === 'twitter') {
    const handle = value.replace(/^@|https?:\/\/(www\.)?(twitter|x)\.com\//i, '')
    return `https://twitter.com/${handle.replace(/^\/+/, '')}`
  }
  return `https://${value.replace(/^\/+/, '')}`
}

export function getNavLinks(content: SiteContent): string[] {
  const fromHeader = content.header?.navLinks
  const raw = Array.isArray(fromHeader)
    ? fromHeader
    : Array.isArray(content.navLinks)
      ? content.navLinks
      : []
  return raw.filter((l): l is string => typeof l === 'string' && l.trim().length > 0)
}

export function getActiveNav(content: SiteContent, fallback: string): string {
  const a = content.header?.activeNav
  return typeof a === 'string' && a.trim() ? a.trim() : fallback
}

export function getLogoText(content: SiteContent): string {
  const explicit = content.header?.logoText
  if (typeof explicit === 'string' && explicit.trim()) return explicit.trim()
  const title =
    content.hero?.title?.trim() ||
    content.personalInfo?.name?.trim() ||
    ''
  if (!title) return '\u00A0'
  return title.split(/\s+/)[0] ?? title
}

export function resolveHeroFields(content: SiteContent): {
  title?: string
  subtitle?: string
  description?: string
  avatarUrl?: string
  sectionId: string
} {
  const h = content.hero
  const p = content.personalInfo
  const title = h?.title?.trim() || p?.name?.trim() || undefined
  const subtitle = h?.subtitle?.trim() || p?.role?.trim() || undefined
  const description =
    h?.description?.trim() || p?.bio?.trim() || undefined
  const avatarUrl =
    typeof h?.avatarUrl === 'string' && h.avatarUrl.trim()
      ? h.avatarUrl.trim()
      : undefined
  const sectionId =
    typeof h?.id === 'string' && h.id.trim() ? h.id.trim() : 'home'
  return { title, subtitle, description, avatarUrl, sectionId }
}

function isValidAction(a: unknown): a is HeroAction {
  if (!a || typeof a !== 'object') return false
  const o = a as Record<string, unknown>
  return (
    typeof o.label === 'string' &&
    o.label.trim().length > 0 &&
    typeof o.value === 'string' &&
    o.value.trim().length > 0 &&
    (o.type === 'mailto' || o.type === 'link' || o.type === 'tel')
  )
}

export function resolveHeroActions(content: SiteContent): HeroAction[] {
  const raw = content.hero?.actions
  if (Array.isArray(raw)) {
    const list = raw.filter(isValidAction)
    if (list.length > 0) return list
  }
  const email = content.contact?.email?.trim()
  if (email) {
    return [{ label: 'Contact Me', type: 'mailto', value: email }]
  }
  return []
}

export function actionHref(action: HeroAction): string {
  if (action.type === 'mailto') {
    return `mailto:${encodeURIComponent(action.value.trim())}`
  }
  if (action.type === 'tel') {
    return `tel:${action.value.replaceAll(/\s+/g, '')}`
  }
  return action.value.trim()
}

export function firstMailtoFromContact(
  content: SiteContent,
): string | null {
  const email = content.contact?.email?.trim()
  if (!email) return null
  return `mailto:${encodeURIComponent(email)}`
}
