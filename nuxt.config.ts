import { NuxtConfig } from "@nuxt/types";

const nuxtConfig: NuxtConfig = {
    watch: ["modules"],

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: "BAR",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "" }
        ],
        link: [
            { rel: "icon", type: "image/png", href: "/favicon.png" },
            { rel: "preconnect", href: "https://fonts.gstatic.com" },
            { rel: "preconnect", href: "https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900", media: "all" },
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        '~/assets/scss/main.scss'
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        "@nuxt/typescript-build"
    ],

    build: {
    },

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/pwa
        "@nuxtjs/pwa",
        //'nuxt-socket-io',
        //"~/modules/init-module",
        "~/modules/api"
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        //{ src: "~/plugins/test.ts", mode: "server" }
    ],

    // io: {
    //     sockets: [
    //         {
    //             name: 'battles',
    //             url: 'http://localhost:3000',
    //             default: true,
    //             vuex: { /* see section below */ },
    //             namespaces: { /* see section below */ }
    //         }
    //     ]
    // },

    serverMiddleware: [
       // "~/bob/bob"
       //{ path: "/api", handler: "~/api/rest.ts" },
    ],

    
}

export default nuxtConfig;
