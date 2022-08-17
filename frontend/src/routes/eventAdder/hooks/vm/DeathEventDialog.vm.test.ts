import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {of, throwError} from "rxjs";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {teamService} from "../../../../data/team/team.service";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../../data/team/team.testconstants";
import {gamesService} from "../../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {DeathEventDialogViewModel, useDeathEventDialogViewModel} from "./DeathEventDialog.vm";
import {eventsService} from "../../../../data/events/events.service";
import {DEATH_EVENT} from "../../../../data/events/events.testconstants";
import {CreateDeathEvent} from "../../../../data/events/events.model";
import {getInteractions, getState} from "../../../../util/viewmodel";

describe("useDeathEventDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: DeathEventDialogViewModel } {
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(teamService, "getActiveTeamMembers$").mockReturnValue(of([TEAM_MEMBER_1]))
        jest.spyOn(teamService, "getBoxedTeamMembers$").mockReturnValue(of([TEAM_MEMBER_3]))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
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
    it("should reset level if team member is switched", (done) => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)

        act(() => getInteractions(result).onChangeTeamMember(TEAM_MEMBER_3))

        expect(getState(result).level).toEqual(TEAM_MEMBER_3.level)

        done()
    })
    it("should submit successfully", (done) => {
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
        done()
    })
    it("should submit unsuccessfully", (done) => {
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
        done()
    })
})