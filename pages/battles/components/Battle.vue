<template>
    <div class="battle">
        <div class="background" :style="{backgroundImage: `url(${mapUrl})`}" />
        <div class="top">
            <div class="ingame">
                <img v-if="battle.founder.status.ingame" src="~/assets/images/ingame.png">
                <img v-else src="~/assets/images/battle.png">
            </div>
            <div class="battle-title">
                {{ battle.title }}
            </div>
            <div v-if="battle.locked || battle.passworded" class="lock">
                <img src="~/assets/images/lock.png">
            </div>
            <div class="map-gametime">
                <div class="map">{{ mapName }}</div>
                <div class="gametime" v-if="battle.lobbyStatus === 'running'">Running for {{ runTime }} minutes</div>
            </div>
            <div v-if="playerCount" class="player-count">
                {{ playerCount }}
                <img src="~/assets/images/player.png">
            </div>
            <div v-if="spectatorCount" class="spectator-count">
                {{ spectatorCount }}
                <img src="~/assets/images/spectator.png">
            </div>
        </div>
        <div class="players" v-if="players.length">
            <div class="heading">Players</div>
            <div v-for="(player, index) in players" :key="index" class="player">
                <div v-if="player.country !== '??'" class="flag">
                    <img :src="countryImage(player.country.toLowerCase())" alt="">
                </div>
                <div class="rank">
                    <img v-if="player.status" :src="require(`~/assets/images/ranks/${player.status.rank + 1}.svg`)">
                    <img v-else src="~/assets/images/ranks/1.svg">
                </div>
                <div class="username">
                    {{ player.username }}
                </div>
            </div>
        </div>
        <div class="players" v-if="spectators.length">
            <div class="heading">Spectators</div>
            <div v-for="(player, index) in spectators" :key="index" class="player">
                <div v-if="player.country !== '??'" class="flag">
                    <img :src="countryImage(player.country.toLowerCase())" alt="">
                </div>
                <div class="rank">
                    <img v-if="player.status" :src="require(`~/assets/images/ranks/${player.status.rank + 1}.svg`)">
                    <img v-else src="~/assets/images/ranks/1.svg">
                </div>
                <div class="username">
                    {{ player.username }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";


@Component
export default class BattleComponent extends Vue {
    @Prop({ type: Object, required: true }) readonly battle!: any;

    get mapUrl() : string {
        if (this.battle.mapFileName) {
            return `/api/maps/${this.battle.mapFileName}/texture-mq.jpg`;
        }
        return require("assets/images/default-minimap.png");
    }

    get mapName() : string {
        return this.battle.map.replace(/[_-]/g, " ");
    }

    get playerCount() : number {
        return this.players.length;
    }

    get spectatorCount() : number {
        return this.spectators.length;
    }

    get battleStarted() : boolean {
        return this.battle.founder.status?.ingame === true;
    }

    get players() : any[] {
        if (this.battleStarted) {
            return this.battle.players.filter((player: any) => player.gameStatus === "Playing" || player.gameStatus === "Waiting" || player.gameReady === "Placed");
        }
        return this.battle.players.filter((player: any) => player.lobbyReady);
    }

    get spectators() : any[] {
        return this.battle.players.filter((player: any) => !this.players.includes(player));
    }

    get runTime() : string {
        return ((this.battle?.gameTime ?? 0) / 60).toFixed(0);
    }

    countryImage(countryCode: string) {
        return require(`~/node_modules/flag-icon-css/flags/4x3/${countryCode}.svg`);
    }
}
</script>

<style lang="scss" scoped>
.battle {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 3px;
    padding: 0 5px 10px 5px;
    color: #fff;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.5);
}
.background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-position: center;
    background-size: cover;
    box-shadow: inset 0px -4px 0px 0px rgb(0 0 0 / 30%);
    image-rendering: pixelated;
    z-index: 0;
    &:before {
        position: absolute;
        width: calc(100% - 2px);
        height: 100%;
        top: 1px;
        left: 1px;
        content: "";
        z-index: -1;
        background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.0) 100%);
    }
    &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.15);
    }
}
.top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 1px;
    padding: 4px;
    font-size: 16px;
    z-index: 1;
    column-gap: 5px;
}
.ingame{
    display: flex;
    align-items: center;
    img {
        max-height: 32px;
    }
}
.battle-title{
    text-align: left;
}
.map-gametime {
    display: flex;
    flex-grow: 1;
    text-align: center;
    flex-direction: column;
}
.gametime {
    background: red;
    height: 0;
    font-size: 11px;
    margin-top: -3px;
}
.lock{
    display: flex;
    align-items: center;
    img {
        max-height: 16px;
    }
}
.player-count{
    display: flex;
    align-items: center;
    img {
        margin-left: 3px;
        max-height: 18px;
    }
}
.spectator-count{
    display: flex;
    align-items: center;
    img {
        margin-left: 3px;
        max-height: 18px;
    }
}
.players{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    align-items: flex-start;
    z-index: 1;
}
.heading {
    position: relative;
    width: 100%;
    font-size: 13px;
    margin-left: 5px;
    margin-bottom: 2px;
}
.player{
    background: rgba(0, 0, 0, 0.59);
    display: flex;
    align-items: center;
    margin: 2px;
    padding: 4px 6px;
    border-radius: 3px;
    & > div {
        margin: 0 2px;
    }
}
.flag{
    display: flex;
    img {
        height: 12px;
    }
}
.username{
    font-size: 13px;
}
.rank{
    display: flex;
    img {
        max-height: 16px;
    }
}
</style>
