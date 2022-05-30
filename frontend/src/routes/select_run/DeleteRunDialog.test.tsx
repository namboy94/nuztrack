import {fireEvent, render, screen} from '@testing-library/react'
import DeleteRunDialog from "./DeleteRunDialog"
import {NuzlockeRun} from "../../api/runs/runsTypes";


describe("DeleteRunDialog", () => {

    const closer = jest.fn(() => {
    })
    const remover = jest.fn(_ => {
    })

    const renderDeleteRunDialog = (run: NuzlockeRun | null) => {
        render(<DeleteRunDialog
            open={true}
            onClose={closer}
            runToDelete={run}
            removeRun={remover}
            displaySnack={() => {
            }}
        />)
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
