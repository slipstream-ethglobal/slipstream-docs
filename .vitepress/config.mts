import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Slipstream SDK",
  description: "TypeScript SDK for Slipstream Proxy Server",

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API Reference', link: '/api/slipstream-sdk' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Examples', link: '/examples' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'SlipstreamSDK', link: '/api/slipstream-sdk' },
          { text: 'Types', link: '/api/types' },
          { text: 'Services', link: '/api/services' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/slipstream-ethglobal/slipstream' }
    ],

    search: {
      provider: 'local'
    }
  }
})
