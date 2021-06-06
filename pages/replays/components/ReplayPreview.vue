<template>
    <NuxtLink :to="`/replays/${replay.id}`" class="replay-preview">
        <div class="map" :style="{backgroundImage: `url(${mapThumbnailUrl})`}" />
        <template v-if="replay.AllyTeams.length > 2">
            <div class="hover-info hover-info--ffa">
                <div class="players">
                    <template v-for="(team, tId) in replay.AllyTeams" >
                        <div v-for="(player, pId) in (team.Players.concat(team.AIs))" class="player" :key="`team-${tId}player-${pId}`">
                            <span v-if="team.winningTeam" class="trophy"><v-icon color="#FFD700">mdi-trophy</v-icon></span>
                            <span>{{ player.name || player.shortName }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="hover-info">
                <div v-for="(team, allyTeamIndex) in replay.AllyTeams" :key="`team-${allyTeamIndex}`" class="team">
                    <div class="team-title">
                        <span>Team {{ allyTeamIndex + 1 }}</span>
                        <span v-if="team.winningTeam" class="trophy"><v-icon color="#FFD700">mdi-trophy</v-icon></span>
                    </div>
                    <div v-for="(player, playerIndex) in (team.Players.concat(team.AIs))" :key="`${replay.id}-${playerIndex}`" class="player">
                        {{ player.name || player.shortName }}
                    </div>
                </div>
            </div>
        </template>
        <div class="meta">
            <div class="times">
                <div class="duration">
                    <v-icon>mdi-clock-time-eight-outline</v-icon>{{ duration }}
                </div>
                <div class="start-time">
                    <v-icon>mdi-calendar-range</v-icon>{{ timeAgo }}
                </div>
            </div>
            <div class="replay-title flex-col flex-center flex-top">
                <div class="type">
                    {{ title }}
                </div>
                <div class="on">
                    on
                </div>
                <div class="map-name">
                    {{ mapName }}
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import { Component, Prop } from "nuxt-property-decorator";

import { AbstractReplay } from "~/mixins/AbstractReplay";
import { ReplayResponse } from "~/model/api/replays";

@Component
export default class ReplayPreview extends AbstractReplay {
    @Prop({ type: Object, required: true }) readonly replay!: ReplayResponse;
}
</script>

<style lang="scss" scoped>
.replay-preview {
    position: relative;
    width: 250px;
    height: 247px;
    margin: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 3px;
    color: #fff;
    text-shadow: 1px 1px #000;
    &:before {
        position: absolute;
        width: calc(100% - 2px);
        height: 100%;
        top: 1px;
        left: 1px;
        content: "";
        background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.0) 100%);
        z-index: 1;
    }
    &:hover {
        .map {
            filter: brightness(80%);
            transform: scale(1.1);
        }
    }
}
.map {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: cover;
    background-position: center center;
    filter: brightness(100%);
    transform: scale(1);
    transition: all .2s;
    border-bottom: 4px solid rgba(0, 0, 0, 0.3);
}
.type, .map-name {
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    text-shadow: 2px 2px #000;
    line-height: 32px;
    text-align: center;
    word-break: break-word;
}
.on {
    text-transform: uppercase;
    font-size: 14px;
    color: #ddd;
}
.meta {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px;
    color: #fff;
    text-shadow: 1px 1px #000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    z-index: 2;
    opacity: 1;
    transition: opacity .2s;
}
.times {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: auto;
    & > div {
        display: flex;
    }
}
.v-icon.v-icon {
    font-size: 13px;
    margin-right: 3px;
}
.hover-info {
    position: absolute;
    width: 100%;
    opacity: 0;
    padding: 10px;
    transition: opacity .2s;
    font-size: 12px;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 7px;
    &--ffa{
        height: 100%;
    }
    .replay-preview:hover & {
        opacity: 1;

        & + .meta {
            opacity: 0;
        }
    }
}
.team {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 2px;
    flex-grow: 0;
    &:first-child{
        text-align: right;
        .team-title {
            width: 100%;
            text-align: right;
            flex-direction: row-reverse;
        }
    }
    &:last-child {
        text-align: left;
        .team-title {
            width: 100%;
            text-align: left;
        }
        &:before {
            content: "";
            width: 1px;
            height: 100%;
            background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0) 100%);
            position: absolute;
            left: -5px;
        }
        &:after {
            content: "";
            width: 1px;
            height: 100%;
            background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.2) 85%, rgba(255,255,255,0) 100%);
            position: absolute;
            left: -4px;
        }
    }
    .player {
        width: 100%;
    }
}
.team-title {
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    .trophy {
        margin: 0 5px;
    }
}
.players {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .player {
        width: 50%;
        text-align: center;
        flex-wrap: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
