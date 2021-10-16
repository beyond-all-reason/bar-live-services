<template>
    <div class="map">
        <img :src="mapTextureUrl">
        <div v-if="replay.hostSettings.startpostype==='2'" class="boxes">
            <div v-for="(AllyTeam, index) in replay.AllyTeams" :key="index" v-startBox="AllyTeam.startBox" class="box" />
        </div>
        <div v-if="replay.Map.width" class="start-positions">
            <div v-for="(PlayerOrAI, index) in playersAndAi.filter(p => p.startPos)" :key="index" v-startPos="[PlayerOrAI.startPos, mapWidthElmos, mapHeightElmos]" v-setPlayerColor="PlayerOrAI.rgbColor" class="start-pos">
                <div class="start-pos-tooltip">
                    <span>{{ PlayerOrAI.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { AI } from "bar-db/dist/model/ai";
import { AllyTeam } from "bar-db/dist/model/ally-team";
import { Player } from "bar-db/dist/model/player";
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({
    directives: {
        startBox(el, binding) {
            if (binding.value === null) {
                return;
            }
            const { top, bottom, left, right } = binding.value as AllyTeam["startBox"];
            const width = Math.abs(right - left);
            const height = Math.abs(top - bottom);
            el.style.top = `${top * 100}%`;
            el.style.left = `${left * 100}%`;
            el.style.width = `${width * 100}%`;
            el.style.height = `${height * 100}%`;
        },
        startPos(el, binding) {
            const { x, z } = binding.value[0] as { x: number, z: number };
            const mapWidthElmos = binding.value[1] as number;
            const mapHeightElmos = binding.value[2] as number;
            const left = x / mapWidthElmos;
            const top = z / mapHeightElmos;
            el.style.left = `${left * 100}%`;
            el.style.top = `${top * 100}%`;
            if (left < 0.2) { el.classList.add("left"); }
            if (left > 0.8) { el.classList.add("right"); }
        },
        setPlayerColor(el, binding) {
            const { r, g, b } = binding.value as { r: number, g: number, b: number };
            const lightness = 0.299 * r + 0.587 * g + 0.114 * b; // https://stackoverflow.com/a/596243/1864403
            el.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 1)`;
            el.style.color = `rgba(${r}, ${g}, ${b}, 1)`;
            el.style.textShadow = lightness < 0.1 ? "0 0 3px #fff" : "1px 1px #000";
        }
    }
})
export default class MapComponent extends Vue {
    @Prop({ type: Object, required: true }) readonly replay!: any;

    mapWidthElmos = this.replay.Map.width ? this.replay.Map.width * 512 : null;
    mapHeightElmos = this.replay.Map.height ? this.replay.Map.height * 512 : null;

    get mapTextureUrl(): string {
        if (this.replay.Map.fileName) {
            return `/api/maps/${this.replay.Map.fileName}/texture-mq.jpg`;
        }
        return require("assets/images/default-minimap.png");
    }

    get playersAndAi() : Array<Player | AI> {
        return this.replay.AllyTeams.flatMap((allyTeam: any) => [...allyTeam.AIs, ...allyTeam.Players]);
    }

    factionImage(factionStr: string) {
        const faction = /arm/i.test(factionStr) ? "armada" : "cortex";
        return require(`assets/images/${faction}_default.png`);
    }
}
</script>

<style lang="scss" scoped>
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
        image-rendering: pixelated;
    }
}
.boxes {
    position: absolute;
    width: 100%;
    height: 100%;
}
.box {
    position: absolute;
    background: rgba(194, 10, 10, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    &:nth-child(1){
        background: rgba(23, 202, 32, 0.3);
    }
}
.start-positions {
    position: absolute;
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
