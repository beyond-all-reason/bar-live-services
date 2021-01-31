import { NuxtConfig } from "@nuxt/types";

const nuxtConfig: NuxtConfig = {
    watch: ["modules"],
    components: true,
    //loading: { color: '#333333',height: '5px', throttle: 0 },
    loading: '~/components/LoadingBar.vue',
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
    css: [
        '~/assets/scss/main.scss'
    ],
    buildModules: [
        "@nuxt/typescript-build",
        "@nuxt/image",
        "@nuxtjs/moment"
    ],
    modules: [
        "@nuxtjs/pwa",
        "@nuxt/http",
        "~/modules/api"
    ],
    http: {
        baseURL: 'http://localhost:3000/api'
    }
}

export default nuxtConfig;
