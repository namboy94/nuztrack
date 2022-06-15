import {render, screen} from "@testing-library/react";
import {DeleteRunDialog, DeleteRunDialogProps} from "./DeleteRunDialog";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import userEvent from "@testing-library/user-event";
import {NuzlockeRun} from "../../../data/runs/runs.model";

describe("DeleteRunDialog", () => {

    const deleteRun = jest.fn()
    const onClose = jest.fn()

    function renderComponent(run: NuzlockeRun | null = NUZLOCKE_RUN) {
        const props: DeleteRunDialogProps = {
            open: true,
            run: run,
            deleteRun: deleteRun,
            onClose: onClose
        }
        render(<DeleteRunDialog {...props} />)
    }

    afterEach(() => {
        jest.resetAllMocks()
    })

    it("should render the dialog", (done) => {
        renderComponent()
        const title = screen.getByTestId("title")
        expect(title).toBeInTheDocument()
        expect(title.textContent).toContain(NUZLOCKE_RUN.name)
        done()
    })

    it("should press the cancel button", (done) => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")
        userEvent.click(cancelButton)
        expect(onClose).toHaveBeenCalledTimes(1)
        done()
    })

    it("should delete the run", (done) => {
        renderComponent()
        const deleteButton = screen.getByTestId("delete-button")
        userEvent.click(deleteButton)
        expect(deleteRun).toHaveBeenCalledTimes(1)
        done()
    })

    it("Should not render without a Nuzlocke Run", (done) => {
        renderComponent(null)
        expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument()
        done()
    })
})