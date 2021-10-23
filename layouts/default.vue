<template>
    <v-app id="vApp" :class="`${this.$route.name} ${this.$vuetify.breakpoint.name} ${!this.$store.state.embedded ? 'not-embedded' : 'embedded'}`">
        <Navigation v-show="!this.$store.state.embedded" />
        <div class="wrapper-container">
            <div class="wrapper">
                <Nuxt />
            </div>
        </div>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import "iframe-resizer/js/iframeResizer.contentWindow";

@Component({
    watch: {
        $route(route) {
            if ((window as any).parentIFrame && (window as any).parentIFrame.sendMessage) {
                (window as any).parentIFrame.sendMessage({
                    params: route.params,
                    query: route.query
                });
            }
        }
    }
})
export default class DefaultLayout extends Vue {
    fetchOnServer() { return false; }

    async fetch() {
        if (process.browser) {
            this.$store.commit("setEmbedded", window.self !== window.top);
        }
    }
}
</script>

<style lang="scss">
.theme--dark.v-application {
    background: transparent !important;
    &.not-embedded {
        background: linear-gradient(180deg,rgba(0,0,0,.84),rgba(0,0,0,.84)),url("~assets/images/background.jpg") !important;
    }
}
.page-title {
    margin: 10px 0;
    font-size: clamp(2rem, 4vw, 10rem);
    font-weight: 700;
    text-align: center;
    display: none;
    .not-embedded & {
        display: block;
    }
}
.v-toolbar__content {
    padding: 0;
}
.wrapper-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px;
}
.wrapper {
    width: 100%;
    max-width: 1700px;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>
