import { Component, Vue } from "nuxt-property-decorator";

import { AllyTeamResponse, ReplayResponse } from "~/model/api/api-response";
@Component
export class AbstractReplay extends Vue {
    replay!: ReplayResponse;

    get highQualityMapTextureUrl(): string {
        if (this.replay.Map.fileName) {
            return `/api/maps/${this.replay.Map.fileName}/texture-hq.png`;
        }
        return require("assets/images/default-minimap.png");
    }

    get lowQualityMapTextureUrl(): string {
        if (this.replay.Map.fileName) {
            return `/api/maps/${this.replay.Map.fileName}/texture-mq.jpg`;
        }
        return require("assets/images/default-minimap.png");
    }

    get mapThumbnailUrl(): string {
        if (this.replay.Map.fileName) {
            return `/api/maps/${this.replay.Map.fileName}/texture-thumb.jpg`;
        }
        return require("assets/images/default-minimap.png");
    }

    get title(): string {
        return this.getTitle(this.replay.AllyTeams);
    }

    get timeAgo(): string {
        return this.$moment(this.replay.startTime).fromNow();
    }

    get duration(): string {
        return `${this.$moment.duration(this.replay.durationMs).humanize({ m: 9999 })}`;
    }

    get mapName(): string {
        return this.replay.Map.scriptName!.replace(/_/g, " ");
    }

    getTitle(allyTeams: AllyTeamResponse[]) : string {
        if (allyTeams.length > 2) {
            const numOfTeams = allyTeams.length;
            return `${numOfTeams} Way FFA`;
        } else if (allyTeams.length === 2) {
            const teamALength = allyTeams[0].Players.length + allyTeams[0].AIs.length;
            const teamBLength = allyTeams[1].Players.length + allyTeams[1].AIs.length;
            return `${teamALength} vs ${teamBLength}`;
        }
        return "Unknown";
    }

    factionImage(factionStr: string) {
        const faction = /arm/i.test(factionStr) ? "armada" : "cortex";
        return require(`assets/images/${faction}_default.png`);
    }

    countryImage(countryCode: string) {
        if (countryCode === "??") {
            return "";
        }
        return require(`~/node_modules/flag-icon-css/flags/4x3/${countryCode.toLowerCase()}.svg`);
    }

    rankImage(rank: number) {
        return require(`assets/images/ranks/${rank + 1}.svg`);
    }
}
