import {render} from "@testing-library/react";
import {NatureInput} from "./NatureInput";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {NATURES} from "../../../../data/pokedex/pokedex.testconstants";
import {of} from "rxjs";
import {selectAutocompleteIndex, selectAutocompleteText} from "../../../../util/testing/autocomplete";

describe("NatureInput", () => {

    const onChangeNature = jest.fn()

    function renderComponent() {
        jest.spyOn(pokedexService, "getNatures$").mockReturnValue(of(NATURES))
        render(<NatureInput nature="ADAMANT" onChangeNature={onChangeNature}/>)
    }

    it("should test changing the nature using autocomplete", () => {
        renderComponent()
        selectAutocompleteText("nature-input", "timi")
        expect(onChangeNature).toHaveBeenCalledWith("TIMID")
    })

    it("should test changing the nature by selecting the index", () => {
        renderComponent()
        selectAutocompleteIndex("nature-input", 0)
        expect(onChangeNature).toHaveBeenCalledWith(NATURES[1])
    })

})