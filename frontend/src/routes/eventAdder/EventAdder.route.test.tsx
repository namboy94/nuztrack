import {of} from "rxjs";
import {NUZLOCKE_RUN} from "../../data/runs/runs.testconstants";
import {gamesApi} from "../../data/games/games.api";
import * as router from "react-router";
import {GAME_LOCATIONS_TO} from "../../data/games/games.testconstants";
import {render} from "@testing-library/react";
import {EventAdderRoute} from "./EventAdder.route";

describe("EventAdderRoute", () => {

    const notify = jest.fn()
    const navigate = jest.fn()

    beforeEach(() => {
        jest.spyOn(gamesApi, "getGameLocations$").mockReturnValue(of(GAME_LOCATIONS_TO))
        jest.spyOn(router, "useNavigate").mockReturnValue(navigate)
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
    })

    function renderRoute() {
        render(<EventAdderRoute notify={notify} run={NUZLOCKE_RUN}/>)
    }

    it("should TODO", (done) => {
        renderRoute()
        //TODO
        done()
    })
})