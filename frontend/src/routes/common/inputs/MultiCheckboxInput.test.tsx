import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {MultiCheckboxInput} from "./MultiCheckboxInput";

describe("MultiCheckboxInput", () => {

    const toggleOption = jest.fn()
    const options = new Map<string, string>([["a", "alpha"], ["o", "omega"]])
    const selected = ["a"]

    afterEach(() => {
        jest.resetAllMocks()
    })

    function renderComponent() {
        return render(<MultiCheckboxInput label={"MultiCheckBox"}
                                          toggleOption={toggleOption}
                                          options={options}
                                          selected={selected}/>)
    }

    function getOptionKey(index: number): string {
        return Array.from(options.keys())[index]
    }

    function getCheckBox(index: number): HTMLElement {
        return screen.getAllByTestId("multi-checkbox-input")[index]
    }

    function getRawCheckbox(index: number): HTMLElement {
        return within(getCheckBox(index)).getByRole("checkbox")
    }

    it("should set the initial checked values correctly", () => {
        renderComponent()
        expect(getRawCheckbox(0)).toBeChecked()
        expect(getRawCheckbox(1)).not.toBeChecked()
    })

    it("should check unchecked option", () => {
        renderComponent()
        const uncheckedIndex = 1

        act(() => {
            fireEvent.click(getCheckBox(uncheckedIndex))
        })

        expect(toggleOption).toHaveBeenCalledTimes(1)
        expect(toggleOption).toHaveBeenCalledWith(true, getOptionKey(uncheckedIndex))
    })

    it("should uncheck checked option", () => {
        renderComponent()
        const checkedIndex = 0

        act(() => {
            fireEvent.click(getCheckBox(checkedIndex))
        })

        expect(toggleOption).toHaveBeenCalledTimes(1)
        expect(toggleOption).toHaveBeenCalledWith(false, getOptionKey(checkedIndex))
    })
})