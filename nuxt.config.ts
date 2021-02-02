import { NuxtConfig } from "@nuxt/types";

const isProd = process.env.NODE_ENV === "production";

const nuxtConfig: NuxtConfig = {
    watch: ["modules"],
    components: true,
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
        baseURL: isProd ? "https://localhost/api" : "http://localhost:3000/api"
    }
}

export default nuxtConfig;
