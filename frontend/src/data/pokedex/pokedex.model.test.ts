import {
    POKEDEX,
    POKEMON_SPECIES_BULBASAUR,
    POKEMON_SPECIES_IVYSAUR,
    POKEMON_SPECIES_SQUIRTLE
} from "./pokedex.testconstants";

describe("Pokedex", () => {
    it("should get a list of all Pokemon Species", () => {
        expect(POKEDEX.getAllSpecies()).toEqual([
            POKEMON_SPECIES_BULBASAUR, POKEMON_SPECIES_IVYSAUR, POKEMON_SPECIES_SQUIRTLE
        ])
    })
    it("should get a specific Pokemon", () => {
        expect(POKEDEX.getSpecies(POKEMON_SPECIES_SQUIRTLE.pokedexNumber)).toEqual(POKEMON_SPECIES_SQUIRTLE)
    })
    it("should get Bulbasaur instead of a specific Pokemon that does not exist", () => {
        expect(POKEDEX.getSpecies(-1)).toEqual(POKEMON_SPECIES_BULBASAUR)
    })
    it("should get a list of all valid ability slots for a Pokemon", () => {
        expect(POKEDEX.getValidAbilitySlots(POKEMON_SPECIES_SQUIRTLE.pokedexNumber)).toEqual([1, 3])
    })
    it("should get the name of an ability", () => {
        expect(POKEDEX.getAbilityName(POKEMON_SPECIES_SQUIRTLE.pokedexNumber, 1)).toEqual("Torrent")
    })
    it("should get N/A instead of the name of an ability that does not exist", () => {
        expect(POKEDEX.getAbilityName(POKEMON_SPECIES_SQUIRTLE.pokedexNumber, 2)).toEqual("N/A")
    })
})