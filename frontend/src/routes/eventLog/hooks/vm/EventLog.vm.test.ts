import {eventsService} from "../../../../data/events/events.service";
import {of} from "rxjs";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {gamesService} from "../../../../data/games/games.service";
import {teamService} from "../../../../data/team/team.service";
import {renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {TEAM} from "../../../../data/team/team.testconstants";
import {LOCATION_REGISTRY} from "../../../../data/games/games.testconstants";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {EVENT_REGISTRY} from "../../../../data/events/events.testconstants";
import {useEventLogViewModel} from "./EventLog.vm";
import {getState} from "../../../../util/viewmodel";

describe("useEventLogProps", () => {
    it("should load the data", () => {
        jest.spyOn(eventsService, "getEventRegistry$").mockReturnValue(of(EVENT_REGISTRY))
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        jest.spyOn(teamService, "getTeam$").mockReturnValue(of(TEAM))

        const result = renderHook(() => useEventLogViewModel(NUZLOCKE_RUN)).result

        expect(getState(result).eventRegistry).toEqual(EVENT_REGISTRY)
        expect(getState(result).pokedex).toEqual(POKEDEX)
        expect(getState(result).team).toEqual(TEAM)
        expect(getState(result).locationRegistry).toEqual(LOCATION_REGISTRY)

        expect(eventsService.getEventRegistry$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
        expect(teamService.getTeam$).toHaveBeenCalledTimes(1)
    })
})