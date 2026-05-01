import { useEffect, useRef } from 'react'

const GRID_LIGHT = `linear-gradient(to_right,rgb(0_0_0/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.07)_1px,transparent_1px)`
const GRID_DARK = `linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.07)_1px,transparent_1px)`

/**
 * Cursor-following grid + glow. Uses transform (not CSS vars in masks) so all browsers repaint reliably.
 */
export function CursorGlass() {
  const lightRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const invertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const light = lightRef.current
    const dark = darkRef.current
    const blur = blurRef.current
    const invert = invertRef.current
    if (!light || !dark || !blur || !invert) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const move = (cx: number, cy: number) => {
      const t = `translate3d(${cx}px,${cy}px,0) translate(-50%, -50%)`
      light.style.transform = t
      dark.style.transform = t
      blur.style.transform = t
      invert.style.transform = t
    }

    let raf = 0
    const onPointerMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => move(e.clientX, e.clientY))
    }

    move(window.innerWidth / 2, window.innerHeight / 2)

    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <>
      {/* Grid + tint — light theme */}
      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 h-[min(92vmin,760px)] w-[min(92vmin,760px)] opacity-90 will-change-transform [mix-blend-mode:multiply] dark:hidden"
        style={{
          backgroundImage: `${GRID_LIGHT}, radial-gradient(circle closest-side, rgb(14 165 233 / 0.2), transparent 72%)`,
          backgroundSize: '4rem 4rem, 100% 100%',
        }}
      />
      {/* Grid + tint — dark theme */}
      <div
        ref={darkRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[min(92vmin,760px)] w-[min(92vmin,760px)] opacity-95 will-change-transform [mix-blend-mode:screen] dark:block"
        style={{
          backgroundImage: `${GRID_DARK}, radial-gradient(circle closest-side, rgb(125 211 252 / 0.16), transparent 72%)`,
          backgroundSize: '4rem 4rem, 100% 100%',
        }}
      />
      {/* Small frosted core */}
      <div
        ref={blurRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[39] h-[min(42vmin,320px)] w-[min(42vmin,320px)] will-change-transform"
      >
        <div
          className="h-full w-full rounded-full opacity-70 [mix-blend-mode:overlay] dark:[mix-blend-mode:soft-light]"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background:
              'radial-gradient(circle closest-side, rgb(255 255 255 / 0.06), transparent 85%)',
          }}
        />
      </div>
      {/* Color inversion lens: only inside moving circle */}
      <div
        ref={invertRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[41] h-[min(34vmin,260px)] w-[min(34vmin,260px)] will-change-transform"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            backdropFilter: 'invert(1)',
            WebkitBackdropFilter: 'invert(1)',
            background: 'radial-gradient(circle, rgb(255 255 255 / 0.12), transparent 72%)',
          }}
        />
      </div>
    </>
  )
}
