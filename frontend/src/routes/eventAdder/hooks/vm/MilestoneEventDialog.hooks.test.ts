import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../../data/games/games.service";
import {LOCATION_REGISTRY, MILESTONE} from "../../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {eventsService} from "../../../../data/events/events.service";
import {MILESTONE_EVENT} from "../../../../data/events/events.testconstants";
import {CreateMilestoneEvent} from "../../../../data/events/events.model";
import {MilestoneEventDialogViewModel, useMilestoneEventDialogViewModel} from "./MilestoneEventDialog.hooks";
import {createMocksForTeamMemberEventViewModel} from "./TeamMemberEvent.vm.test";
import {getInteractions, getState} from "../../../../util/viewmodel";

describe("useMilestoneEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: MilestoneEventDialogViewModel } {
        createMocksForTeamMemberEventViewModel()
        return renderHook(() => useMilestoneEventDialogViewModel(NUZLOCKE_RUN, notify)).result
    }

    function simulateSubmission() {
        const result = createMocksAndRender()

        act(getInteractions(result).openDialog)
        act(() => getInteractions(result).onChangeMilestone(MILESTONE))

        act(getInteractions(result).submit)

        const expected: CreateMilestoneEvent = {location: MILESTONE.location, milestone: MILESTONE.name}
        expect(eventsService.createMilestoneEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createMilestoneEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
    }

    it("should load the required data", () => {
        const result = createMocksAndRender()
        expect(getState(result).milestones).toEqual(LOCATION_REGISTRY.getMilestones())
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
    })
    it("should reset milestone when closing", () => {
        const result = createMocksAndRender()

        act(getInteractions(result).openDialog)
        act(() => getInteractions(result).onChangeMilestone(MILESTONE))
        expect(getState(result).milestone).toEqual(MILESTONE)

        act(getInteractions(result).closeDialog)
        expect(getState(result).milestone).toEqual(null)
    })

    it("should submit milestone successfully", () => {
        jest.spyOn(eventsService, "createMilestoneEvent$").mockReturnValue(of(MILESTONE_EVENT))
        simulateSubmission()
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
    })

    it("should submit milestone unsuccessfully", () => {
        jest.spyOn(eventsService, "createMilestoneEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))
        simulateSubmission()
        expect(notify).toHaveBeenCalledWith("Failed to add Milestone: 'TEST'", "error")
    })
})