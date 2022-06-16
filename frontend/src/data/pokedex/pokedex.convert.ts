import {NaturesTO, PokedexTO, PokemonSpeciesTO} from "./pokedex.transfer";
import {Natures, PokedexData, PokemonSpecies} from "./pokedex.model";

class PokedexConverter {
    convertPokedexTOToPokedexData(to: PokedexTO): PokedexData {
        const stringMap = new Map<string, PokemonSpeciesTO>(Object.entries(to))
        const pokedexData: PokedexData = new Map<number, PokemonSpecies>()
        Array.from(stringMap.keys()).forEach(key => {
            const numberKey = parseInt(key)
            const species = this.convertPokemonSpeciesTOToModel(stringMap.get(key)!!)
            pokedexData.set(numberKey, species)
        })
        return pokedexData
    }

    convertPokemonSpeciesTOToModel(to: PokemonSpeciesTO): PokemonSpecies {
        return {...to}
    }

    convertNaturesTOToModel(to: NaturesTO): Natures {
        return to
    }
}

export const pokedexConverter = new PokedexConverter()
