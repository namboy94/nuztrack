import {render} from "@testing-library/react";
import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import {selectAutocompleteIndex, selectAutocompleteText} from "./autocomplete";

describe("autocomplete", () => {

    const changeFn = jest.fn()

    function renderComponent() {
        render(<Autocomplete
            data-testid="autocomplete"
            renderInput={(params) =>
                <TextField{...params} label="Test"/>
            }
            options={["One", "Two", "Three", "Four", "Five"]}
            onChange={(_, newValue) => changeFn(newValue)}
        />)
    }

    it("should select a specific index", () => {
        renderComponent()
        selectAutocompleteIndex("autocomplete", 3)
        expect(changeFn).toHaveBeenCalledWith("Four")
    })

    it("should select an option based on text input", () => {
        renderComponent()
        selectAutocompleteText("autocomplete", "Thr")
        expect(changeFn).toHaveBeenCalledWith("Three")
    })
})