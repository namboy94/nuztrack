import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {FreeformListInput} from "./FreeformListInput";

describe("FreeformListInput", () => {

    const onChange = jest.fn()
    const currentList = ["A", "B", "C"]

    afterEach(() => {
        jest.resetAllMocks()
    })

    function renderComponent() {
        return render(<FreeformListInput label={"FreeFormList"} onChange={onChange} currentList={currentList}/>)
    }

    function getInput(): HTMLElement {
        return screen.getByTestId("freeform-list-input")
    }

    function getTextbox(): HTMLElement {
        return within(getInput()).getByRole("textbox")
    }

    it("should display the intial list correctly", () => {
        renderComponent()
        expect(getTextbox().textContent).toEqual(currentList.join("\n"))
    })

    it("should test changing the list", () => {
        renderComponent()
        act(() => {
            fireEvent.change(getTextbox(), {target: {value: "ABC\nXYZ"}})
        })

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith(["ABC", "XYZ"])
    })
})
