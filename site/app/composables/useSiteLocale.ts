import { en, zh_cn } from '@nuxt/ui/locale'
import {
  docsPathFor,
  getSiteLocale,
  homePathFor,
  isDocsPath,
  localizedPathFor,
  type SiteLocale
} from '#shared/utils/siteRoutes'

const messages = {
  zh: {
    copyActions: '打开复制操作菜单',
    copyMarkdownLink: '复制 Markdown 链接',
    copyPage: '复制本页',
    copiedToClipboard: '已复制到剪贴板',
    docsLabel: '文档',
    editThisPage: '编辑本页',
    homeLabel: '产品首页',
    menuDescription: '产品、文档与项目入口',
    menuTitle: 'RYMCU BigSmart 导航',
    openInChatGPT: '在 ChatGPT 中打开',
    openInClaude: '在 Claude 中打开',
    pageNotFoundDescription: '抱歉，找不到这个页面。',
    pageNotFoundTitle: '页面未找到',
    productNavigationLabel: '产品导航',
    productLinks: [
      { label: '硬件规格', hash: '#hardware' },
      { label: '固件与文档', hash: '#possibilities' },
      { label: '工程文件', hash: '#open-hardware' },
      { label: '上游适配', hash: '#ecosystem' }
    ],
    projectLinksTitle: '项目链接',
    repositoryLabel: 'GitHub 仓库',
    readInAiPrompt: (url: string) => `请阅读 ${url}，我会基于它继续提问。`,
    searchDescription: '在中文文档中搜索页面、标题和正文。',
    searchPlaceholder: '搜索文档...',
    searchTitle: '搜索文档',
    tocTitle: '目录',
    viewAsMarkdown: '查看 Markdown'
  },
  en: {
    copyActions: 'Open copy actions menu',
    copyMarkdownLink: 'Copy Markdown link',
    copyPage: 'Copy page',
    copiedToClipboard: 'Copied to clipboard',
    docsLabel: 'Docs',
    editThisPage: 'Edit this page',
    homeLabel: 'Product',
    menuDescription: 'Product, documentation, and project links',
    menuTitle: 'RYMCU BigSmart navigation',
    openInChatGPT: 'Open in ChatGPT',
    openInClaude: 'Open in Claude',
    pageNotFoundDescription: 'We are sorry, but this page could not be found.',
    pageNotFoundTitle: 'Page not found',
    productNavigationLabel: 'Product navigation',
    productLinks: [
      { label: 'Hardware specs', hash: '#hardware' },
      { label: 'Firmware & docs', hash: '#possibilities' },
      { label: 'Engineering files', hash: '#open-hardware' },
      { label: 'Upstream merges', hash: '#ecosystem' }
    ],
    projectLinksTitle: 'Project links',
    repositoryLabel: 'GitHub Repository',
    readInAiPrompt: (url: string) => `Read ${url} so I can ask questions about it.`,
    searchDescription: 'Search pages, headings, and content in the English documentation.',
    searchPlaceholder: 'Search docs...',
    searchTitle: 'Search docs',
    tocTitle: 'On this page',
    viewAsMarkdown: 'View as Markdown'
  }
} as const

export function useSiteLocale() {
  const route = useRoute()

  const locale = computed<SiteLocale>(() => getSiteLocale(route.path))
  const htmlLang = computed(() => locale.value === 'en' ? 'en' : 'zh-CN')
  const ogLocale = computed(() => locale.value === 'en' ? 'en_US' : 'zh_CN')
  const uiLocale = computed(() => locale.value === 'en' ? en : zh_cn)
  const text = computed(() => messages[locale.value])
  const homePath = computed(() => homePathFor(locale.value))
  const docsRoot = computed(() => docsPathFor(locale.value))
  const isDocsRoute = computed(() => isDocsPath(route.path))
  const oppositeLocale = computed<SiteLocale>(() => locale.value === 'en' ? 'zh' : 'en')
  const oppositeLocaleLabel = computed(() => locale.value === 'en' ? '中文' : 'English')
  const oppositeLocalePath = computed(() => localizedPathFor(route.path, oppositeLocale.value))

  function docsPath(slug = '') {
    return docsPathFor(locale.value, slug)
  }

  return {
    locale,
    htmlLang,
    ogLocale,
    uiLocale,
    text,
    homePath,
    docsRoot,
    docsPath,
    isDocsRoute,
    oppositeLocale,
    oppositeLocaleLabel,
    oppositeLocalePath
  }
}
