import { Component, Vue } from "nuxt-property-decorator";

import { AllyTeamResponse, ReplayResponse } from "~/model/api/api-response";

@Component
export class AbstractReplay extends Vue {
    replay!: ReplayResponse;

    get mapTextureUrl (): string {
        if (this.replay.Map.fileName) {
            return `/api/maps/${this.replay.Map.fileName}/texture.png`;
        }
        return require("assets/images/minimapNotFound1.png");
    }

    get title (): string {
        return this.getTitle(this.replay.AllyTeams);
    }

    get timeAgo (): string {
        return this.$moment(this.replay.startTime).fromNow();
    }

    getTitle (allyTeams: AllyTeamResponse[]) : string {
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
}
