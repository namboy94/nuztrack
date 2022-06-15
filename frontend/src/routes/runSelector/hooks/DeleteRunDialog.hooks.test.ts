import {DeleteRunDialogProps} from "../components/DeleteRunDialog";
import {act, renderHook} from "@testing-library/react";
import {useDeleteRunDialogProps} from "./DeleteRunDialog.hooks";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {runsService} from "../../../data/runs/runs.service";
import {EMPTY} from "rxjs";

describe("useDeleteRunDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: [((run: NuzlockeRun) => void), DeleteRunDialogProps] } {
        jest.spyOn(runsService, "deleteRun$").mockReturnValue(EMPTY)
        return renderHook(() => useDeleteRunDialogProps(notify)).result
    }

    it("should open the dialog", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        expect(props.open).toBeFalsy()
        expect(props.run).toBeNull()

        act(() => {
            openFn(NUZLOCKE_RUN)
        })

        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.run).toEqual(NUZLOCKE_RUN)

        done()
    })
    it("should close the dialog", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn(NUZLOCKE_RUN)
        })

        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.run).toEqual(NUZLOCKE_RUN)

        act(() => {
            props.onClose()
        })

        props = result.current[1]
        expect(props.open).toBeFalsy()
        expect(props.run).toBeNull()

        done()
    })
    it("should delete a run", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn(NUZLOCKE_RUN)
        })

        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.run).toEqual(NUZLOCKE_RUN)

        act(() => {
            props.deleteRun()
        })

        props = result.current[1]
        expect(props.open).toBeFalsy()
        expect(props.run).toBeNull()
        expect(runsService.deleteRun$).toHaveBeenCalledTimes(1)
        expect(runsService.deleteRun$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)

        done()
    })
})