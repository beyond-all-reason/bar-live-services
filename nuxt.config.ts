import { NuxtConfig } from "@nuxt/types";

console.log("NODE_ENV", process.env.NODE_ENV);
console.log("BASE_URL", process.env.BASE_URL);

const isProd = process.env.NODE_ENV === "production";

const nuxtConfig: NuxtConfig = {
    axios: {
        baseURL: process.env.BASE_URL || 'http://localhost:3001'
    },
    privateRuntimeConfig: {
        axios: {
            baseURL: process.env.BASE_URL || 'http://localhost:3001',
        }
    },
    publicRuntimeConfig: {
        objectStorageUrl: "https://storage.uk.cloud.ovh.net/v1/AUTH_10286efc0d334efd917d476d7183232e/BAR"
    },
    components: [
        "~/components",
        { path: "~/pages", pattern: "*/components/**", pathPrefix: false }
    ],
    ignore: [
        "pages/*/components/*",
        "working-files/"
    ],
    router: {
        extendRoutes(routes, resolve) {
            routes.push({
                path: "",
                redirect: "/replays"
            })
        }
    },
    head: {
        title: "BAR Live Services",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "Live data for the RTS game Beyond All Reason" },
            { name: "robots", content: "noindex" },
            { hid: "og:title", name: "og:title", property: "og:title", content: "BAR Live Services" },
            { hid: "og:site_name", name: "og:site_name", property: "og:site_name", content: "BAR Live Services" },
            { hid: "og:description", name: "og:description", property: "og:description", content: "Live, dynamic data such as replays, leaderboards and live battles for the RTS game Beyond All Reason" },
        ],
        link: [
            { rel: "icon", type: "image/png", href: "/favicon.png" },
        ]
    },
    css: [
        '~/assets/scss/styles.scss'
    ],
    styleResources: {
        scss: [
            '~/assets/scss/variables.scss',
            '~/assets/scss/mixins.scss',
        ]
    },
    vuetify: {
        customVariables: ['~/assets/scss/variables.scss'],
        treeShake: true,
        optionsPath: "./vuetify.options.ts"
    },
    pageTransition: {
        name: "slide-transition",
        mode: "out-in"
    },
    googleFonts: {
        families: {
            Poppins: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        }
    },
    build: {
        transpile: [
            "three"
        ],
        babel: {
            generatorOpts: {
                compact: false
            }
        }
    },
    buildModules: [
        "@nuxt/typescript-build",
        "@nuxtjs/moment",
        "@nuxtjs/vuetify",
        "@nuxtjs/google-fonts"
    ],
    modules: [
        "@nuxtjs/pwa",
        '@nuxtjs/axios',
        '@nuxtjs/style-resources'
    ],
    serverMiddleware: [{ path: '/api/leaderboard', handler: '~/serverMiddleware/proxy.js' }]
}

export default nuxtConfig;
