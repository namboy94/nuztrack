import {Pokedex, PokemonNatures, PokemonSpecies, PokemonSpeciesTO} from "./pokedexTypes";
import axios from "axios";

export function loadPokedex(): Promise<Pokedex> {
    function convert(mapping: Map<string, PokemonSpeciesTO>): Pokedex {
        const pokedex = new Map<number, PokemonSpecies>()
        mapping.forEach((value, key) => {
            const abilities = new Map<number, string | null>()
            abilities.set(1, value.abilities["1"])
            abilities.set(2, value.abilities["2"])
            abilities.set(3, value.abilities["3"])
            pokedex.set(parseInt(key), {...value, abilities: abilities})
        })
        return pokedex
    }

    return axios.get("/api/pokedex").then(
        x => convert(new Map<string, PokemonSpeciesTO>(Object.entries(x.data)))
    )
}

export function loadNatures(): Promise<PokemonNatures> {
    return axios.get("/api/pokedex/natures").then(x => x.data)
}