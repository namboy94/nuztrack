import {act, renderHook} from "@testing-library/react";
import {DeleteRunDialogViewModel, useDeleteRunDialogViewModel} from "./DeleteRunDialog.vm";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {runsService} from "../../../../data/runs/runs.service";
import {EMPTY} from "rxjs";
import {getInteractions, getState} from "../../../../util/viewmodel";

describe("useDeleteRunDialogProps", () => {

    const notify = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function createMocksAndRender(): { current: DeleteRunDialogViewModel } {
        jest.spyOn(runsService, "deleteRun$").mockReturnValue(EMPTY)
        return renderHook(() => useDeleteRunDialogViewModel(notify)).result
    }

    it("should open the dialog", () => {
        const result = createMocksAndRender()

        expect(getState(result).open).toBeFalsy()
        expect(getState(result).run).toBeNull()

        act(() => getInteractions(result).openDialog(NUZLOCKE_RUN))

        expect(getState(result).open).toBeTruthy()
        expect(getState(result).run).toEqual(NUZLOCKE_RUN)
    })
    it("should close the dialog", () => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog(NUZLOCKE_RUN))

        expect(getState(result).open).toBeTruthy()
        expect(getState(result).run).toEqual(NUZLOCKE_RUN)

        act(() => getInteractions(result).closeDialog())

        expect(getState(result).open).toBeFalsy()
        expect(getState(result).run).toBeNull()
    })
    it("should delete a run", () => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog(NUZLOCKE_RUN))

        expect(getState(result).open).toBeTruthy()
        expect(getState(result).run).toEqual(NUZLOCKE_RUN)

        act(() => getInteractions(result).submit())

        expect(getState(result).open).toBeFalsy()
        expect(getState(result).run).toBeNull()
        expect(runsService.deleteRun$).toHaveBeenCalledTimes(1)
        expect(runsService.deleteRun$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)
    })
})