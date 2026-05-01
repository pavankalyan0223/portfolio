import { FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProjectCard } from '../components/ProjectCard'
import { useSiteContent } from '../context/useSiteContent'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import type { ProjectItem } from '../types/content'

export type ProjectsProps = {
  title?: string
  subtitle?: string
  projects?: ProjectItem[]
}

function isProjectItem(value: unknown): value is ProjectItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string' || typeof item.id === 'number'
}

export function Projects({
  title = 'Projects',
  subtitle = 'Some of my Work',
  projects,
}: ProjectsProps) {
  const content = useSiteContent()
  const animation = useThemeAnimation()
  const source = projects ?? content.projects
  const projectItems = Array.isArray(source) ? source.filter(isProjectItem) : []

  return (
    <section
      id="projects"
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
          <FolderKanban className="h-9 w-9 text-slate-600 dark:text-zinc-400" aria-hidden />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">{subtitle}</p>
        </motion.div>

        {projectItems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={animation.containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={animation.viewport}
          >
            {projectItems.map((project, index) => (
              <ProjectCard key={`${project.id}-${index}`} project={project} />
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
