<template>
    <div>
        <h1 class="page-title">
            {{ mapName }}
        </h1>
        <div class="map-container">
            <div class="preload">
                <img :src="`/api/maps/${this.map.fileName}/texture-hq.jpg`">
                <img :src="`/api/maps/${this.map.fileName}/metal.png`">
                <img :src="`/api/maps/${this.map.fileName}/height.png`">
                <img :src="`/api/maps/${this.map.fileName}/type.png`">
            </div>
            <div class="left-col">
                <div class="maps-view">
                    <v-tabs v-model="tab" >
                        <v-tab>3D</v-tab>
                        <v-tab>Texture</v-tab>
                        <v-tab>Metal</v-tab>
                        <v-tab>Height</v-tab>
                        <v-tab>Type</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                        <v-tab-item class="map-view">
                            <client-only>
                                <Map3D :map="map" />
                            </client-only>
                        </v-tab-item>
                        <v-tab-item class="map-view">
                            <img :src="`/api/maps/${this.map.fileName}/texture-hq.jpg`">
                            <div v-if="map.startPositions" class="start-positions">
                                <div v-for="(startPos, index) in map.startPositions" :key="index" v-startPos="[startPos, map.width, map.height]" class="start-pos">
                                    <div class="start-pos-tooltip">
                                        <span>{{ index }}</span>
                                    </div>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab-item class="map-view">
                            <img :src="`/api/maps/${this.map.fileName}/metal.png`">
                        </v-tab-item>
                        <v-tab-item class="map-view">
                            <img :src="`/api/maps/${this.map.fileName}/height.png`">
                        </v-tab-item>
                        <v-tab-item class="map-view">
                            <img :src="`/api/maps/${this.map.fileName}/type.png`">
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </div>
            <div class="right-col">
                <div class="dl-links">
                    <a class="download" :href="`${$config.objectStorageUrl}/maps/${map.fileName}`">Download</a>
                    <a class="json-api" target="_blank" :href="`/api/maps/${map.id}`">
                        <v-icon size="22">mdi-code-braces</v-icon>
                    </a>
                </div>
                <table class="meta">
                    <tbody>
                        <tr>
                            <td>Description</td>
                            <td>{{ map.description }}</td>
                        </tr>
                        <tr>
                            <td>Author</td>
                            <td>{{ map.author }}</td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td>{{ map.version }}</td>
                        </tr>
                        <tr>
                            <td>Size</td>
                            <td>{{ map.width }} x {{ map.height }}</td>
                        </tr>
                        <tr>
                            <td>Wind</td>
                            <td>{{ map.minWind }} - {{ map.maxWind }}</td>
                        </tr>
                        <tr>
                            <td>Tidal</td>
                            <td>{{ map.tidalStrength }}</td>
                        </tr>
                        <tr>
                            <td>Gravity</td>
                            <td>{{ map.gravity }}</td>
                        </tr>
                        <tr>
                            <td>Depth</td>
                            <td>{{ map.minDepth }} - {{ map.maxDepth }}</td>
                        </tr>
                        <tr>
                            <td>Hardness</td>
                            <td>{{ map.mapHardness }}</td>
                        </tr>
                        <tr>
                            <td>Start Positions</td>
                            <td>{{ map.startPositions.length }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types";
import { Component, Vue } from "nuxt-property-decorator";

import { MapResponse } from "~/model/api/maps";

@Component({
    head: { title: "BAR - Map" },
    directives: {
        startPos(el, binding) {
            const { x, z } = binding.value[0] as { x: number, z: number };
            const mapWidthElmos = binding.value[1] * 512 as number;
            const mapHeightElmos = binding.value[2] * 512 as number;
            const left = x / mapWidthElmos;
            const top = z / mapHeightElmos;
            el.style.left = `${left * 100}%`;
            el.style.top = `${top * 100}%`;
        },
    }
})
export default class ReplayPage extends Vue {
    map!: MapResponse;
    tab: number | null = null;

    async asyncData({ store, $http, params, $config }: Context): Promise<any> {
        const map = await $http.$get(`maps/${params.mapId}`) as MapResponse;

        return { map, $config };
    }

    get mapName(): string {
        return this.map.scriptName!.replace(/[_-]/g, " ");
    }
}
</script>

<style lang="scss" scoped>
.map-container {
    display: flex;
    flex-direction: row;
    text-shadow: 1px 1px #000;
    @media screen and (max-width: 600px) {
        flex-wrap: wrap;
    }
}
.left-col {
    position: relative;
    width: 55%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 600px) {
        width: 100%;
    }
}
.right-col {
    display: flex;
    flex-direction: column;
    width: 45%;
    margin-left: 20px;
    @media screen and (max-width: 600px) {
        width: 100%;
        margin-left: 0;
        margin-top: 20px;
    }
    .meta {
        margin-bottom: 10px;
        td:first-child {
            font-weight: bold;
            line-height: 20px;
        }
    }
}
.map-view{
    position: relative;
    width: 100%;
    img {
        width: 100%;
        max-width: 100%;
        vertical-align: top;
    }
}
table {
    td:first-child {
        padding-right: 5px;
    }
    td:not(:nth-child(1)) {
        padding: 0 5px;
    }
    td:last-child {
        width: 100%;
    }
    td img {
        display: block;
        height: 16px;
    }
}
hr {
    margin: 16px 0;
}
.dl-links {
    margin-top: 8px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.download {
    padding: 8px 16px;
    border-radius: 20px;
    background-color: #fdc04c;
    transition: .2s;
    color: #000;
    font-size: 16px;
    text-shadow: none;
    &:hover {
        background: white;
        color: #000;
    }
}
.json-api {
    cursor: pointer;
    &:hover .v-icon {
        color: #fff;
    }
    .v-icon{
        all: initial;
        cursor: pointer;
        color: #b4b4b4;
    }
}
.start-positions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}
.start-pos {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 14px;
    border: 1px solid hsl(0deg 0% 0% / 53%);
    box-shadow: 1px 1px rgb(0 0 0 / 43%);
    transform: translateX(-6px) translateY(-6px);
    background-color: rgba(255, 255, 255, .6);
    &-tooltip {
        position: absolute;
        transform: translateX(-50%);
        left: 6px;
        bottom: 13px;
        font-size: 14px;
        .left &, .right & {
            bottom: -4px;
            transform: none;
        }
        .left & {
            left: 16px;
        }
        .right & {
            right: 16px;
            left: initial;
        }
    }
}
</style>