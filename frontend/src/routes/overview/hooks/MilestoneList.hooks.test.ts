import {of} from "rxjs";
import {gamesService} from "../../../data/games/games.service";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {renderHook} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {MilestoneListProps} from "../components/MilestoneList";
import {eventsService} from "../../../data/events/events.service";
import {MILESTONE_EVENT} from "../../../data/events/events.testconstants";
import {useMilestoneListProps} from "./MilestoneList.hooks";

type PropsGetter = () => MilestoneListProps

describe("useMilestoneListProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): PropsGetter {
        jest.spyOn(eventsService, "getMilestoneEvents$").mockReturnValue(of([MILESTONE_EVENT]))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        const result = renderHook(() => useMilestoneListProps(NUZLOCKE_RUN, notify)).result
        return () => result.current
    }

    it("should load the necessary data", (done) => {
        done()
    })
})