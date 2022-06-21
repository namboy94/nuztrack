import {eventsService} from "../../../data/events/events.service";
import {EMPTY} from "rxjs";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";
import {renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {useEventLogDataLoader} from "./EventLog.data.hook";

describe("useEventLogDataLoader", () => {
    it("should load the data", (done) => {
        jest.spyOn(eventsService, "loadEvents$").mockReturnValue(EMPTY)
        jest.spyOn(pokedexService, "loadPokedexData$").mockReturnValue(EMPTY)
        jest.spyOn(gamesService, "loadGameLocations$").mockReturnValue(EMPTY)
        jest.spyOn(teamService, "loadTeam$").mockReturnValue(EMPTY)

        const result = renderHook(() => useEventLogDataLoader(NUZLOCKE_RUN)).result.current

        expect(result).toBeFalsy()
        expect(eventsService.loadEvents$).toHaveBeenCalledTimes(1)
        expect(eventsService.loadEvents$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)
        expect(pokedexService.loadPokedexData$).toHaveBeenCalledTimes(1)
        expect(gamesService.loadGameLocations$).toHaveBeenCalledTimes(1)
        expect(gamesService.loadGameLocations$).toHaveBeenCalledWith(NUZLOCKE_RUN.game)
        expect(teamService.loadTeam$).toHaveBeenCalledTimes(1)
        expect(teamService.loadTeam$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)
        done()
    })
})