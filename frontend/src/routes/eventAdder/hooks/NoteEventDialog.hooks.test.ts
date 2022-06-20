import {useNoteEventDialogProps} from "./NoteEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {NuzlockeRun} from "../../../data/runs/runs.model";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {NoteEventDialogProps} from "../components/NoteEventDialog";
import {eventsService} from "../../../data/events/events.service";
import {NOTE_EVENT} from "../../../data/events/events.testconstants";
import {CreateNoteEvent} from "../../../data/events/events.model";

type PropsGetter = () => NoteEventDialogProps

describe("useNoteEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(run: NuzlockeRun): [() => void, PropsGetter] {
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        const result = renderHook(() => useNoteEventDialogProps(run, notify)).result
        return [result.current[0], () => result.current[1]]
    }

    it("should load the required data", (done) => {
        const props = createMocksAndRender(NUZLOCKE_RUN)[1]()
        expect(props.locations).toEqual(LOCATION_REGISTRY.getLocationNames())
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
        done()
    })
    it("should reset text and location when closing", (done) => {
        const [openFN, propsGetter] = createMocksAndRender(NUZLOCKE_RUN)
        act(openFN)

        let props = propsGetter()
        act(() => {
            props.state.setLocation("ABC")
            props.state.setText("XYZ")
        })
        props = propsGetter()

        expect(props.state.location).toEqual("ABC")
        expect(props.state.text).toEqual("XYZ")

        act(props.onClose)
        props = propsGetter()

        expect(props.state.location).toEqual("")
        expect(props.state.text).toEqual("")
        done()
    })
    it("should submit note successfully", (done) => {
        jest.spyOn(eventsService, "createNoteEvent$").mockReturnValue(of(NOTE_EVENT))
        const [openFN, propsGetter] = createMocksAndRender(NUZLOCKE_RUN)

        let props = propsGetter()
        act(() => {
            openFN()
            props.state.setLocation("ABC")
            props.state.setText("XYZ")
        })
        props = propsGetter()

        act(props.submit)

        const expected: CreateNoteEvent = {location: "ABC", text: "XYZ"}
        expect(eventsService.createNoteEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createNoteEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })
    it("should submit note unsuccessfully", (done) => {
        jest.spyOn(eventsService, "createNoteEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))
        const [openFN, propsGetter] = createMocksAndRender(NUZLOCKE_RUN)

        let props = propsGetter()
        act(() => {
            openFN()
            props.state.setLocation("ABC")
            props.state.setText("XYZ")
        })
        props = propsGetter()

        act(props.submit)

        const expected: CreateNoteEvent = {location: "ABC", text: "XYZ"}
        expect(eventsService.createNoteEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createNoteEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to create note: 'TEST'", "error")
        done()
    })
})