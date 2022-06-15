import {RunsTableEntry, RunsTableEntryProps} from "./RunsTableEntry";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";

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

        const infoBox = screen.getByTestId("run-info")
        const title = screen.getByTestId("run-title")
        const status = screen.getByTestId("run-status")
        const image = screen.getByTestId("run-image")

        expect(infoBox).toBeInTheDocument()
        expect(title).toBeInTheDocument()
        expect(status).toBeInTheDocument()
        expect(image).toBeInTheDocument()

        expect(title.textContent).toEqual(NUZLOCKE_RUN.name)
        expect(status.textContent).toEqual(NUZLOCKE_RUN.status)
        expect(image.outerHTML).toContain(NUZLOCKE_RUN.game)

        done()
    })

    it("should correctly render active run", (done) => {
        renderComponent(true)

        const infoBox = screen.getByTestId("run-info")

        expect(infoBox.style).toEqual("black")
        //
        //
        // expect(title.textContent).toEqual(NUZLOCKE_RUN.name)
        // expect(status.textContent).toEqual(NUZLOCKE_RUN.status)
        // expect(image.outerHTML).toContain(NUZLOCKE_RUN.game)

        done()
    })
})