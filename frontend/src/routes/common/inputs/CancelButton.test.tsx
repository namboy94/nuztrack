import {act, render, screen} from "@testing-library/react";
import {CancelButton} from "./CancelButton";
import userEvent from "@testing-library/user-event";

describe("CancelButton", () => {

    const onClick = jest.fn()

    it("should call onClick if the button was pressed", () => {
        render(<CancelButton onClick={onClick}/>)
        const button = screen.getByTestId("cancel-button")
        act(() => userEvent.click(button))
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})