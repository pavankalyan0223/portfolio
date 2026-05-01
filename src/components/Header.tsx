import {
  AtSign,
  Code2,
  ExternalLink,
  Globe,
  Link as LinkIcon,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useSiteContent } from '../context/useSiteContent'
import {
  contactHref,
  firstMailtoFromContact,
  getActiveNav,
  getLogoText,
  getNavLinks,
  getOrderedContactEntries,
  type ContactEntry,
} from '../lib/siteContentHelpers'

export type HeaderProps = {
  isDark: boolean
  onThemeToggle: () => void
}

function slugifyNavLabel(label: string) {
  return label.toLowerCase().replaceAll(/\s+/g, '-')
}

function ContactGlyph({ entry }: { entry: ContactEntry }) {
  switch (entry.key) {
    case 'email':
      return <Mail className="h-5 w-5" strokeWidth={1.75} />
    case 'linkedin':
      return <ExternalLink className="h-5 w-5" strokeWidth={1.75} />
    case 'github':
      return <Code2 className="h-5 w-5" strokeWidth={1.75} />
    case 'twitter':
      return <AtSign className="h-5 w-5" strokeWidth={1.75} />
    case 'website':
      return <Globe className="h-5 w-5" strokeWidth={1.75} />
    default:
      return <LinkIcon className="h-5 w-5" strokeWidth={1.75} />
  }
}

function contactLabel(entry: ContactEntry): string {
  if (entry.key === 'email') return 'Email'
  if (entry.key === 'linkedin') return 'LinkedIn'
  return entry.key.charAt(0).toUpperCase() + entry.key.slice(1)
}

export function Header({ isDark, onThemeToggle }: HeaderProps) {
  const content = useSiteContent()
  const navLinks = getNavLinks(content)
  const contactEntries = getOrderedContactEntries(content.contact).filter(
    (e) => contactHref(e),
  )
  const logoText = getLogoText(content)
  const activeNav = getActiveNav(content, navLinks[0] ?? 'Home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const primaryMailto = firstMailtoFromContact(content)
  const showNav = navLinks.length > 0

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#121212]/90">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#home"
          className="z-10 shrink-0 font-['Brush_Script_MT','Segoe_Script',cursive] text-xl text-slate-900 dark:text-white sm:text-2xl"
        >
          {logoText}
        </a>

        {showNav ? (
          <nav
            className="absolute left-1/2 top-1/2 hidden w-auto -translate-x-1/2 -translate-y-1/2 md:block"
            aria-label="Primary"
          >
            <ul className="flex items-center gap-1 lg:gap-2">
              {navLinks.map((label) => {
                const isActive = label === activeNav
                const id = slugifyNavLabel(label)
                return (
                  <li key={label}>
                    <a
                      href={id === 'home' ? '#home' : `#${id}`}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors lg:px-4 ${
                        isActive
                          ? 'text-sky-400'
                          : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}

        <div className="z-10 flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          {contactEntries.length > 0 ? (
            <div className="hidden items-center gap-1 sm:flex">
              {contactEntries.map((entry) => {
                const href = contactHref(entry)
                if (!href) return null
                return (
                  <a
                    key={`${entry.key}-${entry.value}`}
                    href={href}
                    target={entry.key === 'email' ? undefined : '_blank'}
                    rel={
                      entry.key === 'email'
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
                    aria-label={contactLabel(entry)}
                  >
                    <ContactGlyph entry={entry} />
                  </a>
                )
              })}
            </div>
          ) : primaryMailto ? (
            <a
              href={primaryMailto}
              className="hidden items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-800 transition hover:bg-slate-100 sm:inline-flex dark:border-white/25 dark:text-white dark:hover:bg-white/10"
            >
              Contact Me
            </a>
          ) : null}

          <button
            type="button"
            onClick={onThemeToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-800 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>

          {showNav ? (
            mobileOpen ? (
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-800 dark:text-white md:hidden"
                aria-expanded="true"
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-800 dark:text-white md:hidden"
                aria-expanded="false"
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )
          ) : null}
        </div>
      </div>

      {mobileOpen && showNav ? (
        <div
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#1a1a1a] md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((label) => {
              const isActive = label === activeNav
              const id = slugifyNavLabel(label)
              return (
                <li key={label}>
                  <a
                    href={id === 'home' ? '#home' : `#${id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-2 py-2.5 text-base font-medium ${
                      isActive
                        ? 'text-sky-400'
                        : 'text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
          {contactEntries.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
              {contactEntries.map((entry) => {
                const href = contactHref(entry)
                if (!href) return null
                return (
                  <a
                    key={`m-${entry.key}-${entry.value}`}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    target={entry.key === 'email' ? undefined : '_blank'}
                    rel={
                      entry.key === 'email'
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-800 dark:border-white/25 dark:text-white"
                    aria-label={contactLabel(entry)}
                  >
                    <ContactGlyph entry={entry} />
                  </a>
                )
              })}
            </div>
          ) : primaryMailto ? (
            <div className="mt-3 border-t border-slate-200 pt-3 dark:border-white/10">
              <a
                href={primaryMailto}
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded-full border border-slate-300 py-2.5 text-center text-base font-medium text-slate-800 dark:border-white/25 dark:text-white"
              >
                Contact Me
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}
