export type Pokedex = Map<number, PokemonSpecies>
export type PokemonSpecies = {
    name: string,
    sprite: string,
    types: PokemonTypes,
    abilities: Map<number, string | null>,
    baseSpecies: number,
    evolutions: number[]
}
export type PokemonTypes = {
    primary: string
    secondary: string | null
}
export type PokemonNatures = string[]

export type PokemonSpeciesTO = {
    name: string,
    sprite: string,
    types: PokemonTypes,
    abilities: PokemonAbilitiesTO,
    baseSpecies: number,
    evolutions: number[]
}
export type PokemonAbilitiesTO = {
    "1": string
    "2": string | null
    "3": string | null
}