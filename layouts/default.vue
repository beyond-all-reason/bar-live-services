<template>
    <v-app style="background: none">
        <Navigation />
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    computed: {
        pageTitle () {
            return this.$store.state.pageTitle;
        }
    }
});
</script>

<style lang="scss">
@import "~/assets/scss/main.scss";
// .wrapper {
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
// }
.app {

}
.page-title {
    margin: 10px 0;
    font-size: 68px;
    font-weight: 700;
    text-align: center;
}
.v-toolbar__content {
    padding: 0;
}
</style>
