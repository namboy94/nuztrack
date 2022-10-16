import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {of} from "rxjs";
import {act, renderHook} from "@testing-library/react";
import {PokemonGridViewModel, usePokemonGridViewModel} from "./PokemonGrid.vm";
import {teamService} from "../../../../data/team/team.service";
import {TeamMember, TeamState} from "../../../../data/team/team.model";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {TEAM_MEMBER_1, TEAM_MEMBER_2, TEAM_MEMBER_3} from "../../../../data/team/team.testconstants";
import {getInteractions, getState} from "../../../../util/viewmodel";
import {SwitchType} from "../../../../data/events/events.model";

describe("TeamMemberGridViewModel", () => {
    const notify = jest.fn()

    function createMocksAndRender(run: NuzlockeRun, team: TeamMember[], state: TeamState): { current: PokemonGridViewModel } {
        jest.spyOn(teamService, "getTeamMembersByState$").mockReturnValue(of(team))
        return renderHook(() => usePokemonGridViewModel(run, notify, state)).result
    }

    function expectAllDialogsClosed(result: { current: PokemonGridViewModel }) {
        expect(getState(result).infoPageVm.state.open).toEqual(false)
        expect(getState(result).teamMemberSwitchDialogVm.state.open).toEqual(false)
    }

    it("should load the data", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN, [TEAM_MEMBER_1], TeamState.ACTIVE)
        expect(getState(result).teamMembers).toEqual([TEAM_MEMBER_1])
        expect(getState(result).teamState).toEqual(TeamState.ACTIVE)
    })

    it("should set the team member if opening the info page", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN, [TEAM_MEMBER_1], TeamState.ACTIVE)

        expectAllDialogsClosed(result)

        act(() => getInteractions(result).openInfoPage(TEAM_MEMBER_1))

        expect(getState(result).infoPageVm.state.nickname).toEqual(TEAM_MEMBER_1.nickname)
        expect(getState(result).infoPageVm.state.open).toEqual(true)

        act(() => getInteractions(result).closePopups())

        expectAllDialogsClosed(result)
    })

    it("should set the team member if opening the switch remove dialog", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN, [TEAM_MEMBER_1], TeamState.ACTIVE)

        expectAllDialogsClosed(result)

        act(() => getInteractions(result).openTeamMemberSwitchDialog(TEAM_MEMBER_1))

        expect(getState(result).teamMemberSwitchDialogVm.state.teamMember).toEqual(TEAM_MEMBER_1)
        expect(getState(result).teamMemberSwitchDialogVm.state.open).toEqual(true)
        expect(getState(result).teamMemberSwitchDialogVm.state.mode).toEqual(SwitchType.REMOVE)

        act(() => getInteractions(result).closePopups())

        expectAllDialogsClosed(result)
    })

    it("should set the team member if opening the switch add dialog", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN, [TEAM_MEMBER_3], TeamState.BOXED)

        expectAllDialogsClosed(result)

        act(() => getInteractions(result).openTeamMemberSwitchDialog(TEAM_MEMBER_3))

        expect(getState(result).teamMemberSwitchDialogVm.state.teamMember).toEqual(TEAM_MEMBER_3)
        expect(getState(result).teamMemberSwitchDialogVm.state.open).toEqual(true)
        expect(getState(result).teamMemberSwitchDialogVm.state.mode).toEqual(SwitchType.ADD)

        act(() => getInteractions(result).closePopups())

        expectAllDialogsClosed(result)
    })

    it("should not allow dead team members to switch", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN, [TEAM_MEMBER_2], TeamState.DEAD)
        expectAllDialogsClosed(result)
        act(() => getInteractions(result).openTeamMemberSwitchDialog(TEAM_MEMBER_2))
        expectAllDialogsClosed(result)
    })
})