import {act, render, screen} from "@testing-library/react";
import {DeleteButton} from "./DeleteButton";
import userEvent from "@testing-library/user-event";

describe("DeleteButton", () => {

    const onClick = jest.fn()

    it("should call onClick if the button was pressed", () => {
        render(<DeleteButton onClick={onClick}/>)
        const button = screen.getByTestId("delete-button")
        act(() => userEvent.click(button))
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})