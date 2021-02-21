<template>
    <NuxtLink :to="`/replays/${replay.id}`" class="replay-preview">
        <div class="map" :style="{backgroundImage: `url(${mapThumbnailUrl})`}" />
        <!-- <div class="map-name">
            {{ mapName }}
        </div> -->
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
    height: 247px;
    margin: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border-radius: 3px;
    &:hover {
        .map {
            filter: brightness(120%);
            border-bottom: 1px solid rgba(0, 0, 0, 0.3);
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
    transition: filter .2s;
    border-bottom: 4px solid rgba(0, 0, 0, 0.3);
    z-index: -1;
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
</style>
