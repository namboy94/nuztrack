import {pokedexConverter} from "./pokedex.convert";
import {
    NATURES,
    NATURES_TO,
    POKEDEX_DATA,
    POKEDEX_TO,
    POKEMON_SPECIES_SQUIRTLE,
    POKEMON_SPECIES_SQUIRTLE_TO
} from "./pokedex.testconstants";

describe("PokedexConverter", () => {
    it("should convert Pokemon Species TO to Model", (done) => {
        const converted = pokedexConverter.convertPokemonSpeciesTOToModel(POKEMON_SPECIES_SQUIRTLE_TO)
        expect(converted).toEqual(POKEMON_SPECIES_SQUIRTLE)
        done()
    })
    it("should convert Pokedex TO to Pokedex Data", (done) => {
        const converted = pokedexConverter.convertPokedexTOToPokedexData(POKEDEX_TO)
        expect(converted).toEqual(POKEDEX_DATA)
        done()
    })
    it("should convert the Natures TO to Model", (done) => {
        const converted = pokedexConverter.convertNaturesTOToModel(NATURES_TO)
        expect(converted).toEqual(NATURES)
        done()
    })
})