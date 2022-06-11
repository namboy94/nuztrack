import {useQuery, UseQueryResult} from "react-query";
import {loadNatures, loadPokedex} from "./pokedexApi";
import {Pokedex, PokemonNatures} from "./pokedexTypes";

const POKEDEX_KEY = "/rules"

export function usePokedexQuery(): UseQueryResult<Pokedex> {
    return useQuery(POKEDEX_KEY, loadPokedex)
}

export function useNaturesQuery(): UseQueryResult<PokemonNatures> {
    return useQuery(`${POKEDEX_KEY}/natures`, loadNatures)
}
