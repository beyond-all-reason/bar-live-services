import { PlayerStatus } from "sluts";

export interface Player {
    userId: number;
    username: string;
    country: string;
    status?: PlayerStatus;
    battleId?: number;
}
