import {render, screen} from "@testing-library/react";
import {DeleteRunDialog} from "./DeleteRunDialog";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {DeleteRunDialogViewModel} from "../hooks/vm/DeleteRunDialog.vm";

describe("DeleteRunDialog", () => {

    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()

    function renderComponent(run: NuzlockeRun | null) {
        const props: DeleteRunDialogViewModel = {
            state: {
                open: true,
                run: run
            },
            interactions: {
                openDialog: openDialog,
                closeDialog: closeDialog,
                submit: submit
            }
        }
        render(<DeleteRunDialog {...props} />)
    }

    afterEach(() => {
        jest.resetAllMocks()
    })

    it("should render the dialog", () => {
        renderComponent(NUZLOCKE_RUN)
        const title = screen.getByTestId("title")
        expect(title).toBeInTheDocument()
        expect(title.textContent).toContain(NUZLOCKE_RUN.name)
    })

    it("Should not render without a Nuzlocke Run", () => {
        renderComponent(null)
        expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument()
    })
})