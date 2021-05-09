<template>
    <div>
        <h1 class="page-title">
            {{ title }}
        </h1>
        <div class="replay-container">
            <div class="left-col">
                <Map :replay="replay" />
                <!-- <ChatLog v-if="replay.chatlog.length" :chatlog="replay.chatlog.filter(msg => msg.playerId !== 255)" :player-colors="playerColors" /> -->
            </div>
            <div class="right-col">
                <div class="dl-links">
                    <a class="download" :href="`/api/replays/${replay.fileName}`">Download</a>
                    <!-- <a class="api" target="_blank" :href="`/api/replays/${replay.id}`"><v-icon>mdi-code-braces</v-icon></a> -->
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
                <table class="players">
                    <tbody v-for="(AllyTeam, allyTeamIndex) in replay.AllyTeams" :key="`team-`+allyTeamIndex">
                        <tr>
                            <td class="team-heading" colspan="100%">
                                Team {{ AllyTeam.allyTeamId + 1 }} {{ AllyTeam.winningTeam ? "🏆" : "" }}
                            </td>
                        </tr>
                        <tr v-for="(Player, index) in AllyTeam.Players" :key="`player-`+index">
                            <td><img :src="factionImage(Player.faction)"></td>
                            <td><img :src="countryImage(Player.countryCode)"></td>
                            <td><img :src="rankImage(Player.rank)"></td>
                            <td :class="`trueskill uncertainty-${Player.skillUncertainty}`">
                                {{ Player.skill }}
                            </td>
                            <td v-setPlayerColor="Player.rgbColor">
                                {{ Player.name }}
                            </td>
                        </tr>
                        <tr v-for="(AI, index) in AllyTeam.AIs" :key="`ai-`+index">
                            <td><img :src="factionImage(AI.faction)"></td>
                            <td />
                            <td />
                            <td />
                            <td v-setPlayerColor="AI.rgbColor">
                                {{ AI.name }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="players">
                    <tbody>
                        <tr>
                            <td class="team-heading" colspan="100%">
                                Spectators
                            </td>
                        </tr>
                        <tr v-for="(Spectator, specIndex) in replay.Spectators" :key="`spec-`+specIndex">
                            <td><img :src="countryImage(Spectator.countryCode)"></td>
                            <td><img :src="rankImage(Spectator.rank)"></td>
                            <td :class="`trueskill uncertainty-${Spectator.skillUncertainty}`">
                                {{ Spectator.skill }}
                            </td>
                            <td>{{ Spectator.name }}</td>
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
import { ReplayResponse } from "~/model/api/api-response";

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
    async asyncData({ store, $http, params }: Context): Promise<any> {
        const replay = await $http.$get(`replays/${params.gameId}`) as ReplayResponse;
        const playerColors: { [playerId: number]: { r: number, g: number, b: number } } = {};
        for (const allyTeam of replay.AllyTeams) {
            allyTeam.Players = allyTeam.Players.sort((a, b) => Number(b.skill.replace("~", "")) - Number(a.skill.replace("~", "")));
            for (const player of allyTeam.Players) {
                playerColors[player.playerId] = { r: player.rgbColor.r, g: player.rgbColor.g, b: player.rgbColor.b };
            }
        }
        replay.Spectators = replay.Spectators.sort((a, b) => Number(b.skill.replace("~", "")) - Number(a.skill.replace("~", "")));
        return { replay, playerColors };
    }

    get hostSettings() : { [key: string]: string; } {
        return Object.fromEntries(Object.entries(this.replay.hostSettings).sort());
    }

    get gameSettings() : { [key: string]: string; } {
        return Object.fromEntries(Object.entries(this.replay.gameSettings).sort());
    }

    get mapSettings() : { [key: string]: string; } {
        return Object.fromEntries(Object.entries(this.replay.mapSettings).sort());
    }
}
</script>

<style lang="scss" scoped>
.replay-container {
    display: flex;
    flex-direction: row;
    text-shadow: 1px 1px #000;
    @media screen and (max-width: 600px) {
        flex-wrap: wrap;
    }
}
.left-col {
    position: relative;
    width: 55%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 600px) {
        width: 100%;
    }
}
.right-col {
    display: flex;
    flex-direction: column;
    width: 45%;
    margin-left: 20px;
    @media screen and (max-width: 600px) {
        width: 100%;
        margin-left: 0;
        margin-top: 20px;
    }
    .meta {
        margin-bottom: 10px;
        td:first-child {
            font-weight: bold;
            line-height: 20px;
        }
    }
}
table {
    td:first-child {
        padding-right: 5px;
    }
    td:not(:nth-child(1)) {
        padding: 0 5px;
    }
    td:last-child {
        width: 100%;
    }
    td img {
        display: block;
        height: 16px;
    }
}
.players {
    margin-bottom: 10px;
}
hr {
    margin: 16px 0;
}
.dl-links {
    margin-top: 8px;
    margin-bottom: 15px;
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
    .api {
        margin-left: auto;
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
}
.team-heading {
    font-weight: bold;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 3px;
}
.trueskill {
    display: flex;
    justify-content: flex-end;
    &:after {
        content: "TS";
        font-size: 10px;
        font-weight: 300;
        color: #bbb;
        vertical-align: super;
        margin-left: 2px;
    }
    &.uncertainty {
        &-null { color: rgb(255, 255, 255); }
        &-1 { color: rgb(255, 200, 200); }
        &-2 { color: rgb(255, 150, 150); }
        &-3 { color: rgb(255, 100, 100); }
    }
}
.setting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 2px 0;
    font-size: 13px;
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
