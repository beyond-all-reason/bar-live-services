<template>
    <v-app id="vApp" :class="`${this.$vuetify.breakpoint.name} ${inIframe ? 'iframe' : ''}`">
        <Navigation />
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import "iframe-resizer/js/iframeResizer.contentWindow";

@Component
export default class DefaultLayout extends Vue {
    get pageTitle () {
        return this.$store.state.pageTitle;
    }

    get inIframe () {
        if (process.browser) {
            return window.self !== window.top;
        }
        return false;
    }
}
</script>

<style lang="scss">
@import "~/assets/scss/main.scss";

.theme--dark.v-application {
    background: linear-gradient(180deg,rgba(0,0,0,.84),rgba(0,0,0,.84)),url("~assets/images/background.jpg") !important;
    &.iframe {
        background: transparent !important;
    }
}
.page-title {
    margin: 10px 0;
    font-size: 68px;
    font-weight: 700;
    text-align: center;
    .iframe & {
        display: none;
    }
}
.v-toolbar__content {
    padding: 0;
}
</style>
