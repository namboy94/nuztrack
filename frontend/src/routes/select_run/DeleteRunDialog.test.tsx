import {fireEvent, render, screen} from '@testing-library/react'
import DeleteRunDialog from "./DeleteRunDialog"
import {NuzlockeRunTO} from "../../api/runs/runsTransfer";


describe("DeleteRunDialog", () => {

    const closer = jest.fn(() => {
    })
    const remover = jest.fn(x => {
    })

    const renderDeleteRunDialog = (run: NuzlockeRunTO | null) => {
        render(<DeleteRunDialog open={true} onClose={closer} runToDelete={run} removeRun={remover}/>)
    }

    it("should close when pressing the Cancel button", () => {
        renderDeleteRunDialog(null)

        fireEvent.click(screen.getByTestId("cancel-button"))

        expect(closer.mock.calls.length).toBe(1)
        expect(remover.mock.calls.length).toBe(0)
    })

    it("should not remove a null run when pressing the Delete button", () => {
        renderDeleteRunDialog(null)

        fireEvent.click(screen.getByTestId("delete-button"))

        expect(closer.mock.calls.length).toBe(1)
        expect(remover.mock.calls.length).toBe(0)
    })
})
