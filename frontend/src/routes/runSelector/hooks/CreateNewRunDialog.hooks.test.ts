import {act, renderHook} from "@testing-library/react";
import {useCreateNewRunDialogProps} from "./CreateNewRunDialog.hooks";
import {CreateNewRunDialogProps} from "../components/CreateNewRunDialog";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_CREATOR} from "../../../data/runs/runs.testconstants";
import {runsService} from "../../../data/runs/runs.service";
import {of, throwError} from "rxjs";
import {gamesService} from "../../../data/games/games.service";
import {GAME_4, GAMES} from "../../../data/games/games.testconstants";
import {rulesService} from "../../../data/rules/rules.service";
import {RULES_DETAILS} from "../../../data/rules/rules.testconstants";

describe("useCreateNewRunDialogProps", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: [(() => void), CreateNewRunDialogProps] } {
        jest.spyOn(gamesService, "getGames$").mockReturnValue(of(GAMES))
        jest.spyOn(rulesService, "getRulesDetails$").mockReturnValue(of(RULES_DETAILS))
        return renderHook(() => useCreateNewRunDialogProps(notify)).result
    }

    it("should test the data loading", (done) => {
        const props = createMocksAndRender().current[1]
        expect(props.games).toEqual(GAMES)
        expect(props.rulesDetails).toEqual(RULES_DETAILS)
        expect(gamesService.getGames$).toHaveBeenCalledTimes(1)
        expect(rulesService.getRulesDetails$).toHaveBeenCalledTimes(1)
        done()
    })

    it("should test opening the dialog", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        expect(props.open).toBeFalsy()

        act(() => openFn())

        props = result.current[1]
        expect(props.open).toBeTruthy()

        done()
    })
    it("should test closing the dialog", (done) => {
        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn()
            props.state.setName("TEST")
        })
        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.state.name).toEqual("TEST")

        act(() => props.onClose())
        props = result.current[1]
        expect(props.open).toBeFalsy()
        expect(props.state.name).toEqual("")

        done()
    })
    it("should test resetting state", (done) => {
        const result = createMocksAndRender()
        let props = result.current[1]

        act(() => {
            props.state.setName("TEST")
            props.state.setGame(GAME_4)
            props.state.setRules(["ABC"])
            props.state.setCustomRules(["XYZ"])
        })
        props = result.current[1]
        expect(props.state.name).toEqual("TEST")
        expect(props.state.game).toEqual(GAME_4)
        expect(props.state.rules).toEqual(["ABC"])
        expect(props.state.customRules).toEqual(["XYZ"])

        act(() => props.state.reset())
        props = result.current[1]
        expect(props.state.name).toEqual("")
        expect(props.state.game).toEqual(GAMES[0])
        expect(props.state.rules).toEqual(RULES_DETAILS.defaultRules)
        expect(props.state.customRules).toEqual([])

        done()
    })
    it("should test submitting successfully", (done) => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(of(NUZLOCKE_RUN))

        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn()
            props.state.setName(NUZLOCKE_RUN_CREATOR.name)
            props.state.setGame(NUZLOCKE_RUN_CREATOR.game)
            props.state.setRules(NUZLOCKE_RUN_CREATOR.rules)
            props.state.setCustomRules(NUZLOCKE_RUN_CREATOR.customRules)
        })
        props = result.current[1]
        expect(props.open).toBeTruthy()
        expect(props.state.name).toEqual(NUZLOCKE_RUN_CREATOR.name)
        expect(props.state.game).toEqual(NUZLOCKE_RUN_CREATOR.game)
        expect(props.state.rules).toEqual(NUZLOCKE_RUN_CREATOR.rules)
        expect(props.state.customRules).toEqual(NUZLOCKE_RUN_CREATOR.customRules)

        act(() => props.submit())
        props = result.current[1]

        expect(props.open).toBeFalsy()
        expect(props.state.name).toEqual("")
        expect(props.state.game).toEqual(GAMES[0])
        expect(props.state.rules).toEqual(RULES_DETAILS.defaultRules)
        expect(props.state.customRules).toEqual([])

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(runsService.addRun$).toHaveBeenCalledWith(NUZLOCKE_RUN_CREATOR)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })

    it("should test submitting unsuccessfully", (done) => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(throwError(() => {
        }))

        const result = createMocksAndRender()
        let [openFn, props] = result.current

        act(() => {
            openFn()
        })
        props = result.current[1]
        expect(props.open).toBeTruthy()

        act(() => props.submit())
        props = result.current[1]

        expect(props.open).toBeTruthy()

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "error")
        done()
    })

    it("should not submit twice", (done) => {
        jest.spyOn(runsService, "addRun$").mockReturnValue(of(NUZLOCKE_RUN))

        const result = createMocksAndRender()
        let props = result.current[1]

        act(() => {
            props.state.setName(NUZLOCKE_RUN_CREATOR.name)
            props.state.setGame(NUZLOCKE_RUN_CREATOR.game)
            props.state.setRules(NUZLOCKE_RUN_CREATOR.rules)
            props.state.setCustomRules(NUZLOCKE_RUN_CREATOR.customRules)
        })
        props = result.current[1]

        act(() => props.submit())
        props = result.current[1]

        act(() => props.submit())
        props = result.current[1]

        expect(runsService.addRun$).toHaveBeenCalledTimes(1)
        expect(runsService.addRun$).toHaveBeenCalledWith(NUZLOCKE_RUN_CREATOR)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        done()
    })

    it("should be initialized correctly", (done) => {
        jest.spyOn(gamesService, "getGames$").mockReturnValue(of(undefined))
        jest.spyOn(rulesService, "getRulesDetails$").mockReturnValue(of(undefined))
        let props = renderHook(() => useCreateNewRunDialogProps(notify)).result.current[1]
        expect(props.state.game).toEqual({"generation": 1, "key": "RED", "title": "Red"})
        expect(props.state.rules).toEqual([])

        jest.spyOn(gamesService, "getGames$").mockReturnValue(of(GAMES))
        jest.spyOn(rulesService, "getRulesDetails$").mockReturnValue(of(RULES_DETAILS))
        props = renderHook(() => useCreateNewRunDialogProps(notify)).result.current[1]
        expect(props.state.game).toEqual(GAMES[0])
        expect(props.state.rules).toEqual(RULES_DETAILS.defaultRules)

        done()
    })

})