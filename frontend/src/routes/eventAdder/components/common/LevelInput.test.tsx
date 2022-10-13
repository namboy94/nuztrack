import {act, render, screen} from "@testing-library/react";
import {LevelInput} from "./LevelInput";
import userEvent from "@testing-library/user-event";

describe("LevelInput", () => {

    const setLevel = jest.fn()

    function renderComponent(): HTMLElement {
        render(<LevelInput level={1} setLevel={setLevel}/>)
        return screen.getByRole("spinbutton")
    }

    it("should set the initial value correctly", () => {
        const input = renderComponent()
        expect(input.getAttribute("value")).toEqual("1")
    })

    it("should enter a new level", () => {
        const input = renderComponent()
        act(() => userEvent.type(input, "1"))
        expect(setLevel).toHaveBeenCalledWith(11)

    })

    it("should not accept letters", () => {
        const input = renderComponent()
        act(() => userEvent.type(input, "a"))
        expect(setLevel).not.toHaveBeenCalled()
    })
    
    it("should set the value to null if cleared", () => {
        const input = renderComponent()
        act(() => userEvent.clear(input))
        expect(setLevel).toHaveBeenCalledWith(null)
    })
})