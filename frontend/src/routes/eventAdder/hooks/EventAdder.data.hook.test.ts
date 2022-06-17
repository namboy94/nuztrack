import {eventsService} from "../../../data/events/events.service";
import {EMPTY} from "rxjs";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {renderHook} from "@testing-library/react";
import {useEventAdderDataLoader} from "./EventAdder.data.hook";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";

describe("useEventAdderDataLoader", () => {
    it("should load the data", (done) => {
        jest.spyOn(eventsService, "loadEvents$").mockReturnValue(EMPTY)
        jest.spyOn(pokedexService, "loadPokedexData$").mockReturnValue(EMPTY)
        jest.spyOn(pokedexService, "loadNatures$").mockReturnValue(EMPTY)
        jest.spyOn(gamesService, "loadGameLocations$").mockReturnValue(EMPTY)

        const result = renderHook(() => useEventAdderDataLoader(NUZLOCKE_RUN)).result.current

        expect(result).toBeFalsy()
        expect(eventsService.loadEvents$).toHaveBeenCalledTimes(1)
        expect(eventsService.loadEvents$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)
        expect(pokedexService.loadPokedexData$).toHaveBeenCalledTimes(1)
        expect(pokedexService.loadNatures$).toHaveBeenCalledTimes(1)
        expect(gamesService.loadGameLocations$).toHaveBeenCalledTimes(1)
        expect(gamesService.loadGameLocations$).toHaveBeenCalledWith(NUZLOCKE_RUN.game)
        done()
    })
})