import {of} from "rxjs";
import {pokedexApi} from "../../data/pokedex/pokedex.api";
import {POKEDEX_TO} from "../../data/pokedex/pokedex.testconstants";
import {gamesApi} from "../../data/games/games.api";
import {GAME_LOCATIONS_TO} from "../../data/games/games.testconstants";
import {teamApi} from "../../data/team/team.api";
import {TEAM, TEAM_TO} from "../../data/team/team.testconstants";
import {render, screen} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../data/runs/runs.testconstants";
import {TeamRoute} from "./TeamRoute";

describe("TeamRoute", () => {

    const notify = jest.fn()

    beforeEach(() => {
        jest.spyOn(pokedexApi, "getPokedex$").mockReturnValue(of(POKEDEX_TO))
        jest.spyOn(gamesApi, "getGameLocations$").mockReturnValue(of(GAME_LOCATIONS_TO))
        jest.spyOn(teamApi, "getTeam$").mockReturnValue(of(TEAM_TO))
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
    })

    function renderRoute() {
        render(<TeamRoute notify={notify} run={NUZLOCKE_RUN}/>)
    }

    it("should load all Pokemon", () => {
        renderRoute()
        expect(screen.getAllByTestId("pokemon-card").length).toEqual(TEAM.getTeamMembers().length)
    })

})