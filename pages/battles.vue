<template>
    <div v-if="battles && !battles.length" class="empty">
        No active battles 😞
    </div>
    <div v-else class="battles">
        <Battle v-for="(battle, index) in battles" :key="index" :battle="battle" />
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types";
import Vue from "vue";
import { Battle } from "~/model/battle";

export default Vue.extend({
    async asyncData (context: Context) {
        context.store.commit("setPageTitle", "Battles");

        const battles = context.$config.battles as Battle[];
        return { battles };
    },
    data () {
        return {
            battles: [] as Battle[]
        };
    },
    mounted () {
        const ws = new WebSocket("ws://localhost:3001");
        ws.onopen = event => console.log("Connected to WebSocket");
        ws.onmessage = (event) => {
            let battles = JSON.parse(event.data) as Battle[];
            const passwordedOrLocked: Battle[] = [];
            battles.forEach((battle, i) => {
                if (battle.passworded || battle.locked) {
                    const battle = battles.splice(i, 1)[0];
                    passwordedOrLocked.unshift(battle);
                }
            });
            battles = battles.sort((a, b) => b.players.length - a.players.length);
            battles.push(...passwordedOrLocked);
            this.battles = battles;
        };
    },
    head: {
        title: "BAR - Battles"
    }
});
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
