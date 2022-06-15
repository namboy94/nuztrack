import {act, renderHook} from "@testing-library/react";
import {useCreateNewRunDialogProps} from "./CreateNewRunDialog.hooks";
import {CreateNewRunDialogProps} from "../components/CreateNewRunDialog";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_CREATOR} from "../../../data/runs/runs.testconstants";
import {runsService} from "../../../data/runs/runs.service";
import {of, throwError} from "rxjs";

describe("useCreateNewRunDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: [(() => void), CreateNewRunDialogProps] } {
        return renderHook(() => useCreateNewRunDialogProps(notify)).result
    }

    it("should test opening the dialog", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        expect(props.open).toBeFalsy()

        act(() => openFn())

        props = result.current[1]
        expect(props.open).toBeTruthy()

        done()
    })
    it("should test closing the dialog", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn()
            props.state.setName("TEST")
        })
        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.state.name).toEqual("TEST")

        act(() => props.onClose())
        props = result.current[1]
        expect(props.open).toBeFalsy()
        expect(props.state.name).toEqual("")

        done()
    })
    it("should test resetting state", (done) => {
        const result = createMocksAndRender()
        let props = result.current[1]

        act(() => {
            props.state.setName("TEST")
            props.state.setGame("BLUE")
            props.state.setRules(["ABC"])
            props.state.setCustomRules(["XYZ"])
        })
        props = result.current[1]
        expect(props.state.name).toEqual("TEST")
        expect(props.state.game).toEqual("BLUE")
        expect(props.state.rules).toEqual(["ABC"])
        expect(props.state.customRules).toEqual(["XYZ"])

        act(() => props.state.reset())
        props = result.current[1]
        expect(props.state.name).toEqual("")
        expect(props.state.game).toEqual("RED")
        expect(props.state.rules).toEqual([])
        expect(props.state.customRules).toEqual([])

        done()
    })
    it("should test submitting successfully", (done) => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(of(NUZLOCKE_RUN))

        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn()
            props.state.setName(NUZLOCKE_RUN_CREATOR.name)
            props.state.setGame(NUZLOCKE_RUN_CREATOR.game)
            props.state.setRules(NUZLOCKE_RUN_CREATOR.rules)
            props.state.setCustomRules(NUZLOCKE_RUN_CREATOR.customRules)
        })
        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.state.name).toEqual(NUZLOCKE_RUN_CREATOR.name)
        expect(props.state.game).toEqual(NUZLOCKE_RUN_CREATOR.game)
        expect(props.state.rules).toEqual(NUZLOCKE_RUN_CREATOR.rules)
        expect(props.state.customRules).toEqual(NUZLOCKE_RUN_CREATOR.customRules)

        act(() => props.submit())
        props = result.current[1]

        expect(props.open).toBeFalsy()
        expect(props.state.name).toEqual("")
        expect(props.state.game).toEqual("RED")
        expect(props.state.rules).toEqual([])
        expect(props.state.customRules).toEqual([])

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(runsService.addRun$).toHaveBeenCalledWith(NUZLOCKE_RUN_CREATOR)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })

    it("should test submitting unsuccessfully", (done) => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(throwError(() => {
        }))

        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn()
        })
        props = result.current[1]
        expect(props.open).toBeTruthy()

        act(() => props.submit())
        props = result.current[1]

        expect(props.open).toBeTruthy()

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "error")
        done()
    })
})