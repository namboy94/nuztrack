import {Event} from "../eventTypes"

export type EvolutionEvent = {
    event: Event,
    teamMemberId: number,
    level: number,
    previousPokedexNumber: number,
    newPokedexNumber: number
}