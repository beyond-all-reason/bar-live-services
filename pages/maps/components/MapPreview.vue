<template>
    <NuxtLink :to="`/maps/${map.fileName}`" class="map-preview">
        <div class="map" :style="{backgroundImage: `url('${mapThumbnailUrl}')`}" />
        <div class="meta">
            <div class="times">
                <div class="duration">
                    <!-- <v-icon>mdi-clock-time-eight-outline</v-icon>{{ duration }} -->
                </div>
                <div class="start-time">
                    <!-- <v-icon>mdi-calendar-range</v-icon>{{ timeAgo }} -->
                </div>
            </div>
            <div class="map-title flex-col flex-center flex-top">
                <div class="map-name">
                    {{ mapName }}
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class MapPreview extends Vue {
    @Prop({ type: Object, required: true }) readonly map!: any;

    get mapThumbnailUrl(): string {
        if (this.map.fileName) {
            return (`${this.$axios.defaults.baseURL}/maps/${this.map.fileName}/texture-thumb.jpg`);
        }
        return require("assets/images/default-minimap.png");
    }

    get mapName(): string {
        return this.map.scriptName!.replace(/[_-]/g, " ");
    }
}
</script>

<style lang="scss" scoped>
.map-preview {
    position: relative;
    width: 250px;
    height: 247px;
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
</style>
