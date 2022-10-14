import {act, fireEvent, render, screen} from "@testing-library/react";
import {SubmitCancelDialogActions} from "./SubmitCancelDialogActions";

describe("SubmitCancelDialogActions", () => {
    const submit = jest.fn()
    const closeDialog = jest.fn()

    function renderComponent() {
        render(<SubmitCancelDialogActions
            submit={submit}
            closeDialog={closeDialog}
        />)
    }

    it("should submit", () => {
        renderComponent()
        const submitButton = screen.getByTestId("submit-button")

        act(() => {
            fireEvent.click(submitButton)
        })

        expect(submit).toHaveBeenCalledTimes(1)
    })
    it("should cancel", () => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => {
            fireEvent.click(cancelButton)
        })

        expect(closeDialog).toHaveBeenCalledTimes(1)
    })
})