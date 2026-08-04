import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import { joinURL } from 'ufo'
import { getSiteLocale, isDocsPath, legacyDocsRedirect } from '#shared/utils/siteRoutes'

export default defineMcpTool({
  description: `Retrieves the full content and details of a specific documentation page.

WHEN TO USE: Use this tool when you know the EXACT path to a documentation page. Common use cases:
- User asks for a specific page: "Show me the getting started guide" → /getting-started
- User asks about a known topic with a dedicated page
- You found a relevant path from list-pages and want the full content
- User references a specific section or guide they want to read

WHEN NOT TO USE: If you don't know the exact path and need to search/explore, use list-pages first.

WORKFLOW: This tool returns the complete page content including title, description, and full markdown. Use this when you need to provide detailed answers or code examples from specific documentation pages.`,
  inputSchema: {
    path: z.string().describe('The page path from list-pages or provided by the user (e.g., /docs/quick-start)')
  },
  cache: '1h',
  handler: async ({ path }) => {
    const event = useEvent()
    const url = getRequestURL(event)
    const runtimeConfig = useRuntimeConfig(event)
    const origin = `${url.protocol}//${url.host}`
    const siteUrl = import.meta.dev ? origin : joinURL(origin, runtimeConfig.app.baseURL)
    const publicPath = path === '/en' ? '/en/docs' : legacyDocsRedirect(path) || path

    try {
      if (!isDocsPath(publicPath)) {
        throw createError({ statusCode: 404, statusMessage: 'Page not found' })
      }

      const collection = getSiteLocale(publicPath) === 'en' ? 'docsEn' : 'docsZh'
      const page = await queryCollection(event, collection)
        .where('path', '=', publicPath)
        .select('title', 'path', 'description')
        .first()

      if (!page) {
        return {
          content: [{ type: 'text', text: 'Page not found' }],
          isError: true
        }
      }

      const content = await $fetch<string>(`/raw${publicPath}.md`, {
        baseURL: siteUrl
      })

      const result = {
        title: page.title,
        path: page.path,
        description: page.description,
        content,
        url: joinURL(siteUrl, page.path)
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      }
    } catch {
      return {
        content: [{ type: 'text', text: 'Failed to get page' }],
        isError: true
      }
    }
  }
})
