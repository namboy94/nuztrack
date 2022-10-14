import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {of} from "rxjs";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {teamService} from "../../../../data/team/team.service";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../../data/team/team.testconstants";
import {gamesService} from "../../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {getInteractions, getState} from "../../../../util/viewmodel";
import {TeamMemberEventViewModel, useTeamMemberEventViewModel} from "./TeamMemberEvent.vm";

export function createMocksForTeamMemberEventViewModel() {
    jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
    jest.spyOn(teamService, "getActiveTeamMembers$").mockReturnValue(of([TEAM_MEMBER_1]))
    jest.spyOn(teamService, "getBoxedTeamMembers$").mockReturnValue(of([TEAM_MEMBER_3]))
    jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
}

describe("useTeamMemberEventViewModel", () => {
    const notify = jest.fn()
    const extraReset = jest.fn()

    function createMocksAndRender(): { current: TeamMemberEventViewModel } {
        createMocksForTeamMemberEventViewModel()
        return renderHook(() => useTeamMemberEventViewModel(NUZLOCKE_RUN, notify, extraReset)).result
    }

    function fillFields(hookResult: { current: TeamMemberEventViewModel }) {
        const interactions = getInteractions(hookResult)
        act(() => {
            interactions.onChangeLocation("LOCATION")
            interactions.onChangeTeamMember(TEAM_MEMBER_1)
            interactions.onChangeLevel(16)
        })
    }

    it("should test loading the data", () => {
        const result = createMocksAndRender()

        expect(getState(result).pokedex).toEqual(POKEDEX)
        expect(getState(result).activeTeamMembers).toEqual([TEAM_MEMBER_1])
        expect(getState(result).boxedTeamMembers).toEqual([TEAM_MEMBER_3])
        expect(getState(result).locations).toEqual(LOCATION_REGISTRY.getLocationNames())

        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(teamService.getActiveTeamMembers$).toHaveBeenCalledTimes(1)
        expect(teamService.getBoxedTeamMembers$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
    })

    it("should reset if closed", () => {
        const result = createMocksAndRender()
        fillFields(result)

        act(getInteractions(result).closeDialog)

        expect(getState(result).open).toEqual(false)
        expect(getState(result).location).toEqual("")
        expect(getState(result).teamMember).toEqual(null)
        expect(getState(result).level).toEqual(5)
    })

    it("should reset level if team member is switched", () => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)

        act(() => getInteractions(result).onChangeTeamMember(TEAM_MEMBER_3))

        expect(getState(result).level).toEqual(TEAM_MEMBER_3.level)
    })
})