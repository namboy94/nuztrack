import {act, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {CancelButton, DeleteButton, GenericButton, SubmitButton} from "./Button";

describe("Button", () => {
    it("should call onClick if the button was pressed", () => {
        const onClick = jest.fn()
        render(<GenericButton onClick={onClick}/>)
        const button = screen.getByTestId("generic-button")
        act(() => userEvent.click(button))
        expect(onClick).toHaveBeenCalledTimes(1)
    })
    it("should create a submit, cancel and error button", () => {
        const onSubmit = jest.fn()
        const onDelete = jest.fn()
        const onCancel = jest.fn()

        render(<>
            <SubmitButton onClick={onSubmit}/>
            <CancelButton onClick={onCancel}/>
            <DeleteButton onClick={onDelete}/>
        </>)
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")
        const deleteButton = screen.getByTestId("delete-button")

        expect(submitButton.textContent).toEqual("Submit")
        expect(cancelButton.textContent).toEqual("Cancel")
        expect(deleteButton.textContent).toEqual("Delete")

        const assertPresses = (submitCalls: number, cancelCalls: number, deleteCalls: number) => {
            expect(onSubmit).toHaveBeenCalledTimes(submitCalls)
            expect(onCancel).toHaveBeenCalledTimes(cancelCalls)
            expect(onDelete).toHaveBeenCalledTimes(deleteCalls)
        }

        assertPresses(0, 0, 0)

        act(() => userEvent.click(submitButton))
        assertPresses(1, 0, 0)

        act(() => userEvent.click(cancelButton))
        assertPresses(1, 1, 0)

        act(() => userEvent.click(deleteButton))
        assertPresses(1, 1, 1)
    })
})