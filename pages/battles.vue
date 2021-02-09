<template>
    <div>
        <h1 class="page-title">
            Battles
        </h1>
        <div v-if="battles && !battles.length" class="empty">
            No active battles 😞
        </div>
        <div v-else class="battles">
            <Battle v-for="(battle, index) in battles" :key="index" :battle="battle" />
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types/app";
import { Component, Vue } from "nuxt-property-decorator";

import { Battle } from "~/model/battle";

@Component({
    head: { title: "BAR - Battles" }
})
export default class Page extends Vue {
    battles: Battle[] = [];
    pollInterval = 0;

    async asyncData ({ $http }: Context): Promise<any> {
        const battles = await $http.$get("battles") as Battle[];
        return { battles };
    }

    async fetch () {
        try {
            this.battles = await this.$http.$get("battles") as Battle[];
        } catch (err) {

        }
    }

    mounted () {
        this.pollInterval = window.setInterval(async () => {
            this.$fetch();
        }, 3000);
    }

    beforeDestroy () {
        window.clearInterval(this.pollInterval);
    }

    // mounted () {
    //     const ws = new WebSocket("ws://localhost:3001");
    //     ws.onopen = event => console.log("Connected to WebSocket");
    //     ws.onmessage = (event) => {
    //         let battles = JSON.parse(event.data) as Battle[];
    //         const passwordedOrLocked: Battle[] = [];
    //         battles.forEach((battle, i) => {
    //             if (battle.passworded || battle.locked) {
    //                 const battle = battles.splice(i, 1)[0];
    //                 passwordedOrLocked.unshift(battle);
    //             }
    //         });
    //         battles = battles.sort((a, b) => b.players.length - a.players.length);
    //         battles.push(...passwordedOrLocked);
    //         this.battles = battles;
    //     };
    // },
}
</script>

<style lang="scss" scoped>
.empty {
    margin-top: 30px;
    font-size: 4vw;
    font-weight: 200;
    text-align: center;
}
.battles {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
