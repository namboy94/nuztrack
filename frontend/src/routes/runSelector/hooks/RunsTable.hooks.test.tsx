import {runsService} from "../../../data/runs/runs.service";
import {of} from "rxjs";
import {renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_2} from "../../../data/runs/runs.testconstants";
import {RunsTableViewModel, useRunsTableViewModel} from "./RunsTable.hooks";
import {act} from "react-dom/test-utils";
import * as router from 'react-router'
import {getInteractions, getState} from "../../../util/viewmodel";

describe("useRunsTableProps", () => {

    const notify = jest.fn()
    const openDelete = jest.fn()
    const navigate = jest.fn();


    function setupMocksAndRender(): { current: RunsTableViewModel } {
        jest.spyOn(runsService, "getActiveRun$").mockReturnValue(of(NUZLOCKE_RUN))
        jest.spyOn(runsService, "getRuns$").mockReturnValue(of([NUZLOCKE_RUN, NUZLOCKE_RUN_2]))
        jest.spyOn(runsService, "selectActiveRun").mockImplementation(jest.fn())
        jest.spyOn(runsService, "deleteRun$").mockImplementation(jest.fn())
        jest.spyOn(runsService, "closeActiveRun").mockImplementation(jest.fn())
        jest.spyOn(router, "useNavigate").mockReturnValue(navigate)
        return renderHook(() => useRunsTableViewModel(notify, openDelete)).result
    }

    afterEach(() => {
        jest.resetAllMocks()
    })

    it("should load the data for the props", (done) => {
        const result = setupMocksAndRender()
        expect(getState(result).activeRun).toEqual(NUZLOCKE_RUN)
        expect(getState(result).runs).toEqual([NUZLOCKE_RUN, NUZLOCKE_RUN_2])
        expect(runsService.getRuns$).toHaveBeenCalledTimes(1)
        expect(runsService.getActiveRun$).toHaveBeenCalledTimes(1)
        done()
    })
    it("should select a Nuzlocke Run", (done) => {
        const result = setupMocksAndRender()
        act(() => getInteractions(result).selectActiveRun(NUZLOCKE_RUN))

        expect(runsService.selectActiveRun).toHaveBeenCalledTimes(1)
        expect(runsService.selectActiveRun).toHaveBeenCalledWith(NUZLOCKE_RUN)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "info")
        expect(navigate).toHaveBeenCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith("/overview")
        done()
    })
    it("should close a Nuzlocke Run", (done) => {
        const result = setupMocksAndRender()
        act(() => getInteractions(result).closeRun(NUZLOCKE_RUN))

        expect(runsService.closeActiveRun).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "info")
        expect(navigate).toHaveBeenCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith("/")
        done()
    })
    it("should open the delete dialog", (done) => {
        const result = setupMocksAndRender()
        act(() => getInteractions(result).openDeleteDialog(NUZLOCKE_RUN))
        expect(openDelete).toHaveBeenCalledTimes(1)
        done()
    })
})