export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'RYMCU BigSmart'
  },
  header: {
    title: 'RYMCU BigSmart',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/rymcu/BigSmart-Open',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `RYMCU BigSmart © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/rymcu/BigSmart-Open',
      'target': '_blank',
      'aria-label': 'BigSmart on GitHub'
    }]
  },
  toc: {
    title: '目录',
    bottom: {
      title: '项目链接',
      edit: 'https://github.com/rymcu/BigSmart-Open/edit/main/site/content',
      links: [{
        icon: 'i-lucide-book-open',
        label: 'GitHub Repository',
        to: 'https://github.com/rymcu/BigSmart-Open',
        target: '_blank'
      }]
    }
  }
})
