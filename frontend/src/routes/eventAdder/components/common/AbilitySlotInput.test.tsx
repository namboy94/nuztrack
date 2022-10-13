import {AbilitySlotInput} from "./AbilitySlotInput";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {selectAutocompleteIndex, selectAutocompleteText} from "../../../../util/testing/autocomplete";
import {render} from "@testing-library/react";

describe("AbilitySlotInput", () => {
    const onChangeAbilitySlot = jest.fn()

    function renderComponent() {
        render(<AbilitySlotInput
            abilitySlot={1}
            onChangeAbilitySlot={onChangeAbilitySlot}
            possibleAbilitySlots={[1, 3]}
            pokedex={POKEDEX}
            pokedexNumber={1}
        />)
    }

    it("should test changing ability using text", () => {
        renderComponent()
        selectAutocompleteText("ability-slot-input", "Sola")
        expect(onChangeAbilitySlot).toHaveBeenCalledWith(3)
    })

    it("should test changing ability using index", () => {
        renderComponent()
        selectAutocompleteIndex("ability-slot-input", 0)
        expect(onChangeAbilitySlot).toHaveBeenCalledWith(3)
    })

})