<template>
    <div>
        <h1 class="page-title">
            Leaderboards
        </h1>
        <div class="leaderboards">
            <div v-for="leaderboard of leaderboards" :key="leaderboard.gameType" class="leaderboard">
                <h2>{{ leaderboard.gameType }}</h2>
                <div class="row row--header">
                    <div class="row__rank">
                        Rank
                    </div>
                    <div class="row__name">
                        Name
                    </div>
                    <div class="row__trueskill">
                        TS
                    </div>
                </div>
                <div v-for="(player, index) in leaderboard.players" :key="index" class="row">
                    <div class="row__rank">
                        {{ index + 1 }}
                    </div>
                    <div class="row__name">
                        {{ player.name }}
                    </div>
                    <div class="row__trueskill">
                        {{ player.trustedSkill.toFixed(2) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types/app";
import { Component, Vue } from "nuxt-property-decorator";
import { SLDBModel } from "sldbts";

@Component
export default class Page extends Vue {
    async asyncData ({ store, $http, params }: Context): Promise<any> {
        const leaderboards = await $http.$get("leaderboards") as SLDBModel.LeaderboardResult[];
        return { leaderboards };
    }
}
</script>

<style lang="scss" scoped>
.leaderboards {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 25px;
    @media screen and (max-width: 900px) {
        flex-wrap: wrap;
    }
}
.leaderboard {
    width: 100%;
    padding: 0 2%;
    padding-bottom: 5px;
}
h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 28px;
    text-transform: uppercase;
}
.row {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    &--header{
        font-size: 12px;
        font-weight: 400;
        background: none;
    }
    &__rank{
        width: 15%;
    }
    &__name{
        width: 65%;
        display: flex;
    }
    &__trueskill{
        width: 20%;
    }
    &:nth-child(odd){
        background: rgba(255, 255, 255, 0.08);
    }
    &:nth-child(3) .row__name {
        &:after{
            margin-left: 5px;
            font-size: 14px;
            content: "🏆";
        }
    }
}
</style>
