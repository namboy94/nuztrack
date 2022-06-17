import {RunsTableEntry, RunsTableEntryProps} from "./RunsTableEntry";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("RunsTableEntry", () => {

    const closeRun = jest.fn()
    const openDeleteDialog = jest.fn()
    const selectActiveRun = jest.fn()

    function renderComponent(active: boolean = true, run: NuzlockeRun | undefined = NUZLOCKE_RUN) {
        const props: RunsTableEntryProps = {
            active: active,
            run: run,
            closeRun: closeRun,
            openDeleteDialog: openDeleteDialog,
            selectActiveRun: selectActiveRun
        }
        render(<RunsTableEntry {...props} />)
    }

    it("should render the component", (done) => {
        renderComponent()

        const title = screen.getByTestId("run-title")
        const status = screen.getByTestId("run-status")
        const image = screen.getByTestId("run-image")

        expect(title).toBeInTheDocument()
        expect(status).toBeInTheDocument()
        expect(image).toBeInTheDocument()

        expect(title.textContent).toEqual(NUZLOCKE_RUN.name)
        expect(status.textContent).toEqual(NUZLOCKE_RUN.status)
        expect(image.outerHTML).toContain(NUZLOCKE_RUN.game.title)

        done()
    })

    it("should correctly render active run", (done) => {
        renderComponent(true)

        const selectButton = screen.getByTestId("select-button")
        expect(selectButton.textContent).toEqual("Close")

        done()
    })

    it("should correctly render inactive run", (done) => {
        renderComponent(false)

        const selectButton = screen.getByTestId("select-button")
        expect(selectButton.textContent).toEqual("Select")

        done()
    })

    it("should push the select button", (done) => {
        renderComponent(false)

        const selectButton = screen.getByTestId("select-button")
        userEvent.click(selectButton)

        expect(selectActiveRun).toHaveBeenCalledTimes(1)

        done()
    })
    it("should push the delete button", (done) => {
        renderComponent(false)

        const selectButton = screen.getByTestId("open-delete-button")
        userEvent.click(selectButton)

        expect(openDeleteDialog).toHaveBeenCalledTimes(1)

        done()
    })
    it("should push the close button", (done) => {
        renderComponent(true)

        const selectButton = screen.getByTestId("select-button")
        userEvent.click(selectButton)

        expect(closeRun).toHaveBeenCalledTimes(1)

        done()
    })
})