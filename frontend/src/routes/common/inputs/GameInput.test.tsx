import {fireEvent, render, screen, within} from "@testing-library/react";
import {GameInput} from "./GameInput";
import {GAME_1, GAMES} from "../../../data/games/games.testconstants";

describe("GameInput", () => {

    const onChange = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function renderComponent() {
        return render(<GameInput onChange={onChange} allGames={GAMES} game={GAME_1}/>)
    }

    function getInput(): HTMLElement {
        return screen.getByTestId("game-input")
    }

    function getInputCombobox(): HTMLElement {
        return within(getInput()).getByRole("combobox")
    }

    it("should display the selected game's title", () => {
        renderComponent()
        expect(getInputCombobox().getAttribute("value")).toEqual(GAME_1.title)
    })

    it("should add all options to the dropdown menu", () => {
        renderComponent()
        const gameInput = getInput()

        for (let i = 1; i < GAMES.length; i++) {
            for (let down = 0; down < i + 1; down++) {
                fireEvent.keyDown(gameInput, {key: "ArrowDown"})
            }
            fireEvent.keyDown(gameInput, {key: "Enter"})
            expect(onChange).toHaveBeenLastCalledWith(GAMES[i])
        }
    })

    it("should call onChange if another game from the dropdown is selected", () => {
        renderComponent()

        const gameInput = getInput()
        gameInput.focus()

        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "Enter"})

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith(GAMES[3])
    })
})