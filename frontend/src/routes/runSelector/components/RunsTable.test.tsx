import {NUZLOCKE_RUN, NUZLOCKE_RUN_2} from "../../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import {RunsTable} from "./RunsTable";
import {RunsTableViewModel} from "../hooks/vm/RunsTable.vm";

describe("RunsTable", () => {

    const closeRun = jest.fn()
    const openDeleteDialog = jest.fn()
    const selectActiveRun = jest.fn()

    function renderComponent() {
        const props: RunsTableViewModel = {
            state: {runs: [NUZLOCKE_RUN, NUZLOCKE_RUN_2], activeRun: NUZLOCKE_RUN},
            interactions: {closeRun: closeRun, selectActiveRun: selectActiveRun, openDeleteDialog: openDeleteDialog}
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