import {Event} from "../eventTypes"

export type TeamMemberSwitchEvent = {
    event: Event,
    teamMemberId: number,
    level: number,
    switchType: "ADD" | "REMOVE"
}
