import { useEffect, useState } from 'react'
import { About } from './components/About'
import { CursorGlass } from './components/CursorGlass'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import content from './content.json'
import { SiteContentProvider } from './context/SiteContentProvider'
import { Experience } from './sections/Experience'
import type { SiteContent } from './types/content'
import { Projects } from './sections/Projects'

function App() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <SiteContentProvider value={content as SiteContent}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#121212] dark:text-slate-100">
        <Header
          isDark={isDark}
          onThemeToggle={() => setIsDark((d) => !d)}
        />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <CursorGlass />
      </div>
    </SiteContentProvider>
  )
}

export default App
