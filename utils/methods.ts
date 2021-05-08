import { AllyTeamResponse } from "~/model/api/api-response";

export function replayTitle(allyTeams: AllyTeamResponse[]) : string {
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
