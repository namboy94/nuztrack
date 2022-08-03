import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {RunNameInput} from "./RunNameInput";

describe("RunNameInput", () => {

    const defaultName = "Default Name"
    const onChange = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function renderComponent() {
        return render(<RunNameInput onChange={onChange} name={defaultName}/>)
    }

    function getTextBox(): HTMLElement {
        return within(screen.getByTestId("name-input")).getByRole("textbox")
    }

    it("should display the current value", () => {
        renderComponent()
        expect(getTextBox().getAttribute("value")).toEqual(defaultName)
    })

    it("should call onChange if the value changes", () => {
        renderComponent()
        act(() => {
            fireEvent.change(getTextBox(), {target: {value: "ABC"}})
        })
        expect(onChange).toHaveBeenCalledWith("ABC")
    })
})