var website = require("./src/components/SEO/config")

module.exports = {
  siteMetadata: {
    siteUrl: website.url, // For gatsby-plugin-sitemap
    // pathPrefix,
    title: website.title,
    description: website.description,
    banner: website.banner,
    siteLanguage: website.siteLanguage,
    ogLanguage: website.ogLanguage,
    // titleAlt: website.titleAlt,
    // headline: website.headline,
    // twitter: website.twitter,
    // facebook: website.facebook,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    // {
    //   // keep as first gatsby-source-filesystem plugin for gatsby image support
    //   resolve: "gatsby-source-filesystem",
    //   options: {
    //     path: `${__dirname}/static/media`,
    //     name: "media",
    //   },
    // },
    {
      resolve: "@chakra-ui/gatsby-plugin",
      options: {
        /**
         * @property {boolean} [resetCSS=true]
         * if false, this plugin will not use `<CSSReset />
         */
        resetCSS: true,
        /**
         * @property {boolean} [isUsingColorMode=true]
         * if false, this plugin will not use <ColorModeProvider />
         */
        isUsingColorMode: true,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Neucha:400"],
          display: "swap",
        },
      },
    },
    `gatsby-plugin-react-helmet`,
  ],
}
