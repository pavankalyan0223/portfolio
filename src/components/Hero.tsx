import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useSiteContent } from '../context/useSiteContent'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import {
  actionHref,
  resolveHeroActions,
  resolveHeroFields,
} from '../lib/siteContentHelpers'

export function Hero() {
  const content = useSiteContent()
  const animation = useThemeAnimation()
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { title, subtitle, description, avatarUrl, sectionId } =
    resolveHeroFields(content)
  const actions = resolveHeroActions(content)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const gridShift =
    animation.style === 'technical' ? 22 : animation.style === 'minimal' ? 5 : 14
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', `${gridShift}%`])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.72, 0.45])
  const gridScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, animation.style === 'technical' ? 1.04 : 1.02],
  )
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', animation.style === 'minimal' ? '2%' : '5%'],
  )

  return (
    <motion.section
      ref={sectionRef}
      id={sectionId}
      className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 pb-20 pt-28 sm:px-6 dark:bg-[#121212]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.06)_1px,transparent_1px)] bg-[length:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_40%,#000_20%,transparent_75%)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)]"
        aria-hidden
        style={
          reduceMotion
            ? undefined
            : {
                y: gridY,
                opacity: gridOpacity,
                scale: gridScale,
              }
        }
      />

      <motion.div
        className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center"
        style={reduceMotion ? undefined : { y: contentY }}
        variants={animation.containerVariants}
        initial="hidden"
        animate="visible"
      >
        {avatarUrl ? (
          <motion.div
            className="mb-6 h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 dark:border-white/20 sm:h-32 sm:w-32"
            variants={animation.itemVariants}
          >
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        ) : null}

        {title ? (
          <motion.h1
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white"
            variants={animation.itemVariants}
          >
            {title}
          </motion.h1>
        ) : null}

        {subtitle ? (
          <motion.p
            className="mt-2 text-lg text-sky-500 sm:text-xl dark:text-sky-400"
            variants={animation.itemVariants}
          >
            {subtitle}
          </motion.p>
        ) : null}

        {description ? (
          <motion.p
            className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-slate-600 sm:text-base dark:text-zinc-400"
            variants={animation.itemVariants}
          >
            {description}
          </motion.p>
        ) : null}

        {actions.length > 0 ? (
          <motion.div
            className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
            variants={animation.containerVariants}
          >
            {actions.map((action, i) => {
              const href = actionHref(action)
              const external =
                action.type === 'link' && /^https?:\/\//i.test(href)
              return (
                <motion.a
                  key={`${action.label}-${action.type}-${i}`}
                  href={href}
                  variants={animation.lineVariants}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="inline-flex min-h-[3rem] min-w-[12rem] flex-1 items-center justify-center rounded-full border-2 border-slate-300 px-6 text-center text-base font-medium text-slate-900 transition hover:bg-slate-100 dark:border-white/40 dark:text-white dark:hover:bg-white/10 sm:flex-initial sm:px-8"
                >
                  {action.label}
                </motion.a>
              )
            })}
          </motion.div>
        ) : null}
      </motion.div>
    </motion.section>
  )
}
