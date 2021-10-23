<template>
    <div>
        <h1 class="page-title">
            Leaderboards
        </h1>
        <div class="disclaimer text-center">
            <p>The TrueSkill values shown on this page are <em>Trusted</em>, as opposed to <em>Estimated</em>. It is calculated by <strong>Estimated Skill - (3 * Uncertainty)</strong>. See <a href="https://springrts.com/phpbb/viewtopic.php?p=536862#p536862" target="_blank">here</a> for more info.</p>
        </div>
        <div class="full-width flex-row">
            <a class="json-api flex-right" target="_blank" :href="`${$axios.defaults.baseURL}/battles`">
                <v-icon size="22">mdi-code-braces</v-icon>
            </a>
        </div>
        <div class="leaderboards">
            <div v-for="leaderboard of leaderboards" :key="leaderboard.gameType" class="leaderboard">
                <h2>{{ leaderboard.gameType }}</h2>
                <div class="leaderboard-row leaderboard-row--header">
                    <div class="leaderboard-row__rank">
                        Rank
                    </div>
                    <div class="leaderboard-row__name">
                        Name
                    </div>
                    <div class="leaderboard-row__trueskill">
                        TrueSkill
                    </div>
                </div>
                <div v-for="(player, index) in leaderboard.players" :key="index" class="leaderboard-row">
                    <div class="leaderboard-row__rank">
                        {{ index + 1 }}
                    </div>
                    <div class="leaderboard-row__name">
                        {{ player.name }}
                    </div>
                    <div class="leaderboard-row__trueskill">
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

@Component({
    head: { title: "BAR - Leaderboards" }
})
export default class Page extends Vue {
    async asyncData({ store, $axios, params }: Context): Promise<any> {
        const leaderboards = await $axios.$get("leaderboards") as any;
        return { leaderboards };
    }
}
</script>

<style lang="scss" scoped>
.leaderboards {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
    @media screen and (max-width: 900px) {
        flex-wrap: wrap;
    }
}
.leaderboard {
    width: 100%;
    padding-bottom: 5px;
}
h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 28px;
    text-transform: uppercase;
}
.leaderboard-row {
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
    &:nth-child(3) .leaderboard-row__name {
        &:after{
            margin-left: 5px;
            font-size: 14px;
            content: "🏆";
        }
    }
}
.disclaimer {
    a {
        text-decoration: underline;
    }
}
</style>
