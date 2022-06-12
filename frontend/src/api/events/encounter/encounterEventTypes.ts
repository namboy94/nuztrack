import {Event} from "../eventTypes"

export type CreateEncounterEvent = {
    location: string,
    pokedexNumber: number,
    level: number,
    caught: boolean,
    pokemon: CreateEncounterPokemon | null
}
export type CreateEncounterPokemon = {
    nickname: string,
    gender: string | null,
    nature: string | null,
    abilitySlot: number | null
}
export type EncounterEvent = {
    event: Event,
    pokedexNumber: number,
    level: number,
    caught: boolean,
    teamMemberId: number | null
}
