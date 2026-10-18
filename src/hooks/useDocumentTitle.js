import { useEffect } from 'react'
import { SITE } from '../config/site'

/** Sets the tab title for the current page. Pass nothing for the site-level title. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.name}` : `${SITE.name} · ${SITE.tagline}`
  }, [title])
}
