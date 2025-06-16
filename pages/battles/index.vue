<template>
    <div>
        <h1 class="page-title">
            Battles
        </h1>

        <!-- <div class="full-width flex-row">
            <a class="json-api flex-right" target="_blank" :href="`${$axios.defaults.baseURL}/battles`">
                <v-icon size="22">mdi-code-braces</v-icon>
            </a>
        </div> -->

        <template v-if="battles && !battles.length">
            <div class="empty">
                No active battles 😞
            </div>
        </template>
        <template v-else>
            <div class="flex-row players-online">
                <div class="flex-left" />
                <div>
                    There are currently <span class="player-count">{{ numOfPlayers }}</span> players in online battles.
                </div>
            </div>
            <div class="battles">
                <Battle v-for="(battle, index) in battles" :key="index" :battle="battle" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types/app";
import { Component, Vue } from "nuxt-property-decorator";

@Component({
    head: { title: "BAR - Battles" }
})
export default class Page extends Vue {
    battles: any[] = [];
    pollInterval = 0;
    numOfPlayers = 0;

    async asyncData({ $axios }: Context) {
        const battles = (await $axios.$get("battles") as any[]) ?? [];
        const numOfPlayers = battles.reduce((total, battle) => total + battle.players.length, 0);
        return { battles, numOfPlayers };
    }

    async fetchBattles() {
        try {
            const battles = await this.$axios.$get("battles") as any[];
            const numOfPlayers = battles.reduce((total, battle) => total + battle.players.length, 0);

            if (Array.isArray(battles)) {
                this.battles = battles;
                this.numOfPlayers = numOfPlayers;
            }
        } catch (err) {
            console.log(err);
        }
    }

    mounted() {
        this.pollInterval = window.setInterval(async() => {
            this.fetchBattles();
        }, 3000);

        this.fetchBattles();
    }

    beforeDestroy() {
        window.clearInterval(this.pollInterval);
    }
}
</script>

<style lang="scss" scoped>
.empty {
    margin-top: 30px;
    font-size: 4vw;
    font-weight: 200;
    text-align: center;
}
.players-online {
    margin-bottom: 5px;
    text-align: center;
    .player-count {
        font-weight: 600;
    }
}
.battles {
    width: 100%;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}
</style>
