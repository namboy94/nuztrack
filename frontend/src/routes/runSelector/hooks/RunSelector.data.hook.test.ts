import {runsService} from "../../../data/runs/runs.service";
import {EMPTY} from "rxjs";
import {rulesService} from "../../../data/rules/rules.service";
import {gamesService} from "../../../data/games/games.service";
import {renderHook} from "@testing-library/react";
import {useRunSelectorDataLoader} from "./RunSelector.data.hook";

describe("useRunSelectorDataLoader", () => {
    it("should load the data", (done) => {
        const loadRunsMock = jest.spyOn(runsService, "loadRuns$").mockReturnValue(EMPTY)
        const loadRulesMock = jest.spyOn(rulesService, "loadRulesDetails$").mockReturnValue(EMPTY)
        const loadGamesMock = jest.spyOn(gamesService, "loadGameList$").mockReturnValue(EMPTY)

        const result = renderHook(useRunSelectorDataLoader)
        expect(result.result.current).toEqual(false)
        expect(loadRunsMock).toHaveBeenCalledTimes(1)
        expect(loadRulesMock).toHaveBeenCalledTimes(1)
        expect(loadGamesMock).toHaveBeenCalledTimes(1)
        done()

    })
})