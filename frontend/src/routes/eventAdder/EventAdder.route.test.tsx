import {EMPTY} from "rxjs";
import {NUZLOCKE_RUN} from "../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import {EventAdderRoute} from "./EventAdder.route";
import {eventsService} from "../../data/events/events.service";
import {pokedexService} from "../../data/pokedex/pokedex.service";
import {gamesService} from "../../data/games/games.service";
import {teamService} from "../../data/team/team.service";

describe("EventAdderRoute", () => {

    const notify = jest.fn()

    beforeEach(() => {
        jest.spyOn(eventsService, "loadEvents$").mockReturnValue(EMPTY)
        jest.spyOn(pokedexService, "loadPokedexData$").mockReturnValue(EMPTY)
        jest.spyOn(pokedexService, "loadNatures$").mockReturnValue(EMPTY)
        jest.spyOn(gamesService, "loadGameLocations$").mockReturnValue(EMPTY)
        jest.spyOn(teamService, "loadTeam$").mockReturnValue(EMPTY)
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