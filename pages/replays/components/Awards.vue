<template>
    <div>
        <!-- <div class="flex-row flex-center">
            <h2 class="awards-title">Awards</h2>
        </div> -->
        <div class="awards">
            <div class="award-block">
                <div class="trophy-img">
                    <img src="~/assets/images/awards/fuscup.png">
                </div>
                <div class="flex-col">
                    <div class="description">Economy Damage</div>
                    <div class="players">
                        <div v-for="(award, index) in replay.awards.econDestroyed.filter(award => award.teamId != -1)" :key="index" class="player" :style="getColor(award.teamId)">
                            {{ getName(award.teamId) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="award-block">
                <div class="trophy-img">
                    <img src="~/assets/images/awards/bullcup.png">
                </div>
                <div class="flex-col">
                    <div class="description">Unit Damage</div>
                    <div class="players">
                        <div v-for="(award, index) in replay.awards.fightingUnitsDestroyed.filter(award => award.teamId != -1)" :key="index" class="player" :style="getColor(award.teamId)">
                            {{ getName(award.teamId) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="award-block">
                <div class="trophy-img">
                    <img src="~/assets/images/awards/comwreath.png">
                </div>
                <div class="flex-col">
                    <div class="description">Resource Efficiency</div>
                    <div class="players">
                        <div class="player" v-for="(award, index) in replay.awards.resourceEfficiency.filter(award => award.teamId != -1)" :key="index" :style="getColor(award.teamId)">
                            {{ getName(award.teamId) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class ReplayAwards extends Vue {
    @Prop({ type: Object, required: true }) readonly replay!: any;

    playerLookup: { [playerId: number]: { name: string; color: string; } } = {};

    beforeMount() {
        for (const allyTeam of this.replay.AllyTeams) {
            for (const player of allyTeam.Players) {
                this.playerLookup[player.playerId] = {
                    name: player.name,
                    color: `color: rgb(${player.rgbColor.r}, ${player.rgbColor.g}, ${player.rgbColor.b});`,
                };
            }
        }
    }

    getName(playerId: number) : string {
        return this.playerLookup[playerId]?.name ?? "";
    }

    getColor(playerId: number) : string {
        return this.playerLookup[playerId]?.color ?? "#fff";
    }
}
</script>

<style lang="scss" scoped>
.awards-title {
    display: inline-block;
    font-size: clamp(3rem, 6vw, 8rem);
    text-transform: uppercase;
    font-weight: 1000;
    background: rgb(31,255,0);
    background: radial-gradient(circle, rgb(255, 232, 60) 0%, rgb(223, 159, 49) 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent; 
    text-shadow: none;
}
.awards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
.award-block {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
}
.trophy-img {
    height: 100px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    img {
        vertical-align: top;
        max-width: 100%;
        max-height: 100%;
    }
}
.description {
    @extend .text-sm;
    color: #ccc;
}
.players {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.player {
    line-height: 1.3;
    @extend .text-sm;
    &:first-child {
        @extend .text-lg;
        margin: 3px 0;
        &:before {
            content: "🏆";
        }
    }
}
</style>