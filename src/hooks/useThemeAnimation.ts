import type { Transition, Variants } from 'framer-motion'
import { useSiteContent } from '../context/useSiteContent'
import type { ThemeAnimationStyle } from '../types/content'

type HoverConfig = {
  scale?: number
  boxShadow?: string
}

export type ThemeAnimationConfig = {
  style: ThemeAnimationStyle
  activeTheme: string
  itemVariants: Variants
  /** Lighter staggered lines (e.g. bullet paragraphs). */
  lineVariants: Variants
  containerVariants: Variants
  hoverCard: HoverConfig
  viewport: { once: boolean; amount: number | 'some' | 'all'; margin?: string }
  transition: Transition
}

function resolveAnimationStyle(
  animationStyle: ThemeAnimationStyle | undefined,
): ThemeAnimationStyle {
  if (!animationStyle) return 'modern'
  if (animationStyle === 'reveal') return 'technical'
  return animationStyle
}

export function useThemeAnimation(): ThemeAnimationConfig {
  const content = useSiteContent()
  const activeTheme =
    content.themeConfig?.activeTheme ?? content.activeTheme ?? 'modern'
  const style = resolveAnimationStyle(
    content.themeConfig?.animationStyle ?? content.animationStyle,
  )

  /** Pixel-only margins: % values are invalid for IntersectionObserver and can break `whileInView`. */
  const viewport = {
    once: true,
    amount: 0.12 as const,
    margin: '0px 0px -48px 0px',
  }

  if (style === 'minimal') {
    return {
      style,
      activeTheme,
      viewport,
      transition: { duration: 0.22, ease: 'easeOut' },
      hoverCard: {},
      containerVariants: {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.02 },
        },
      },
      lineVariants: {
        hidden: { opacity: 0, y: 6 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.2, ease: 'easeOut' },
        },
      },
      itemVariants: {
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.22, ease: 'easeOut' },
        },
      },
    }
  }

  if (style === 'technical') {
    return {
      style,
      activeTheme,
      viewport,
      transition: { type: 'spring', stiffness: 140, damping: 18 },
      hoverCard: {
        boxShadow:
          '0 0 0 1px rgba(56,189,248,0.35), 0 18px 42px rgba(2,132,199,0.15)',
      },
      containerVariants: {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.06 },
        },
      },
      lineVariants: {
        hidden: { opacity: 0, x: -14, skewX: -1 },
        visible: {
          opacity: 1,
          x: 0,
          skewX: 0,
          transition: { type: 'spring', stiffness: 160, damping: 20 },
        },
      },
      itemVariants: {
        hidden: {
          opacity: 0,
          y: 44,
          x: -18,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { type: 'spring', stiffness: 120, damping: 17 },
        },
      },
    }
  }

  return {
    style: 'modern',
    activeTheme,
    viewport,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    hoverCard: {
      scale: 1.02,
    },
    containerVariants: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.04 },
      },
    },
    lineVariants: {
      hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      },
    },
    itemVariants: {
      hidden: {
        opacity: 0,
        y: 40,
        scale: 0.94,
        filter: 'blur(12px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      },
    },
  }
}
