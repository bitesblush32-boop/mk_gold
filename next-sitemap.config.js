/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://mkgold.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/lp/*',
    '/lp/sell-gold-bangalore',
    '/lp/emergency-cash-gold',
    '/lp/pledged-gold-release',
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/lp/'],
      },
    ],
  },

  /**
   * @param {import('next-sitemap').IConfig} cfg
   * @param {string} path
   * @returns {import('next-sitemap').ISitemapField}
   */
  transform: async (cfg, path) => {
    const defaults = {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
      alternateRefs: cfg.alternateRefs ?? [],
    };

    // Homepage
    if (path === '/') {
      return { ...defaults, priority: 1.0, changefreq: 'daily' };
    }

    // City hub pages (these come before the branch check)
    const cityHubPaths = [
      '/sell-gold-bangalore',
      '/sell-gold-mysore',
      '/sell-gold-mangalore',
      '/sell-gold-davangere',
    ];
    if (cityHubPaths.includes(path)) {
      return { ...defaults, priority: 0.8, changefreq: 'weekly' };
    }

    // Branch pages: single-segment /sell-gold-{area}
    if (path.startsWith('/sell-gold-') && path.split('/').filter(Boolean).length === 1) {
      return { ...defaults, priority: 0.9, changefreq: 'daily' };
    }

    // Core service + rate pages
    if (['/sell-gold', '/release-pledged-gold', '/gold-rate-today'].includes(path)) {
      return { ...defaults, priority: 0.7, changefreq: 'weekly' };
    }

    // Secondary marketing pages
    if (['/about', '/contact', '/why-mk-gold', '/blog'].includes(path)) {
      return { ...defaults, priority: 0.6, changefreq: 'monthly' };
    }

    return defaults;
  },
};

module.exports = config;
