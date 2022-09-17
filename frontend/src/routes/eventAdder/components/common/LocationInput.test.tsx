import {act, fireEvent, render, screen} from "@testing-library/react";
import {LocationInput} from "./LocationInput";
import userEvent from "@testing-library/user-event";

describe("LocationInput", () => {

    const setLocation = jest.fn()

    function renderComponent(): HTMLElement {
        render(<LocationInput setLocation={setLocation} location={""} locations={["AAAAA", "BBBBB", "CCCCC"]}/>)
        return screen.getByRole("combobox")
    }

    it("should select a location from the list of options", () => {
        const locationInput = renderComponent()

        act(() => locationInput.focus())
        fireEvent.keyDown(locationInput, {key: "ArrowDown"})
        fireEvent.keyDown(locationInput, {key: "ArrowDown"})
        fireEvent.keyDown(locationInput, {key: "Enter"})

        expect(setLocation).toHaveBeenCalledTimes(1)
        expect(setLocation).toHaveBeenCalledWith("AAAAA")
    })
    it("should change the location entered by the user", () => {
        const locationInput = renderComponent()

        act(() => userEvent.type(locationInput, "ABC{enter}"))

        expect(setLocation).toHaveBeenCalledWith("ABC")
    })
})