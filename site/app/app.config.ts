export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: 'rounded-md font-semibold tracking-normal'
      },
      variants: {
        size: {
          xs: {
            base: 'h-7 gap-1 px-2 py-0 text-xs',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4'
          },
          sm: {
            base: 'h-8 gap-1.5 px-2.5 py-0 text-xs',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4'
          },
          md: {
            base: 'h-9 gap-2 px-3 py-0 text-sm',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          },
          lg: {
            base: 'h-10 gap-2 px-3.5 py-0 text-sm',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          },
          xl: {
            base: 'h-11 gap-2 px-4 py-0 text-base',
            leadingIcon: 'size-5',
            trailingIcon: 'size-5'
          }
        }
      },
      compoundVariants: [
        { size: 'xs', square: true, class: { base: 'size-7 justify-center p-0' } },
        { size: 'sm', square: true, class: { base: 'size-8 justify-center p-0' } },
        { size: 'md', square: true, class: { base: 'size-9 justify-center p-0' } },
        { size: 'lg', square: true, class: { base: 'size-10 justify-center p-0' } },
        { size: 'xl', square: true, class: { base: 'size-11 justify-center p-0' } },
        {
          variant: 'ghost',
          class: { base: 'focus-visible:ring-2 focus-visible:ring-primary' }
        }
      ]
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
