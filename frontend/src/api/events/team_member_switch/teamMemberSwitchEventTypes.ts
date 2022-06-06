import {Event} from "../eventTypes"

export type TeamMemberSwitchEvent = {
    event: Event,
    teamMemberId: number,
    level: number,
    switchType: "ADD" | "REMOVE"
}

export type CreateTeamMemberSwitchEvent = {
    location: string,
    teamMemberId: number,
    switchType: "ADD" | "REMOVE"
}