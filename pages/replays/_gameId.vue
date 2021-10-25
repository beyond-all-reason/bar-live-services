<template>
    <div>
        <h1 class="page-title">
            {{ title }}
        </h1>
        <div class="replay-container">
            <div class="left-col">
                <ReplayMap :replay="replay" />
                <Awards v-if="replay.awards && spoilResults" :replay="replay" />
            </div>
            <div class="right-col">
                <div class="dl-links">
                    <a class="download" :href="`${$config.objectStorageUrl}/demos/${replay.fileName}`">Download</a>
                    <a class="json-api" target="_blank" :href="`${$axios.defaults.baseURL}/replays/${replay.id}`">
                        <v-icon size="22">mdi-code-braces</v-icon>
                    </a>
                </div>
                <table class="meta">
                    <tbody>
                        <tr>
                            <td>Map</td>
                            <td>{{ mapName }}</td>
                        </tr>
                        <tr>
                            <td>Duration</td>
                            <td>{{ duration }}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>{{ $moment(replay.startTime).format("dddd, MMMM Do YYYY") }}</td>
                        </tr>
                        <tr>
                            <td>Time</td>
                            <td>{{ $moment(replay.startTime).format("h:mm:ss A") }}</td>
                        </tr>
                        <tr>
                            <td>Engine</td>
                            <td>{{ replay.engineVersion }}</td>
                        </tr>
                        <tr>
                            <td>Game</td>
                            <td>{{ replay.gameVersion }}</td>
                        </tr>
                        <tr>
                            <td>Ended Normally</td>
                            <td>{{ replay.gameEndedNormally ? "Yes" : "No" }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="spoilers noselect flex-right">
                    <label for="chkSpoilers">Spoil Results</label>
                    <input type="checkbox" id="chkSpoilers" v-model="spoilResults" @change="spoilResultsChanged">
                </div>
                <table class="players">
                    <tbody v-for="(AllyTeam, allyTeamIndex) in replay.AllyTeams" :key="`team-`+allyTeamIndex">
                        <tr>
                            <th class="team-heading" colspan="100%">
                                Team {{ AllyTeam.allyTeamId + 1 }} {{ AllyTeam.winningTeam && spoilResults ? "🏆" : "" }}
                            </th>
                        </tr>
                        <tr v-for="(Player, index) in AllyTeam.Players" :key="`player-`+index">
                            <td><img :src="factionImage(Player.faction)"></td>
                            <td><img :src="countryImage(Player.countryCode)"></td>
                            <td><img :src="rankImage(Player.rank)"></td>
                            <td v-setPlayerColor="Player.rgbColor" class="name">
                                {{ Player.name }}<span v-if="Player.clanId" class="clan-id">{{ Player.clanId }}</span>
                            </td>
                            <td v-show="Player.trueSkillMuBefore && spoilResults" class="trueskill trueskill-before" :style="`color: hsl(0 100% ${uncertaintyPercent(Player.trueSkillSigmaBefore)}%)`">
                                {{ Player.trueSkillMuBefore && Player.trueSkillMuBefore.toFixed(2) }}
                            </td>
                            <td v-show="Player.trueSkillMuBefore && spoilResults">
                                <v-icon size="large" :class="`${Player.trueSkillMuAfter > Player.trueSkillMuBefore ? 'ts-gain' : 'ts-loss'}`">mdi-menu-right</v-icon>
                            </td>
                            <td v-show="Player.trueSkillMuBefore && spoilResults" class="trueskill trueskill-after" :style="`color: hsl(0 100% ${uncertaintyPercent(Player.trueSkillSigmaBefore)}%)`">
                                {{ Player.trueSkillMuBefore && Player.trueSkillMuAfter.toFixed(2) }}
                            </td>
                            <td v-show="Player.trueSkillMuBefore && spoilResults" :class="`trueskill-diff ${Player.trueSkillMuAfter > Player.trueSkillMuBefore ? 'ts-gain' : 'ts-loss'}`">
                                {{ Player.trueSkillMuBefore > Player.trueSkillMuAfter ? '' : '+' }}{{ (Player.trueSkillMuAfter - Player.trueSkillMuBefore).toFixed(2) }}
                            </td>
                            <td v-show="!Player.trueSkillMuBefore || !spoilResults" class="trueskill" :style="`color: hsl(0 100% ${uncertaintyPercent(Player.skillUncertainty)}%)`">
                                {{ Player.trueSkillMuBefore || Player.trueSkill || Player.skill }}
                            </td>
                        </tr>
                        <tr v-for="(AI, index) in AllyTeam.AIs" :key="`ai-`+index">
                            <td><img :src="factionImage(AI.faction)"></td>
                            <td />
                            <td />
                            <td v-setPlayerColor="AI.rgbColor">
                                {{ AI.name }}
                            </td>
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table class="players">
                    <tbody>
                        <tr>
                            <th class="team-heading" colspan="100%">
                                Spectators
                            </th>
                        </tr>
                        <tr v-for="(Spectator, specIndex) in replay.Spectators" :key="`spec-`+specIndex">
                            <td><img :src="countryImage(Spectator.countryCode)"></td>
                            <td><img :src="rankImage(Spectator.rank)"></td>
                            <td>{{ Spectator.name }}</td>
                            <td class="trueskill" :style="`color: hsl(0 100% ${uncertaintyPercent(Spectator.skillUncertainty)}%)`">
                                {{ Spectator.skill }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="options">
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Host Settings</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div v-for="(value, name) in hostSettings" :key="`host-setting-${name}`" class="setting">
                                    <div class="setting-key">
                                        {{ name }}
                                    </div>
                                    <div class="setting-value">
                                        {{ value }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel v-if="spadsSettings">
                            <v-expansion-panel-header>SPADS Settings</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div v-for="(value, name) in spadsSettings" :key="`spads-setting-${name}`" class="setting">
                                    <div class="setting-key">
                                        {{ name }}
                                    </div>
                                    <div class="setting-value">
                                        {{ value }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Game Settings</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div v-for="(value, name) in gameSettings" :key="`game-setting-${name}`" class="setting">
                                    <div class="setting-key">
                                        {{ name }}
                                    </div>
                                    <div class="setting-value">
                                        {{ value }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Map Settings</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div v-for="(value, name) in mapSettings" :key="`map-setting-${name}`" class="setting">
                                    <div class="setting-key">
                                        {{ name }}
                                    </div>
                                    <div class="setting-value">
                                        {{ value }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types";
import { Component } from "nuxt-property-decorator";

import { AbstractReplay } from "~/mixins/AbstractReplay";

@Component({
    head: {
        title: "BAR - Replay"
    },
    directives: {
        setPlayerColor(el, binding) {
            const { r, g, b } = binding.value as { r: number, g: number, b: number };
            const lightness = 0.299 * r + 0.587 * g + 0.114 * b; // https://stackoverflow.com/a/596243/1864403
            el.style.color = `rgba(${r}, ${g}, ${b}, 1)`;
            el.style.textShadow = lightness < 0.1 ? "0 0 3px #fff" : "1px 1px #000";
        }
    }
})
export default class ReplayPage extends AbstractReplay {
    spoilResults = false;

    beforeMount() {
        this.spoilResults = localStorage.getItem("spoilResults") === "true";
    }

    async asyncData({ store, $axios, params, $config }: Context): Promise<any> {
        const replay = await $axios.$get(`replays/${params.gameId}`) as any;
        replay.AllyTeams.forEach((allyTeam: any) => {
            allyTeam.Players = allyTeam.Players.sort((a: any, b: any) => (b.trueSkillMuBefore || b.trueSkill || 0) - (a.trueSkillMuBefore || a.trueSkill || 0));
        });
        replay.Spectators = replay.Spectators.sort((a: any, b: any) => (parseInt(b.skill.replace("~","")) || 0) - (parseInt(a.skill.replace("~","")) || 0));
        const playerColors: { [playerId: number]: { r: number, g: number, b: number } } = {};
        for (const allyTeam of replay.AllyTeams) {
            for (const player of allyTeam.Players) {
                playerColors[player.playerId] = { r: player.rgbColor.r, g: player.rgbColor.g, b: player.rgbColor.b };
            }
        }

        return { replay, playerColors, $config };
    }

    get hostSettings() : { [key: string]: any; } {
        return Object.fromEntries(Object.entries(this.replay.hostSettings).sort());
    }

    get spadsSettings() : { [key: string]: any; } | undefined {
        if (!this.replay.spadsSettings) {
            return;
        }
        return Object.fromEntries(Object.entries(this.replay.spadsSettings).sort());
    }

    get gameSettings() : { [key: string]: any; } {
        return Object.fromEntries(Object.entries(this.replay.gameSettings).sort());
    }

    get mapSettings() : { [key: string]: any; } {
        return Object.fromEntries(Object.entries(this.replay.mapSettings).sort());
    }

    uncertaintyPercent(sigma: number) : number {
        // https://github.com/Yaribz/SLDB/blob/master/ratingEngine.pl#L57
        if (sigma < 1.5) return 100;
        else if (sigma < 2) return 90;
        else if (sigma < 3) return 80;
        else if (sigma < 4) return 70;
        else if (sigma < 5) return 60;
        else return 50;
    }

    spoilResultsChanged() {
        localStorage.setItem("spoilResults", String(this.spoilResults));
    }
}
</script>

<style lang="scss" scoped>
.replay-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    text-shadow: 1px 1px #000;
    @media screen and (max-width: 900px) {
        flex-wrap: wrap;
    }
}
.left-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 55%;
    @media screen and (max-width: 900px) {
        width: 100%;
    }
}
.right-col {
    width: 45%;
    @media screen and (max-width: 900px) {
        width: 100%;
    }
    .meta {
        margin-bottom: 10px;
        td:first-child {
            font-weight: bold;
            line-height: 20px;
        }
    }
}
.players, .meta {
    margin-bottom: 10px;
    border-collapse: collapse;
    th {
        padding-top: 5px;
    }
    td {
        width: 0.1%;
        white-space: nowrap;
        padding: 2px 5px 2px 0;
        font-size: clamp(12px, 1.5vw, 16px);
        &:last-child {
            width: 100%;
            text-align: right;
        }
        &:first-child {
            padding-right: 5px;
        }
        img {
            display: block;
            height: 16px;
        }
    }
    .trueskill-before {
        width: 100%;
    }
}
.meta {
    tr:nth-child(2n+2) {
        background: rgba(255, 255, 255, 0.03);
    }
}
.players {
    tr:nth-child(2) td {
        padding-top: 5px;
    }
    tr:nth-child(2n+3) {
        background: rgba(255, 255, 255, 0.03);
    }
}
hr {
    margin: 16px 0;
}
.dl-links {
    margin-top: 8px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.download {
    padding: 8px 16px;
    border-radius: 20px;
    background-color: #fdc04c;
    transition: .2s;
    color: #000;
    font-size: 16px;
    text-shadow: none;
    &:hover {
        background: white;
        color: #000;
    }
}
.json-api {
    cursor: pointer;
    &:hover .v-icon {
        color: #fff;
    }
    .v-icon{
        all: initial;
        cursor: pointer;
        color: #b4b4b4;
    }
}
.team-heading {
    font-weight: bold;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 3px;
}
.trueskill {
    text-align: right;
    &:after {
        content: "TS";
        font-size: 10px;
        font-weight: 300;
        color: #bbb;
        vertical-align: super;
        margin-left: -3px;
    }
}
.ts-gain {
    color: rgb(138, 255, 60) !important;
}
.ts-loss {
    color: rgb(255, 64, 64) !important;
}
.trueskill-diff {
    font-size: clamp(10px, 1vw, 12px) !important;
    &:before { content: "("; color: rgba(255, 255, 255, 0.8); }
    &:after { content: ")"; color: rgba(255, 255, 255, 0.8); }
}
.clan-id {
    color: rgba(255, 255, 255, 0.6);
    font-size: 9px;
    vertical-align: middle;
    margin-left: 5px;
    font-weight: 300;
    &:before {
        content: "CLAN ";
    }
    &:after {
        content: "";
    }
}
.setting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 2px 0;
    font-size: clamp(10px, 1vw, 12px);
    &:nth-child(odd) {
        background: rgba(255, 255, 255, 0.03);
    }
    &-key {
        width: 50%;
        word-break: break-all;
        display: flex;
        align-items: center;
    }
    &-value {
        width: 50%;
        padding-left: 10px;
        display: flex;
        align-items: center;
    }
}
</style>
