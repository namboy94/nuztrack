import {EMPTY} from "rxjs";
import {renderHook} from "@testing-library/react";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {teamService} from "../../../data/team/team.service";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {useTeamDataLoader} from "./Team.data.hooks";
import {gamesService} from "../../../data/games/games.service";

describe("useTeamDataLoader", () => {
    it("should load the data", () => {
        jest.spyOn(pokedexService, "loadPokedexData$").mockReturnValue(EMPTY)
        jest.spyOn(teamService, "loadTeam$").mockReturnValue(EMPTY)
        jest.spyOn(gamesService, "loadGameLocations$").mockReturnValue(EMPTY)

        const result = renderHook(() => useTeamDataLoader(NUZLOCKE_RUN))
        expect(result.result.current).toEqual(false)

        expect(pokedexService.loadPokedexData$).toHaveBeenCalledTimes(1)
        expect(teamService.loadTeam$).toHaveBeenCalledTimes(1)
        expect(teamService.loadTeam$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)
        expect(gamesService.loadGameLocations$).toHaveBeenCalledWith(NUZLOCKE_RUN.game)
        expect(gamesService.loadGameLocations$).toHaveBeenCalledTimes(1)
    })
})