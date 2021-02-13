<template>
    <NuxtLink :to="`/replays/${replay.id}`" class="replay-preview">
        <div class="map" :style="{backgroundImage: `url(${mapThumbnailUrl})`}" />
        <div class="map-name">
            {{ mapName }}
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
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import { Component, Prop } from "nuxt-property-decorator";

import { AbstractReplay } from "~/mixins/AbstractReplay";
import { ReplayResponse } from "~/model/api/api-response";

@Component
export default class ReplayPreview extends AbstractReplay {
    @Prop({ type: Object, required: true }) readonly replay!: ReplayResponse;
}
</script>

<style lang="scss" scoped>
.replay-preview {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &:after {
        position: absolute;
        content: "";
        border: 1px solid rgba(255, 255, 255, 0.2);
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    &:hover .map {
        transform: scale(1.1);
    }
}
.map {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center center;
    transform: scale(1);
    transition: transform .2s;
}
.map-name {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    text-shadow: 2px 2px #000;
    line-height: 30px;
}
.meta {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    color: #fff;
    text-shadow: 1px 1px #000;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))
}
</style>
