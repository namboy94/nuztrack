export type Pokedex = Map<number, PokemonSpecies>
export type PokemonSpecies = {
    name: string,
    sprite: string,
    types: PokemonTypes,
    abilities: PokemonAbilities,
    evolutions: number[]
}
export type PokemonTypes = {
    primary: string
    secondary: string | null
}

export type PokemonAbilities = {
    primary: string
    secondary: string | null
    hidden: string | null
}

export type PokemonNatures = string[]