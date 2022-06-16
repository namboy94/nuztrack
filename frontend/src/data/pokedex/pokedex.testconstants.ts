import {Natures, Pokedex, PokedexData, PokemonSpecies} from "./pokedex.model";
import {NaturesTO, PokedexTO, PokemonSpeciesTO} from "./pokedex.transfer";

export const POKEMON_SPECIES_IVYSAUR_TO: PokemonSpeciesTO = {
    abilities: {
        1: "Overgrow",
        2: null,
        3: "Solar Power"
    },
    baseSpecies: 1,
    evolutions: [3],
    name: "Ivysaur",
    sprite: "http://ivysaur.png",
    types: {
        primary: "GRASS",
        secondary: "POISON"
    }
}

export const POKEMON_SPECIES_IVYSAUR: PokemonSpecies = {
    abilities: {
        1: "Overgrow",
        2: null,
        3: "Solar Power"
    },
    baseSpecies: 1,
    evolutions: [3],
    name: "Ivysaur",
    sprite: "http://ivysaur.png",
    types: {
        primary: "GRASS",
        secondary: "POISON"
    }
}

export const POKEMON_SPECIES_SQUIRTLE_TO: PokemonSpeciesTO = {
    abilities: {
        1: "Torrent",
        2: null,
        3: "Rain Dish"
    },
    baseSpecies: 7,
    evolutions: [8],
    name: "Squirtle",
    sprite: "http://squirtle.png",
    types: {
        primary: "WATER",
        secondary: null
    }
}

export const POKEMON_SPECIES_SQUIRTLE: PokemonSpecies = {
    abilities: {
        1: "Torrent",
        2: null,
        3: "Rain Dish"
    },
    baseSpecies: 7,
    evolutions: [8],
    name: "Squirtle",
    sprite: "http://squirtle.png",
    types: {
        primary: "WATER",
        secondary: null
    }
}

export const NATURES_TO: NaturesTO = ["ADAMANT", "JOLLY", "MODEST", "TIMID"]
export const NATURES: Natures = ["ADAMANT", "JOLLY", "MODEST", "TIMID"]

export const POKEDEX_TO: PokedexTO = {
    "2": POKEMON_SPECIES_IVYSAUR_TO,
    "7": POKEMON_SPECIES_SQUIRTLE_TO
}
export const POKEDEX_DATA: PokedexData = new Map<number, PokemonSpecies>([
    [2, POKEMON_SPECIES_IVYSAUR],
    [7, POKEMON_SPECIES_SQUIRTLE]
])
export const POKEDEX: Pokedex = new Pokedex(POKEDEX_DATA)
