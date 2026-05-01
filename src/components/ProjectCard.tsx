import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import type { ProjectItem } from '../types/content'

export type ProjectCardProps = {
  project: ProjectItem
}

function resolveImageSrc(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const value = raw.trim()
  if (!value) return undefined
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value
  if (value.startsWith('./assets/')) return `/${value.replace(/^\.\//, '')}`
  return value
}

function normalizeTech(technologies: ProjectItem['technologies']): string[] {
  if (Array.isArray(technologies)) {
    return technologies.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    )
  }
  if (typeof technologies === 'string' && technologies.trim().length > 0) {
    return technologies
      .split('/')
      .map((part) => part.trim())
      .filter(Boolean)
  }
  return []
}

export function ProjectCard({ project }: ProjectCardProps) {
  const animation = useThemeAnimation()
  const title = project.title?.trim() || 'Untitled Project'
  const description = project.description?.trim()
  const imageUrl = resolveImageSrc(project.imageUrl)
  const link = project.link?.trim() || '#'
  const techList = normalizeTech(project.technologies)
  const isExternal = /^https?:\/\//i.test(link)

  const hoverState =
    animation.style === 'modern'
      ? { scale: animation.hoverCard.scale ?? 1.02, y: -2 }
      : animation.style === 'technical'
        ? {
            scale: 1.01,
            boxShadow:
              animation.hoverCard.boxShadow ??
              '0 0 0 1px rgba(56,189,248,0.3), 0 16px 36px rgba(2,132,199,0.12)',
          }
        : undefined

  return (
    <motion.article
      variants={animation.itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={animation.viewport}
      whileHover={hoverState}
      transition={animation.transition}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-300 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/60"
    >
      <div className="relative mb-4 h-44 w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-zinc-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} preview`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500 dark:text-zinc-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {description}
          </p>
        ) : null}

        {techList.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {techList.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5">
          <a
            href={link}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-900 transition hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </motion.article>
  )
}
