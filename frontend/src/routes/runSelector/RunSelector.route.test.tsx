import {runsApi} from "../../data/runs/runs.api";
import {EMPTY, of} from "rxjs";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_2_TO, NUZLOCKE_RUN_TO} from "../../data/runs/runs.testconstants";
import {gamesApi} from "../../data/games/games.api";
import {GAMES_TO} from "../../data/games/games.testconstants";
import {rulesApi} from "../../data/rules/rules.api";
import {RULES_DETAILS, RULES_DETAILS_TO} from "../../data/rules/rules.testconstants";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {RunSelectorRoute} from "./RunSelector.route";
import * as router from 'react-router'
import userEvent from "@testing-library/user-event";
import {NuzlockeRunCreatorTO} from "../../data/runs/runs.transfer";
import {runsRepository} from "../../data/runs/runs.repository";

describe("RunSelectorRoute", () => {

    const notify = jest.fn()
    const navigate = jest.fn()

    beforeEach(() => {
        jest.spyOn(runsApi, "getRuns$").mockReturnValue(of([NUZLOCKE_RUN_TO]))
        jest.spyOn(runsApi, "postRun$").mockReturnValue(of(NUZLOCKE_RUN_2_TO))
        jest.spyOn(runsApi, "deleteRun$").mockReturnValue(EMPTY)
        jest.spyOn(gamesApi, "getGames$").mockReturnValue(of(GAMES_TO))
        jest.spyOn(rulesApi, "getRulesDetails$").mockReturnValue(of(RULES_DETAILS_TO))
        jest.spyOn(router, "useNavigate").mockReturnValue(navigate)
    })

    afterEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
        runsRepository.clear()
    })

    function renderRoute() {
        render(<RunSelectorRoute notify={notify}/>)
    }

    it("should test creating a new nuzlocke run, deleting a run and selecting a run", (done) => {
        renderRoute()

        expect(screen.getAllByTestId("run-title").length).toEqual(1)

        const openButton = screen.getByTestId("open-create-button")
        act(() => {
            userEvent.click(openButton)
        })

        const nameInput = screen.getByTestId("name-input")
        const createButton = screen.getByTestId("create-button")
        const gameInput = screen.getByTestId("game-input")
        const customRulesInput = screen.getByTestId("custom-rules-input")

        fireEvent.focus(gameInput)
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "Enter"})

        fireEvent.change(within(nameInput).getByRole("textbox"), {target: {value: "MyRun"}})
        fireEvent.change(within(customRulesInput).getByRole("textbox"), {target: {value: "XYZ\nABC"}})

        userEvent.click(createButton)

        const expected: NuzlockeRunCreatorTO = {
            customRules: ["XYZ", "ABC"],
            game: GAMES_TO[1].key,
            name: "MyRun",
            rules: RULES_DETAILS.defaultRules
        }
        expect(runsApi.postRun$).toHaveBeenCalledTimes(1)
        expect(runsApi.postRun$).toHaveBeenCalledWith(expected)

        expect(screen.getAllByTestId("run-title").length).toEqual(2)

        done()
    })
    it("should test deleting a nuzlocke run", (done) => {
        renderRoute()

        expect(screen.getAllByTestId("run-title").length).toEqual(1)

        const openDeleteButton = screen.getByTestId("open-delete-button")
        userEvent.click(openDeleteButton)

        const deleteButton = screen.getByTestId("delete-button")
        userEvent.click(deleteButton)

        expect(runsApi.deleteRun$).toHaveBeenCalledWith(NUZLOCKE_RUN.id)
        expect(runsApi.deleteRun$).toHaveBeenCalledTimes(1)
        done()
    })
    it("should test selecting a nuzlocke run", (done) => {
        renderRoute()

        const selectButton = screen.getByTestId("select-button")
        userEvent.click(selectButton)

        expect(navigate).toHaveBeenCalledTimes(1)
        done()
    })
})