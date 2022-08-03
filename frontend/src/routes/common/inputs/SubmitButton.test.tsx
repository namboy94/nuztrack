import {act, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SubmitButton} from "./SubmitButton";

describe("SubmitButton", () => {

    const onClick = jest.fn()

    it("should call onClick if the button was pressed", () => {
        render(<SubmitButton onClick={onClick}/>)
        const button = screen.getByTestId("submit-button")
        act(() => userEvent.click(button))
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})