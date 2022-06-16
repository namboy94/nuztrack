export class Pokedex {
    private data: PokedexData

    constructor(pokedexData: PokedexData) {
        this.data = pokedexData
    }
}


export type PokedexData = Map<number, PokemonSpecies>

export interface PokemonSpecies {
    name: string
    sprite: string
    types: PokemonTypes
    abilities: PokemonAbilities
    baseSpecies: number
    evolutions: number[]
}

export interface PokemonTypes {
    primary: string
    secondary: string | null
}

export interface PokemonAbilities {
    1: string
    2: string | null
    3: string | null
}

export type Natures = string[]
