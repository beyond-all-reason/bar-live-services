<template>
    <div class="battle">
        <div class="battle__background" style="--bg: url(images/maps/unknown.jpg)"></div>
        <div class="battle__background" :style="'--bg: url(images/maps/'+ mapUrl +'.jpg)'"></div>
        <div class="battle__top">
            <div class="battle__ingame">
                <img v-if="battle.founder.status.ingame" src="images/ingame.png">
                <img v-else src="images/battle.png">
            </div>
            <div class="battle__title">{{battle.title}}</div>
            <div v-if="battle.locked || battle.passworded" class="battle__lock">
                <img src="images/lock.png">
            </div>
            <div class="battle__map">{{mapName}}</div>
            <div v-if="playerCount" class="battle__player-count">
                {{playerCount}}
                <img src="images/player.png">
            </div>
            <div v-if="spectatorCount" class="battle__spectator-count">
                {{spectatorCount}}
                <img src="images/spectator.png">
            </div>
        </div>
        <div class="battle__players">
            <div class="battle__player" v-for="player in battle.players" v-bind:key="player.userId">
                <div class="battle__flag">
                    <img v-if="player.country !== '??'" :src="'images/flags/' + player.country.toLowerCase() + '.png'" alt="">
                    <img v-else src="images/flags/unknown.png">
                </div>
                <div class="battle__rank">
                    <img v-if="player.status" :src="'images/ranks/' + (player.status.rank + 1) + '.png'">
                    <img v-else src="images/ranks/1.png">
                </div>
                <div class="battle__username">{{player.username}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Battle } from "../../../common/model/battle";
import { Player } from "../../../common/model/player";

export default Vue.extend({
    props: {
        battle: {
            type: Object
        }
    },
    computed: {
        mapUrl: function() {
            const battle = this.battle as Battle;
            return battle.map.replace(/\s/g, "_").toLowerCase();
        },
        mapName: function() {
            const battle = this.battle as Battle;
            return battle.map.replace(/[\_\-]/g, " ");
        },
        playerCount: function() {
            const battle = this.battle as Battle;
            if (!battle.founder.status?.bot) {
                return battle.players.length - battle.spectators;
            }
            return battle.players.length - (battle.spectators - 1);
        },
        spectatorCount: function() {
            const battle = this.battle as Battle;
            if (!battle.founder.status?.bot) {
                return battle.spectators;
            }
            return battle.spectators - 1;
        }
    }
});
</script>