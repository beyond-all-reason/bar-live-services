<template>
    <div class="battle">
        <div class="background" :style="{backgroundImage: `url(${mapUrl})`}" />
        <div class="top">
            <div class="ingame">
                <img v-if="battle.founder.status.ingame" src="~/assets/images/ingame.png">
                <img v-else src="~/assets/images/battle.png">
            </div>
            <div class="title">
                {{ battle.title }}
            </div>
            <div v-if="battle.locked || battle.passworded" class="lock">
                <img src="~/assets/images/lock.png">
            </div>
            <div class="map">
                {{ mapName }}
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
        <div class="players">
            <div v-for="(player, index) in battle.players" :key="index" class="player">
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
import { Battle } from "~/model/battle";

@Component
export default class BattleComponent extends Vue {
    @Prop({ type: Object, required: true }) readonly battle!: Battle;

    get mapUrl () : string {
        if (this.battle.mapFileName) {
            return `/api/maps/${this.battle.mapFileName}/texture-lq.jpg`;
        }
        return require("assets/images/default-minimap.png");
    }

    get mapName () : string {
        return this.battle.map.replace(/[_-]/g, " ");
    }

    get playerCount () : number {
        if (!this.battle.founder.status?.bot) {
            return this.battle.players.length - this.battle.spectators;
        }
        return this.battle.players.length - (this.battle.spectators - 1);
    }

    get spectatorCount () : number {
        if (!this.battle.founder.status?.bot) {
            return this.battle.spectators;
        }
        return this.battle.spectators - 1;
    }

    countryImage (countryCode: string) {
        return require(`../node_modules/flag-icon-css/flags/4x3/${countryCode}.svg`);
    }
}
</script>

<style lang="scss" scoped>
.battle {
    @media screen and (max-width: 900px) {
        width: 100%;
        margin: 10px 0;
    }
    position: relative;
    width: calc(50% - 20px);
    margin: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
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
    z-index: -1;
    border-bottom: 4px solid rgba(0, 0, 0, 0.3);
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
}
.top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 1px;
    padding: 4px;
    font-size: 16px;
}
.ingame{
    display: flex;
    align-items: center;
    margin-right: 5px;
    img {
        max-height: 32px;
    }
}
.title{
    text-align: left;
}
.map{
    flex-grow: 1;
    text-align: center;
    padding: 0 10px;
}
.lock{
    display: flex;
    align-items: center;
    margin-left: 5px;
    img {
        max-height: 16px;
    }
}
.player-count{
    display: flex;
    align-items: center;
    margin-right: 8px;
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
.max-players{
    margin-left: 5px;
}
.players{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 12px 4px 4px 5px;
    justify-content: left;
    align-items: flex-start;
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
