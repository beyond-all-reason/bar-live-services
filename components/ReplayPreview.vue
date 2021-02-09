<template>
    <NuxtLink :to="`/replays/${replay.id}`" class="replay-preview">
        <div class="map-container">
            <div class="map">
                <img :src="mapTextureUrl">
                <div class="map-name">
                    {{ mapName }}
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
    margin: 15px;
    display: flex;
    flex-direction: column;
    background: #090909;
}
.map-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.map {
    position: relative;
    object-fit: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
        max-height: 100%;
        max-width: 100%;
    }
    img {
        transition: transform .2s ease-in-out;
        .replay-preview:hover & {
            transform: scale(1.1);
        }
    }
    &:after {
        position: absolute;
        content: "";
        border: 1px solid rgba(255, 255, 255, 0.15);
        width: 100%;
        height: 100%;
        z-index: 1;
    }
}
.map-name {
    position: absolute;
    width: 80%;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    text-shadow: 2px 2px rgba(0, 0, 0, 0.5);
}
.meta {
    padding: 10px;
    border-bottom: 1px solid #000;
}
</style>
