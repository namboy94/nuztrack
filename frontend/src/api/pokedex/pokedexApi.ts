import {Pokedex, PokemonNatures, PokemonSpecies} from "./pokedexTypes";
import axios from "axios";

export function loadPokedex(): Promise<Pokedex> {

    function convertIntKeys(mapping: Map<string, PokemonSpecies>): Pokedex {
        const pokedex = new Map<number, PokemonSpecies>()
        mapping.forEach((value, key) => {
            pokedex.set(parseInt(key), value)
        })
        return pokedex
    }

    return axios.get("/api/pokedex").then(
        x => convertIntKeys(new Map<string, PokemonSpecies>(Object.entries(x.data)))
    )
}

export function loadNatures(): Promise<PokemonNatures> {
    return axios.get("/api/pokedex/natures").then(x => x.data)
}