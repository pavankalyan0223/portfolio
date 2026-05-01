import { createContext } from 'react'
import type { SiteContent } from '../types/content'

export const SiteContentContext = createContext<SiteContent | null>(null)
