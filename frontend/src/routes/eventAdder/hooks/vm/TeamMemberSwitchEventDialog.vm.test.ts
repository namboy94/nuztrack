import {
    TeamMemberSwitchEventDialogViewModel,
    useTeamMemberSwitchEventDialogViewModel
} from "./TeamMemberSwitchEventDialog.vm";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {of, throwError} from "rxjs";
import {act, renderHook} from "@testing-library/react";
import {eventsService} from "../../../../data/events/events.service";
import {TEAM_MEMBER_SWITCH_EVENT} from "../../../../data/events/events.testconstants";
import {CreateTeamMemberSwitchEvent, SwitchType} from "../../../../data/events/events.model";
import {TEAM_MEMBER_1} from "../../../../data/team/team.testconstants";
import {createMocksForTeamMemberEventViewModel} from "./TeamMemberEvent.vm.test";
import {getInteractions} from "../../../../util/viewmodel";

describe("useTeamMemberSwitchEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(mode: SwitchType): { current: TeamMemberSwitchEventDialogViewModel } {
        createMocksForTeamMemberEventViewModel()
        return renderHook(() => useTeamMemberSwitchEventDialogViewModel(NUZLOCKE_RUN, notify, mode)).result
    }

    function fillFields(hookResult: { current: TeamMemberSwitchEventDialogViewModel }) {
        const interactions = getInteractions(hookResult)
        act(() => {
            interactions.onChangeLocation("LOCATION")
            interactions.onChangeTeamMember(TEAM_MEMBER_1)
        })
    }

    function simulateSubmission(success: boolean, mode: SwitchType) {
        if (success) {
            jest.spyOn(eventsService, "createTeamMemberSwitchEvent$")
                .mockReturnValue(of(TEAM_MEMBER_SWITCH_EVENT))
        } else {
            jest.spyOn(eventsService, "createTeamMemberSwitchEvent$")
                .mockReturnValue(throwError(() => {
                    throw {response: {data: {reason: "TEST"}}}
                }))
        }

        const result = createMocksAndRender(mode)

        act(getInteractions(result).openDialog)
        fillFields(result)
        act(getInteractions(result).submit)

        const expected: CreateTeamMemberSwitchEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            switchType: mode
        }

        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createTeamMemberSwitchEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)

        if (success) {
            expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        } else {
            const verb = mode === SwitchType.ADD ? "add" : "remove"
            expect(notify).toHaveBeenCalledWith(`Failed to ${verb} team member: 'TEST'`, "error")
        }
    }

    it("should submit successfully", () => {
        simulateSubmission(true, SwitchType.ADD)
    })
    it("should submit unsuccessfully (add)", () => {
        simulateSubmission(false, SwitchType.ADD)
    })
    it("should submit unsuccessfully (remove)", () => {
        simulateSubmission(false, SwitchType.REMOVE)
    })
})