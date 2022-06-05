import {Event} from "../eventTypes"

export type CreateEncounterEvent = {
    location: string,
    pokedexNumber: number,
    level: number,
    gender: string,
    caught: boolean,
    pokemon: CreateEncounterPokemon | null
}
export type CreateEncounterPokemon = {
    nickname: string,
    nature: string,
    abilitySlot: number
}
export type EncounterEvent = {
    event: Event,
    pokedexNumber: number,
    level: number,
    gender: string,
    caught: boolean,
    teamMemberId: number | null
}
