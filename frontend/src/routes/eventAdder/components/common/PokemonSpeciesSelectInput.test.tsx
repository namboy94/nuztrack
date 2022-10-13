import {render} from "@testing-library/react";
import {
    POKEMON_SPECIES_BULBASAUR,
    POKEMON_SPECIES_CHARMANDER,
    POKEMON_SPECIES_SQUIRTLE
} from "../../../../data/pokedex/pokedex.testconstants";
import {PokemonSpeciesSelectInput} from "./PokemonSpeciesSelectInput";
import {selectAutocompleteIndex, selectAutocompleteText} from "../../../../util/testing/autocomplete";

describe("PokemonSpeciesSelectInput", () => {

    const setPokemonSpecies = jest.fn()

    function renderComponent() {
        render(<PokemonSpeciesSelectInput
            pokemonSpecies={null}
            setPokemonSpecies={setPokemonSpecies}
            pokemonSpeciesOptions={[POKEMON_SPECIES_BULBASAUR, POKEMON_SPECIES_CHARMANDER, POKEMON_SPECIES_SQUIRTLE]}
            groupFn={(_) => "All"}
        />)
    }

    it("should test changing the pokemon species using autocomplete", () => {
        renderComponent()
        selectAutocompleteText("pokemon-species-input", "charm")
        expect(setPokemonSpecies).toHaveBeenCalledWith(POKEMON_SPECIES_CHARMANDER)
    })

    it("should test changing the pokemon using the dropdown", () => {
        renderComponent()
        selectAutocompleteIndex("pokemon-species-input", 2)
        expect(setPokemonSpecies).toHaveBeenCalledWith(POKEMON_SPECIES_SQUIRTLE)
    })
})
