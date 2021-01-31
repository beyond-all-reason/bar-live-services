<template>
    <NuxtLink :to="`/replays/${replay.id}`" class="replay-preview">
        <div class="map-container">
            <div class="map">
                <img :src="mapTextureUrl">
                <div v-if="replay.hostSettings.startpostype==='2'" class="boxes">
                    <div v-for="(AllyTeam, index) in replay.AllyTeams" :key="index" v-startBox="AllyTeam.startBox" class="box" />
                </div>
            </div>
        </div>
        <div class="meta">
            <div class="flex-row flex-space-between">
                <div class="title">
                    {{ title }}
                </div>
                <div class="date">
                    {{ timeAgo }}
                </div>
            </div>
            <div class="flex-row">
                <div class="map-name">
                    {{ replay.Map.scriptName }}
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import { AllyTeam } from "bar-db/dist/model/ally-team";
import { Component, Prop } from "nuxt-property-decorator";

import { AbstractReplay } from "~/mixins/AbstractReplay";
import { ReplayResponse } from "~/model/api/api-response";

@Component({
    directives: {
        startBox (el, binding, vnode) {
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
export default class ReplayPreview extends AbstractReplay {
    @Prop({ type: Object, required: true }) readonly replay!: ReplayResponse;
}
</script>

<style lang="scss" scoped>
.replay-preview {
    width: 250px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    background: #000;
    border: 1px solid #222;
}
.meta {
    padding: 10px;
}
</style>
