import {Event} from "../eventTypes"

export type DeathEvent = {
    event: Event,
    teamMemberId: number,
    level: number,
    opponent: string,
    description: string
}

export type CreateDeathEvent = {
    location: string,
    teamMemberId: number,
    level: number,
    opponent: string,
    description: string
}