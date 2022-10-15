import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {of} from "rxjs";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {renderHook} from "@testing-library/react";
import {PokemonGridViewModel, usePokemonGridViewModel} from "./PokemonGrid.vm";
import {teamService} from "../../../../data/team/team.service";
import {TeamMember, TeamState} from "../../../../data/team/team.model";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {TEAM_MEMBER_1} from "../../../../data/team/team.testconstants";
import {getState} from "../../../../util/viewmodel";

describe("TeamMemberGridViewModel", () => {
    const notify = jest.fn()

    function createMocksAndRender(run: NuzlockeRun, team: TeamMember[], state: TeamState): { current: PokemonGridViewModel } {
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(teamService, "getTeamMembersByState$").mockReturnValue(of(team))
        return renderHook(() => usePokemonGridViewModel(run, notify, state)).result
    }

    it("should load the data", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN, [TEAM_MEMBER_1], TeamState.ACTIVE)
        expect(getState(result).teamMembers).toEqual([TEAM_MEMBER_1])
        expect(getState(result).teamState).toEqual(TeamState.ACTIVE)
    })
})