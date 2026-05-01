import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../context/useSiteContent'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import type { AboutBlock } from '../types/content'

export type AboutProps = {
  /** Optional override; defaults to `about` from site content. */
  data?: AboutBlock | undefined
}

function normalizeParagraphs(paragraphs: AboutBlock['paragraphs']): string[] {
  if (!Array.isArray(paragraphs)) return []
  return paragraphs.filter(
    (p): p is string => typeof p === 'string' && p.trim().length > 0,
  )
}

export function About({ data: dataProp }: AboutProps) {
  const content = useSiteContent()
  const animation = useThemeAnimation()
  const data = dataProp ?? content.about
  if (!data) return null

  const paragraphs = normalizeParagraphs(data.paragraphs)
  const resumeUrl = data.resumeUrl?.trim()
  const title = data.title?.trim()
  const subtitle = data.subtitle?.trim()

  if (!title && !subtitle && paragraphs.length === 0 && !resumeUrl) {
    return null
  }

  const isExternal =
    !!resumeUrl &&
    /^https?:\/\//i.test(resumeUrl)

  return (
    <article
      id="about"
      className="scroll-mt-20 border-t border-slate-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:px-8"
    >
      <motion.div
        className="mx-auto max-w-3xl p-6 sm:p-8 lg:p-10"
        variants={animation.itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={animation.viewport}
      >
        {title ? (
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="mt-2 text-center text-sm text-slate-600 sm:text-base dark:text-zinc-400">
            {subtitle}
          </p>
        ) : null}

        {paragraphs.length > 0 ? (
          <motion.div
            className="mt-8 space-y-5"
            variants={animation.containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={animation.viewport}
          >
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                variants={animation.lineVariants}
                className="text-balance text-center text-base leading-relaxed text-slate-600 dark:text-zinc-400"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>
        ) : null}

        {resumeUrl ? (
          <div className="mt-10 flex justify-center">
            <a
              href={resumeUrl}
              download={isExternal ? undefined : true}
              {...(isExternal
                ? {
                    target: '_blank' as const,
                    rel: 'noopener noreferrer' as const,
                  }
                : {})}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-white/40 dark:text-white dark:hover:bg-white/10 sm:px-8 sm:text-base"
            >
              <Download className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
              Download Resume
            </a>
          </div>
        ) : null}
      </motion.div>
    </article>
  )
}
