export class Pokedex {
    private data: PokedexData

    static readonly EMPTY = new Pokedex(new Map<number, PokemonSpecies>())
    static readonly DEFAULT_POKEMON = {
        pokedexNumber: 1,
        abilities: {
            1: "Overgrow",
            2: null,
            3: "Solar Power"
        },
        baseSpecies: 1,
        evolutions: [2],
        name: "Bulbasaur",
        sprite: "http://bulbasaur.png",
        types: {
            primary: "GRASS",
            secondary: "POISON"
        }
    }

    constructor(pokedexData: PokedexData) {
        this.data = pokedexData
    }

    getAllSpecies(): PokemonSpecies[] {
        return Array.from(this.data.values())
    }

    getSpecies(pokedexNumber: number): PokemonSpecies {
        return this.data.get(pokedexNumber) ?? Pokedex.DEFAULT_POKEMON
    }

    getValidAbilitySlots(pokedexNumber: number): number[] {
        return Object.entries(this.getSpecies(pokedexNumber).abilities)
            .filter((ability, _) => ability[1] !== null)
            .map((ability, _) => parseInt(ability[0]))
    }

    getAbilityName(pokedexNumber: number, abilitySlot: number): string {
        return this.getSpecies(pokedexNumber).abilities[abilitySlot as 1 | 2 | 3] ?? "N/A"
    }

    getEvolutionSpecies(pokedexNumber: number): PokemonSpecies[] {
        return this.getSpecies(pokedexNumber).evolutions.map(evoNumber => this.getSpecies(evoNumber)!!)
    }
}


export type PokedexData = Map<number, PokemonSpecies>

export interface PokemonSpecies {
    pokedexNumber: number
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
