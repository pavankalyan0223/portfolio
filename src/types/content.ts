/** Loose site document shape so JSON can evolve without breaking the UI. */
export type HeroAction = {
  label: string
  type: 'mailto' | 'link' | 'tel'
  value: string
}

export type HeroBlock = {
  title?: string
  subtitle?: string
  description?: string
  avatarUrl?: string
  id?: string
  actions?: HeroAction[]
}

export type HeaderBlock = {
  logoText?: string
  activeNav?: string
  navLinks?: string[]
}

export type AboutBlock = {
  title?: string
  subtitle?: string
  paragraphs?: string[]
  resumeUrl?: string
}

export type ProjectItem = {
  id: string | number
  title?: string
  description?: string
  technologies?: string | string[]
  imageUrl?: string
  link?: string
}

export type ExperienceItem = {
  id: string | number
  role?: string
  company?: string
  duration?: string
  points?: string[]
}

export type ThemeAnimationStyle = 'modern' | 'technical' | 'minimal' | 'reveal'

export type ThemeConfig = {
  activeTheme?: string
  animationStyle?: ThemeAnimationStyle
}

export type SiteContent = {
  activeTheme?: string
  animationStyle?: ThemeAnimationStyle
  themeConfig?: ThemeConfig
  hero?: HeroBlock
  about?: AboutBlock
  projects?: ProjectItem[]
  experience?: ExperienceItem[]
  header?: HeaderBlock
  /** Top-level nav when `header.navLinks` is absent. */
  navLinks?: string[]
  personalInfo?: {
    name?: string
    role?: string
    bio?: string
  }
  contact?: Record<string, string | undefined>
}
