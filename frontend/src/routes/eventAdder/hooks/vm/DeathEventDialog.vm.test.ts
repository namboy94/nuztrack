import {of, throwError} from "rxjs";
import {TEAM_MEMBER_1} from "../../../../data/team/team.testconstants";
import {act, renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {DeathEventDialogViewModel, useDeathEventDialogViewModel} from "./DeathEventDialog.vm";
import {eventsService} from "../../../../data/events/events.service";
import {DEATH_EVENT} from "../../../../data/events/events.testconstants";
import {CreateDeathEvent} from "../../../../data/events/events.model";
import {getInteractions, getState} from "../../../../util/viewmodel";
import {createMocksForTeamMemberEventViewModel} from "./TeamMemberEvent.vm.test";

describe("useDeathEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: DeathEventDialogViewModel } {
        createMocksForTeamMemberEventViewModel()
        return renderHook(() => useDeathEventDialogViewModel(NUZLOCKE_RUN, notify)).result
    }

    function fillFields(hookResult: { current: DeathEventDialogViewModel }) {
        const interactions = getInteractions(hookResult)
        act(() => {
            interactions.onChangeLocation("LOCATION")
            interactions.onChangeTeamMember(TEAM_MEMBER_1)
            interactions.onChangeLevel(16)
            interactions.onChangeOpponent("OPPONENT")
            interactions.onChangeDescription("DESCRIPTION")
        })
    }

    it("should reset if closed", () => {
        const result = createMocksAndRender()
        fillFields(result)

        act(getInteractions(result).closeDialog)

        expect(getState(result).description).toEqual("")
        expect(getState(result).opponent).toEqual("")
    })
    it("should submit successfully", () => {
        jest.spyOn(eventsService, "createDeathEvent$").mockReturnValue(of(DEATH_EVENT))

        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)
        act(getInteractions(result).submit)

        const expected: CreateDeathEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            level: 16,
            opponent: "OPPONENT",
            description: "DESCRIPTION"
        }

        expect(eventsService.createDeathEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createDeathEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
    })
    it("should submit unsuccessfully", () => {
        jest.spyOn(eventsService, "createDeathEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))

        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)
        act(getInteractions(result).submit)

        expect(eventsService.createDeathEvent$).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to create Death Event: 'TEST'", "error")
    })
})