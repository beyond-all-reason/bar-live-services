<template>
    <div class="flex-row flex-wrap">
        <div class="map-container">
            <div class="map" >
                <img :src="mapTextureUrl"/>
                <div class="boxes" v-if="replay.hostSettings.startpostype==='2'">
                    <div class="box" v-for="(AllyTeam, index) in replay.AllyTeams" :key="index" v-startBox="AllyTeam.startBox"></div>
                </div>
            </div>
        </div>
        <div class="info">
            <table>
                <tbody>
                    <tr>
                        <td>Duration</td>
                        <td>{{ $moment.duration(replay.durationMs).humanize() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types';
import { AllyTeam } from 'bar-db/dist/model/ally-team';
import { delay } from 'jaz-ts-utils';
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { AbstractReplay } from '~/mixins/AbstractReplay';
import { ReplayResponse } from '~/model/api/api-response';
import { replayTitle } from "~/utils/methods";

@Component({
    head: {
        title: "BAR - Replay"
    },
    directives: {
        startBox(el, binding, vnode) {
            const { top, bottom, left, right } = binding.value as AllyTeam["startBox"];
            const width = Math.abs(right - left);
            const height = Math.abs(top - bottom);
            el.style.top = `${top * 100}%`;
            el.style.left = `${left * 100}%`;
            el.style.width = `${width * 100}%`;
            el.style.height = `${height * 100}%`;
        }
    }
})
export default class Replay extends AbstractReplay {
    async asyncData({ store, $http, params }: Context): Promise<any> {
        const replay = await $http.$get(`replays/${params.gameId}`) as ReplayResponse;
        store.commit("setPageTitle", replayTitle(replay.AllyTeams));
        return { replay };
    }
}
</script>

<style lang="scss" scoped>
.map-container {
    width: 70%;
    @media screen and (orientation: portrait) {
        width: 100%;
    }
}
.info {
    background: red;
    flex-grow: 1;
    margin-left: 20px;
    @media screen and (orientation: portrait) {
        width: 100%;
        margin-left: 0;
        margin-top: 20px;
    }
}
</style>