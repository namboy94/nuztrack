export interface PokedexTO {
    [key: string]: PokemonSpeciesTO
}

export interface PokemonSpeciesTO {
    name: string
    sprite: string
    types: PokemonTypesTO
    abilities: PokemonAbilitiesTO
    baseSpecies: number
    evolutions: number[]
}

export interface PokemonTypesTO {
    primary: string
    secondary: string | null
}

export interface PokemonAbilitiesTO {
    1: string
    2: string | null
    3: string | null
}

export type NaturesTO = string[]
