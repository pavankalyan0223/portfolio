import type { ReactNode } from 'react'
import type { SiteContent } from '../types/content'
import { SiteContentContext } from './siteContentContext'

export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteContent
  children: ReactNode
}) {
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}
