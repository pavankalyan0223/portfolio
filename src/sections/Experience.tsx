import { BriefcaseBusiness } from 'lucide-react'
import { motion } from 'framer-motion'
import { TimelineItem } from '../components/TimelineItem'
import { useSiteContent } from '../context/useSiteContent'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import type { ExperienceItem } from '../types/content'

export type ExperienceProps = {
  title?: string
  subtitle?: string
  experiences?: ExperienceItem[]
}

function isExperienceItem(value: unknown): value is ExperienceItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string' || typeof item.id === 'number'
}

export function Experience({
  title = 'Experience',
  subtitle = 'Where I have worked',
  experiences,
}: ExperienceProps) {
  const content = useSiteContent()
  const animation = useThemeAnimation()
  const source = experiences ?? content.experience
  const items = Array.isArray(source) ? source.filter(isExperienceItem) : []

  return (
    <section
      id="experience"
      className="border-t border-slate-200 bg-slate-50 px-4 py-16 dark:border-white/10 dark:bg-[#121212] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-10 flex flex-col items-center gap-3 text-center"
          variants={animation.itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animation.viewport}
        >
          <BriefcaseBusiness className="h-9 w-9 text-sky-400" aria-hidden />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">{subtitle}</p>
        </motion.div>

        {items.length > 0 ? (
          <div className="relative">
            <span className="absolute bottom-0 left-4 top-0 w-px bg-slate-300 md:left-1/2 md:-translate-x-1/2 dark:bg-white/10" />
            <motion.div
              className="space-y-8"
              variants={animation.containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={animation.viewport}
            >
              {items.map((item, index) => {
                const align = index % 2 === 0 ? 'left' : 'right'
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`md:flex ${align === 'right' ? 'md:justify-end' : 'md:justify-start'}`}
                  >
                    <TimelineItem item={item} align={align} />
                  </div>
                )
              })}
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
