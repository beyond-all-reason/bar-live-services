import { Component, Vue } from "nuxt-property-decorator";

@Component
export class AbstractReplay extends Vue {
    replay!: any;

    get highQualityMapTextureUrl(): string {
        if (this.replay.Map.fileName) {
            return (`${this.$axios.defaults.baseURL}/maps/${this.replay.Map.fileName}/texture-hq.jpg`);
        }
        return require("assets/images/default-minimap.png");
    }

    get lowQualityMapTextureUrl(): string {
        if (this.replay.Map.fileName) {
            return (`${this.$axios.defaults.baseURL}/maps/${this.replay.Map.fileName}/texture-mq.jpg`);
        }
        return require("assets/images/default-minimap.png");
    }

    get mapThumbnailUrl(): string {
        if (this.replay.Map.fileName) {
            return (`${this.$axios.defaults.baseURL}/maps/${this.replay.Map.fileName}/texture-thumb.jpg`);
        }
        return require("assets/images/default-minimap.png");
    }

    get title(): string {
        if (this.replay.AllyTeams.length > 2) {
            const numOfTeams = this.replay.AllyTeams.length;
            return `${numOfTeams} Way FFA`;
        } else if (this.replay.AllyTeams.length === 2) {
            const teamALength = this.replay.AllyTeams[0].Players.length + this.replay.AllyTeams[0].AIs.length;
            const teamBLength = this.replay.AllyTeams[1].Players.length + this.replay.AllyTeams[1].AIs.length;
            return `${teamALength} vs ${teamBLength}`;
        }
        return "Unknown";
    }

    get timeAgo(): string {
        return this.$moment(this.replay.startTime).fromNow();
    }

    get duration(): string {
        return `${this.$moment.duration(this.replay.durationMs).humanize({ m: 9999 })}`;
    }

    get mapName(): string {
        return this.replay.Map.scriptName!.replace(/[_-]/g, " ");
    }

    factionImage(factionStr: string) {
        let faction = "unknown";
        if (factionStr === "Cortex") {
            faction = "cortex";
        } else if (factionStr === "Armada") {
            faction = "armada";
        }
        return require(`assets/images/${faction}_faction.png`);
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
