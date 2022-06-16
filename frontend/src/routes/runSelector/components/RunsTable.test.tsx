import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_2} from "../../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import {RunsTable, RunsTableProps} from "./RunsTable";

describe("RunsTable", () => {

    const closeRun = jest.fn()
    const openDeleteDialog = jest.fn()
    const selectActiveRun = jest.fn()

    function renderComponent(runs: NuzlockeRun[] = [NUZLOCKE_RUN, NUZLOCKE_RUN_2]) {
        const props: RunsTableProps = {
            activeRun: NUZLOCKE_RUN,
            runs: runs,
            closeRun: closeRun,
            openDeleteDialog: openDeleteDialog,
            selectActiveRun: selectActiveRun
        }
        render(<RunsTable {...props} />)
    }

    it("should render the component", (done) => {
        renderComponent()

        const runEntries = screen.getAllByTestId("run-entry-grid")
        expect(runEntries.length).toEqual(2)
        done()
    })
})