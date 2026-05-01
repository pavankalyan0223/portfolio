import { motion } from 'framer-motion'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import type { ExperienceItem } from '../types/content'

export type TimelineItemProps = {
  item: ExperienceItem
  align?: 'left' | 'right'
}

function normalizePoints(points: ExperienceItem['points']): string[] {
  if (!Array.isArray(points)) return []
  return points.filter(
    (point): point is string => typeof point === 'string' && point.trim().length > 0,
  )
}

export function TimelineItem({ item, align = 'left' }: TimelineItemProps) {
  const animation = useThemeAnimation()
  const role = item.role?.trim() || 'Role'
  const company = item.company?.trim()
  const duration = item.duration?.trim()
  const points = normalizePoints(item.points)

  const hoverState =
    animation.style === 'modern'
      ? { scale: animation.hoverCard.scale ?? 1.02 }
      : animation.style === 'technical'
        ? {
            scale: 1.01,
            boxShadow:
              animation.hoverCard.boxShadow ??
              '0 0 0 1px rgba(56,189,248,0.35), 0 18px 42px rgba(2,132,199,0.15)',
          }
        : undefined

  return (
    <div className="relative pl-12 md:w-1/2 md:pl-0">
      <span className="absolute left-[0.95rem] top-5 h-3.5 w-3.5 rounded-full border-2 border-sky-400 bg-slate-50 md:left-1/2 md:top-6 md:-translate-x-1/2 dark:bg-[#121212]" />

      <div
        className={`md:px-8 ${align === 'right' ? 'md:ml-auto' : ''}`}
      >
        <motion.article
          variants={animation.itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animation.viewport}
          whileHover={hoverState}
          transition={animation.transition}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-sky-400/50 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.15)] dark:border-white/10 dark:bg-zinc-900/50 sm:p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{role}</h3>
          {company ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{company}</p>
          ) : null}
          {duration ? (
            <p className="mt-1 text-xs italic text-slate-500 dark:text-zinc-400">{duration}</p>
          ) : null}

          {points.length > 0 ? (
            <motion.ul
              className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-300"
              variants={animation.containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={animation.viewport}
            >
              {points.map((point, index) => (
                <motion.li key={`${item.id}-${index}`} variants={animation.lineVariants}>
                  {point}
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </motion.article>
      </div>
    </div>
  )
}
