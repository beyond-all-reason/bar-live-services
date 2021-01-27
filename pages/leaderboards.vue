<template>
    <div class="leaderboards">
        <div class="leaderboard" v-for="leaderboard of leaderboards" :key="leaderboard.gameType">
            <h2>{{ leaderboard.gameType }}</h2>
            <div class="row row--header">
                <div class="row__rank">Rank</div>
                <div class="row__name">Name</div>
                <div class="row__trueskill">TS</div>
            </div>
            <div class="row" v-for="(player, index) in leaderboard.players" :key="index">
                <div class="row__rank">{{ index + 1 }}</div>
                <div class="row__name">{{ player.name }}</div>
                <div class="row__trueskill">{{ player.trustedSkill.toFixed(2) }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types";
import { SLDBModel } from "sldbts";

export default {
    asyncData (context: Context) {
        context.store.commit("setPageTitle", "Leaderboards");

        const leaderboards = context.$config.leaderboards as SLDBModel.LeaderboardResult[];
        return { leaderboards };
    }
};
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