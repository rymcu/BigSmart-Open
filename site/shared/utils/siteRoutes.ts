export type SiteLocale = 'zh' | 'en'

function normalizePath(path: string) {
  if (path === '/') {
    return path
  }

  return path.replace(/\/+$/, '')
}

function normalizeSlug(slug = '') {
  return slug.replace(/^\/+|\/+$/g, '')
}

export function getSiteLocale(path: string): SiteLocale {
  const normalizedPath = normalizePath(path)
  return normalizedPath === '/en' || normalizedPath.startsWith('/en/') ? 'en' : 'zh'
}

export function homePathFor(locale: SiteLocale) {
  return locale === 'en' ? '/en' : '/'
}

export function docsPathFor(locale: SiteLocale, slug = '') {
  const root = locale === 'en' ? '/en/docs' : '/docs'
  const normalizedSlug = normalizeSlug(slug)
  return normalizedSlug ? `${root}/${normalizedSlug}` : root
}

export function docsSlugFromPath(path: string): string | null {
  const normalizedPath = normalizePath(path)

  if (normalizedPath === '/docs') {
    return ''
  }
  if (normalizedPath.startsWith('/docs/')) {
    return normalizedPath.slice('/docs/'.length)
  }
  if (normalizedPath === '/en/docs') {
    return ''
  }
  if (normalizedPath.startsWith('/en/docs/')) {
    return normalizedPath.slice('/en/docs/'.length)
  }

  return null
}

export function isDocsPath(path: string) {
  return docsSlugFromPath(path) !== null
}

export function localizedPathFor(path: string, locale: SiteLocale) {
  const docsSlug = docsSlugFromPath(path)
  return docsSlug === null ? homePathFor(locale) : docsPathFor(locale, docsSlug)
}

export function legacyDocsRedirect(path: string) {
  const normalizedPath = normalizePath(path)

  if (normalizedPath === '/zh') {
    return '/docs'
  }
  if (normalizedPath.startsWith('/zh/')) {
    return `/docs${normalizedPath.slice('/zh'.length)}`
  }
  if (normalizedPath.startsWith('/en/') && !isDocsPath(normalizedPath)) {
    return `/en/docs${normalizedPath.slice('/en'.length)}`
  }

  return null
}
