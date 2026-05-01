import { useContext } from 'react'
import type { SiteContent } from '../types/content'
import { SiteContentContext } from './siteContentContext'

export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext)
  if (!ctx) {
    throw new Error('useSiteContent must be used within a SiteContentProvider')
  }
  return ctx
}
