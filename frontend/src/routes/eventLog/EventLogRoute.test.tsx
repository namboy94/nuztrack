import {of} from "rxjs";
import {EVENT_LOG_TO} from "../../data/events/events.testconstants";
import {POKEDEX_TO} from "../../data/pokedex/pokedex.testconstants";
import {GAME_LOCATIONS_TO} from "../../data/games/games.testconstants";
import {TEAM_TO} from "../../data/team/team.testconstants";
import {eventsApi} from "../../data/events/events.api";
import {pokedexApi} from "../../data/pokedex/pokedex.api";
import {gamesApi} from "../../data/games/games.api";
import {teamApi} from "../../data/team/team.api";
import {render, screen} from "@testing-library/react";
import {EventLogRoute} from "./EventLogRoute";
import {NUZLOCKE_RUN} from "../../data/runs/runs.testconstants";

describe("EventLogRoute", () => {

    const notify = jest.fn()

    function renderRoute() {
        jest.spyOn(eventsApi, "getEvents$").mockReturnValue(of(EVENT_LOG_TO))
        jest.spyOn(pokedexApi, "getPokedex$").mockReturnValue(of(POKEDEX_TO))
        jest.spyOn(gamesApi, "getGameLocations$").mockReturnValue(of(GAME_LOCATIONS_TO))
        jest.spyOn(teamApi, "getTeam$").mockReturnValue(of(TEAM_TO))
        render(<EventLogRoute notify={notify} run={NUZLOCKE_RUN}/>)
    }

    it("should display events", () => {
        renderRoute()
        expect(screen.getByTestId("event-log-list")).toBeInTheDocument()
    })

})