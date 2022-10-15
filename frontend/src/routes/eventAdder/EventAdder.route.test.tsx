import {of} from "rxjs";
import {NUZLOCKE_RUN} from "../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import {EventAdderRoute} from "./EventAdder.route";
import {eventsApi} from "../../data/events/events.api";
import {EVENT_LOG_TO} from "../../data/events/events.testconstants";
import {pokedexApi} from "../../data/pokedex/pokedex.api";
import {NATURES_TO, POKEDEX_TO} from "../../data/pokedex/pokedex.testconstants";
import {gamesApi} from "../../data/games/games.api";
import {GAME_LOCATIONS_TO} from "../../data/games/games.testconstants";
import {teamApi} from "../../data/team/team.api";
import {TEAM_TO} from "../../data/team/team.testconstants";

describe("EventAdderRoute", () => {

    const notify = jest.fn()

    beforeEach(() => {
        jest.spyOn(eventsApi, "getEvents$").mockReturnValue(of(EVENT_LOG_TO))
        jest.spyOn(pokedexApi, "getPokedex$").mockReturnValue(of(POKEDEX_TO))
        jest.spyOn(pokedexApi, "getNatures$").mockReturnValue(of(NATURES_TO))
        jest.spyOn(gamesApi, "getGameLocations$").mockReturnValue(of(GAME_LOCATIONS_TO))
        jest.spyOn(teamApi, "getTeam$").mockReturnValue(of(TEAM_TO))
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
    })

    function renderRoute() {
        render(<EventAdderRoute notify={notify} run={NUZLOCKE_RUN}/>)
    }

    it("should render all buttons", () => {
        renderRoute()

        const buttonNames = [
            "encounter",
            "evolution",
            "death",
            "add-team-member",
            "remove-team-member",
            "note",
            "milestone"
        ]

        buttonNames.forEach((buttonName) => {
            const testId = `${buttonName}-dialog-button`
            const button = screen.getByTestId(testId)
            expect(button).toBeInTheDocument()
            expect(button.textContent?.toLowerCase()).toContain(buttonName.replace(/-/gi, " "))
        })
    })
})