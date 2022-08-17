import {act, renderHook} from "@testing-library/react";
import {CreateNewRunDialogViewModel, useCreateNewRunDialogViewModel} from "./CreateNewRunDialog.hooks";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../data/games/games.service";
import {GAME_4, GAMES} from "../../../data/games/games.testconstants";
import {rulesService} from "../../../data/rules/rules.service";
import {RULES_DETAILS} from "../../../data/rules/rules.testconstants";
import {getInteractions, getState} from "../../../util/viewmodel";
import {runsService} from "../../../data/runs/runs.service";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_CREATOR} from "../../../data/runs/runs.testconstants";
import {DEFAULT_GAME} from "../../../data/games/games.model";

describe("useCreateNewRunDialogProps", () => {

    const notify = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function createMocksAndRender(): { current: CreateNewRunDialogViewModel } {
        jest.spyOn(gamesService, "getGames$").mockReturnValue(of(GAMES))
        jest.spyOn(rulesService, "getRulesDetails$").mockReturnValue(of(RULES_DETAILS))
        return renderHook(() => useCreateNewRunDialogViewModel(notify)).result
    }

    it("should test the data loading", () => {
        const state = getState(createMocksAndRender())
        expect(state.allGames).toEqual(GAMES)
        expect(state.rulesOptions).toEqual(RULES_DETAILS.rules)
        expect(state.loading).toBeFalsy()
        expect(gamesService.getGames$).toHaveBeenCalledTimes(1)
        expect(rulesService.getRulesDetails$).toHaveBeenCalledTimes(1)
    })

    it("should test opening the dialog", () => {
        const result = createMocksAndRender()

        expect(getState(result).open).toBeFalsy()
        act(getInteractions(result).open)
        expect(getState(result).open).toBeTruthy()
    })
    it("should test closing the dialog", () => {
        const result = createMocksAndRender()
        act(() => {
            getInteractions(result).open()
            getInteractions(result).onChangeName("TEST")
        })
        expect(getState(result).open).toBeTruthy()
        expect(getState(result).name).toEqual("TEST")

        act(() => getInteractions(result).onClose())

        expect(getState(result).open).toBeFalsy()
        expect(getState(result).name).toEqual("")
    })
    it("should test resetting state", () => {
        const result = createMocksAndRender()

        act(() => {
            getInteractions(result).onChangeName("TEST")
            getInteractions(result).onChangeGame(GAME_4)
            getInteractions(result).toggleRule(true, "ABC")
            getInteractions(result).onChangeCustomRules(["XYZ"])
        })

        expect(getState(result).name).toEqual("TEST")
        expect(getState(result).game).toEqual(GAME_4)
        expect(getState(result).rules).toEqual([...RULES_DETAILS.defaultRules, "ABC"])
        expect(getState(result).customRules).toEqual(["XYZ"])

        act(() => getInteractions(result).onClose())

        expect(getState(result).name).toEqual("")
        expect(getState(result).game).toEqual(DEFAULT_GAME)
        expect(getState(result).rules).toEqual(RULES_DETAILS.defaultRules)
        expect(getState(result).customRules).toEqual([])
    })
    it("should test submitting successfully", () => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(of(NUZLOCKE_RUN))

        const result = createMocksAndRender()

        RULES_DETAILS.defaultRules.map(ruleKey => act(
            () => getInteractions(result).toggleRule(false, ruleKey)
        ))
        act(() => {
            getInteractions(result).open()
            getInteractions(result).onChangeName(NUZLOCKE_RUN_CREATOR.name)
            getInteractions(result).onChangeGame(NUZLOCKE_RUN_CREATOR.game)
            NUZLOCKE_RUN_CREATOR.rules.map(ruleKey => getInteractions(result).toggleRule(true, ruleKey))
            getInteractions(result).onChangeCustomRules(NUZLOCKE_RUN_CREATOR.customRules)
        })

        expect(getState(result).open).toBeTruthy()
        expect(getState(result).name).toEqual(NUZLOCKE_RUN_CREATOR.name)
        expect(getState(result).game).toEqual(NUZLOCKE_RUN_CREATOR.game)
        expect(getState(result).rules).toEqual(NUZLOCKE_RUN_CREATOR.rules)
        expect(getState(result).customRules).toEqual(NUZLOCKE_RUN_CREATOR.customRules)

        act(() => getInteractions(result).submit())

        expect(getState(result).open).toBeFalsy()
        expect(getState(result).name).toEqual("")
        expect(getState(result).game).toEqual(DEFAULT_GAME)
        expect(getState(result).rules).toEqual(RULES_DETAILS.defaultRules)
        expect(getState(result).customRules).toEqual([])

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(runsService.addRun$).toHaveBeenCalledWith(NUZLOCKE_RUN_CREATOR)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
    })

    it("should test submitting unsuccessfully", () => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))

        const result = createMocksAndRender()

        act(() => {
            getInteractions(result).open()
            getInteractions(result).submit()
        })

        expect(getState(result).open).toBeTruthy()
        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to create Nuzlocke Run: 'TEST'", "error")
    })

    it("should not submit twice", () => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(of(NUZLOCKE_RUN))

        const result = createMocksAndRender()

        RULES_DETAILS.defaultRules.map(ruleKey => act(
            () => getInteractions(result).toggleRule(false, ruleKey)
        ))

        act(() => {
            getInteractions(result).onChangeName(NUZLOCKE_RUN_CREATOR.name)
            getInteractions(result).onChangeGame(NUZLOCKE_RUN_CREATOR.game)
            NUZLOCKE_RUN_CREATOR.rules.map(ruleKey => getInteractions(result).toggleRule(true, ruleKey))
            getInteractions(result).onChangeCustomRules(NUZLOCKE_RUN_CREATOR.customRules)
        })

        act(() => getInteractions(result).submit())
        act(() => getInteractions(result).submit())

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(runsService.addRun$).toHaveBeenCalledWith(NUZLOCKE_RUN_CREATOR)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
    })

    it("should be initialized correctly", () => {
        jest.spyOn(gamesService, "getGames$").mockReturnValue(of(undefined))
        jest.spyOn(rulesService, "getRulesDetails$").mockReturnValue(of(undefined))
        let result = renderHook(() => useCreateNewRunDialogViewModel(notify)).result
        expect(getState(result).game).toEqual(DEFAULT_GAME)
        expect(getState(result).rules).toEqual([])

        jest.spyOn(gamesService, "getGames$").mockReturnValue(of(GAMES))
        jest.spyOn(rulesService, "getRulesDetails$").mockReturnValue(of(RULES_DETAILS))
        result = renderHook(() => useCreateNewRunDialogViewModel(notify)).result
        expect(getState(result).game).toEqual(DEFAULT_GAME)
        expect(getState(result).rules).toEqual(RULES_DETAILS.defaultRules)
    })
})