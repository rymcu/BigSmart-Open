import { joinURL, withLeadingSlash, withoutTrailingSlash } from 'ufo'
import type { MinimarkTree } from 'minimark'
import { stringify } from 'minimark/stringify'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'
import { getSiteLocale, isDocsPath, legacyDocsRedirect } from '#shared/utils/siteRoutes'

function addBaseURL(value: string, baseURL: string) {
  if (!value.startsWith('/') || value.startsWith('//')) {
    return value
  }

  const basePath = withoutTrailingSlash(baseURL)
  if (!basePath || basePath === '/') {
    return value
  }

  if (value === basePath || value.startsWith(`${basePath}/`)
    || value.startsWith(`${basePath}?`) || value.startsWith(`${basePath}#`)) {
    return value
  }

  return joinURL(basePath, value)
}

function addBaseURLToNode(node: unknown, baseURL: string) {
  if (!Array.isArray(node)) {
    return
  }

  if (typeof node[0] === 'string' && node[1] && typeof node[1] === 'object' && !Array.isArray(node[1])) {
    const attributes = node[1]
    for (const key of ['href', 'src']) {
      const value = attributes[key]
      if (typeof value === 'string') {
        attributes[key] = addBaseURL(value, baseURL)
      }
    }
  }

  for (const child of node) {
    addBaseURLToNode(child, baseURL)
  }
}

function addBaseURLToMarkdown(tree: MinimarkTree, baseURL: string) {
  addBaseURLToNode(tree.value, baseURL)
}

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  const requestedPath = withLeadingSlash(slug.replace('.md', ''))
  const path = requestedPath === '/en'
    ? '/en/docs'
    : legacyDocsRedirect(requestedPath) || requestedPath

  if (!isDocsPath(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  const collection = (getSiteLocale(path) === 'en' ? 'docsEn' : 'docsZh') as keyof Collections
  const page = await queryCollection(event, collection).path(path).first()
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  const body = structuredClone(page.body) as MinimarkTree

  // Add title and description to the top of the page if missing
  if (body.value[0]?.[0] !== 'h1') {
    body.value.unshift(['blockquote', {}, page.description])
    body.value.unshift(['h1', {}, page.title])
  }

  const runtimeConfig = useRuntimeConfig(event)
  const siteBaseURL = new URL(runtimeConfig.public.siteUrl).pathname
  addBaseURLToMarkdown(body, siteBaseURL)

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return stringify(body, { format: 'markdown/html' })
})
