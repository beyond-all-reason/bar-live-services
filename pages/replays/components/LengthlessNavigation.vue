<template>
    <div>
        <v-btn class="nav-button" @click="page = 1">
            <v-icon>mdi-chevron-double-left</v-icon>
        </v-btn>
        <v-btn class="nav-button" @click="page = page > 1 ? page - 1 : page">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn class="page-info" @click="page = page">
            {{page}}
        </v-btn>
        <v-btn class="nav-button" @click="page = page + 1">
            <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
    </div>
</template>

<script lang="ts">
import { Component, VModel, Vue } from "nuxt-property-decorator";

@Component
export default class LengthlessNavigation extends Vue {
    @VModel({ type: Number, required: true }) page!: number;
}
</script>

<style lang="scss" scoped>
.v-btn {
    height: 32px !important;
    min-width: 32px !important;
    margin: 0 1px !important;
}

.nav-button {
    padding: 0 !important;
}

.page-info {
    margin: 0 8px !important;
    padding: 0 5px !important;
}

</style>
