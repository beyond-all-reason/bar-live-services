<template>
    <div>
        <h1 class="page-title">
            Leaderboards
        </h1>
        <div class="disclaimer text-center">
            <p>See <a href="https://www.beyondallreason.info/guide/rating-and-lobby-balance" target="_parent">here</a> to learn about the rating system.</p>
        </div>
        <div class="full-width flex-row">
            <a class="json-api flex-right" target="_blank" :href="`${$axios.defaults.baseURL}/leaderboards`">
                <v-icon size="22">mdi-code-braces</v-icon>
            </a>
        </div>
        <h2>Season {{ seasonId }}</h2>
        <div class="leaderboards">
            <div v-for="(leaderboard, i) in currentLeaderboard" :key="i" class="leaderboard">
                <h2>{{ leaderboard.name }}</h2>
                <div class="leaderboard-row leaderboard-row--header">
                    <div class="leaderboard-row__rank">
                        Rank
                    </div>
                    <div class="leaderboard-row__name">
                        Name
                    </div>
                    <div class="leaderboard-row__trueskill">
                        OpenSkill
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
                        {{ player.rating.toFixed(2) }}
                    </div>
                </div>
            </div>
        </div>
        <h3>Season</h3>
        <v-pagination v-model="seasonId" :length="seasonInfo.length" :total-visible="10" @input="changePage" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { Context } from "@nuxt/types/app";

export type LeaderboardMetaResponse = Array<{
    season: number;
    // eslint-disable-next-line camelcase
    game_types: string[];
}>;

export type LeaderboardResponse = LeaderboardData[];

export type LeaderboardData = {
    name: string;
    players: LeaderboardPlayer[];
};

export type LeaderboardPlayer = {
    id: number;
    name: string;
    rating: number;
};

@Component({
    head: { title: "BAR - Leaderboards" },
    watch: {
        // Watch for changes to the seasonId and update the URL query parameter
        seasonId(newSeasonId) {
            this.$router.push({ query: { ...this.$route.query, season: newSeasonId.toString() } });
        }
    }
})
export default class BalanceChangesPage extends Vue {
    seasonInfo: LeaderboardMetaResponse = [];
    currentLeaderboard: LeaderboardResponse = [];
    seasonId = 0;

    async asyncData({ $axios, query }: Context) {
        const response = await $axios.$get<LeaderboardMetaResponse>(
            "/api/leaderboard",
            { baseURL: "http://localhost:3000" }
        );

        // Get the season from the query parameter or default to the latest season
        const seasonId = query.season ? parseInt(query.season as string, 10) : response[response.length - 1].season;

        // Fetch the leaderboard for the selected season
        const leaderboardResponse = await $axios.$get<LeaderboardResponse>(
            `/api/leaderboard/${seasonId}`,
            { baseURL: "http://localhost:3000" }
        );

        return {
            seasonInfo: response,
            currentLeaderboard: leaderboardResponse,
            seasonId
        };
    }

    async changePage(seasonId: number) {
        this.seasonId = seasonId;
        const apiUrl = `/api/leaderboard/${seasonId}`;
        try {
            const response = await this.$axios.$get<LeaderboardResponse>(apiUrl, { baseURL: "http://localhost:3000" });
            this.currentLeaderboard = response;
        } catch (err) {
            console.error(err);
        }
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
