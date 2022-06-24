import {eventsService} from "../../../data/events/events.service";
import {of} from "rxjs";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../data/games/games.service";
import {teamService} from "../../../data/team/team.service";
import {renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {TEAM} from "../../../data/team/team.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {EVENT_LIST} from "../../../data/events/events.testconstants";
import {useEventLogProps} from "./EventLog.hooks";

describe("useEventLogProps", () => {
    it("should load the data", (done) => {
        jest.spyOn(eventsService, "getEvents$").mockReturnValue(of(EVENT_LIST))
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        jest.spyOn(teamService, "getTeam$").mockReturnValue(of(TEAM))

        const result = renderHook(() => useEventLogProps(NUZLOCKE_RUN)).result.current

        expect(result.events).toEqual(EVENT_LIST)
        expect(result.pokedex).toEqual(POKEDEX)
        expect(result.team).toEqual(TEAM)
        expect(result.locationRegistry).toEqual(LOCATION_REGISTRY)

        expect(eventsService.getEvents$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
        expect(teamService.getTeam$).toHaveBeenCalledTimes(1)
        done()
    })
})