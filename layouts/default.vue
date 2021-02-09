<template>
    <div class="wrapper">
        <Navigation />
        <div class="container">
            <Nuxt />
        </div>
    </div>
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
.wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.container {
    width: 100%;
    max-width: 1440px;
    padding: 1em;
    display: flex;
    flex-direction: column;
}
.page-title {
    margin: 10px 0;
    font-size: 68px;
    font-weight: 700;
    text-align: center;
}
</style>
