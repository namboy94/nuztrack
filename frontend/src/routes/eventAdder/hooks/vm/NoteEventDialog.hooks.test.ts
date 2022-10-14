import {NoteEventDialogViewModel, useNoteEventDialogViewModel} from "./NoteEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {eventsService} from "../../../../data/events/events.service";
import {NOTE_EVENT} from "../../../../data/events/events.testconstants";
import {CreateNoteEvent} from "../../../../data/events/events.model";
import {createMocksForTeamMemberEventViewModel} from "./TeamMemberEvent.vm.test";
import {getInteractions, getState} from "../../../../util/viewmodel";

describe("useNoteEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: NoteEventDialogViewModel } {
        createMocksForTeamMemberEventViewModel()
        return renderHook(() => useNoteEventDialogViewModel(NUZLOCKE_RUN, notify)).result
    }

    function simulateSubmission() {
        const result = createMocksAndRender()

        act(getInteractions(result).openDialog)
        act(() => getInteractions(result).onChangeLocation("My Location"))
        act(() => getInteractions(result).onChangeNote("My Note"))

        act(getInteractions(result).submit)

        const expected: CreateNoteEvent = {location: "My Location", text: "My Note"}
        expect(eventsService.createNoteEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createNoteEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
    }

    it("should load the required data", () => {
        const result = createMocksAndRender()
        expect(getState(result).locations).toEqual(LOCATION_REGISTRY.getLocationNames())
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
    })

    it("should reset text and location when closing", () => {
        const result = createMocksAndRender()

        act(getInteractions(result).openDialog)
        act(() => getInteractions(result).onChangeLocation("Location"))
        act(() => getInteractions(result).onChangeNote("Note"))
        expect(getState(result).location).toEqual("Location")
        expect(getState(result).note).toEqual("Note")

        act(getInteractions(result).closeDialog)
        expect(getState(result).location).toEqual("")
        expect(getState(result).note).toEqual("")
    })

    it("should submit note successfully", () => {
        jest.spyOn(eventsService, "createNoteEvent$").mockReturnValue(of(NOTE_EVENT))
        simulateSubmission()
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
    })
    it("should submit note unsuccessfully", () => {
        jest.spyOn(eventsService, "createNoteEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))
        simulateSubmission()
        expect(notify).toHaveBeenCalledWith("Failed to create note: 'TEST'", "error")
    })
})