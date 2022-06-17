import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {CreateNewRunDialog, CreateNewRunDialogProps, CreateNewRunDialogState} from "./CreateNewRunDialog";
import {GAMES} from "../../../data/games/games.testconstants";
import {RULES_DETAILS} from "../../../data/rules/rules.testconstants";
import userEvent from "@testing-library/user-event";

describe("CreateNewRunDialog", () => {

    const onClose = jest.fn()
    const submit = jest.fn()
    const setName = jest.fn()
    const setGame = jest.fn()
    const setRules = jest.fn()
    const setCustomRules = jest.fn()
    const reset = jest.fn()

    function renderComponent(notLoaded: boolean = false) {
        const state: CreateNewRunDialogState = {
            customRules: ["MyCustomRule1", "MyCustomRule2"],
            game: GAMES[0],
            name: "MyName",
            rules: RULES_DETAILS.defaultRules,
            setRules: setRules,
            setName: setName,
            setCustomRules: setCustomRules,
            setGame: setGame,
            reset: reset
        }
        const props: CreateNewRunDialogProps = {
            games: GAMES,
            open: true,
            rulesDetails: RULES_DETAILS,
            state: state,
            onClose: onClose,
            submit: submit
        }
        if (notLoaded) {
            props.games = undefined
            props.rulesDetails = undefined
        }
        render(<CreateNewRunDialog {...props} />)
    }

    it("should render the component", (done) => {
        renderComponent()

        const nameInput = screen.getByTestId("name-input")
        const gameInput = screen.getByTestId("game-input")
        const ruleInputs = screen.getAllByTestId("rule-input")
        const customRulesInput = screen.getByTestId("custom-rules-input")
        const createButton = screen.getByTestId("create-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(nameInput).toBeInTheDocument()
        expect(gameInput).toBeInTheDocument()
        expect(customRulesInput).toBeInTheDocument()
        expect(createButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()
        ruleInputs.forEach(ruleInput => expect(ruleInput).toBeInTheDocument())

        const nameText = within(nameInput).getByRole("textbox").getAttribute("value")
        expect(nameText).toEqual("MyName")

        const expectedGame = GAMES[0]
        expect(within(gameInput).getByRole("combobox").getAttribute("value")).toEqual(expectedGame.title)

        expect(ruleInputs.length).toEqual(RULES_DETAILS.rules.size)
        const ruleChecks = ruleInputs.map(ruleInput => within(ruleInput).getByRole("checkbox"))

        for (let i = 0; i < RULES_DETAILS.rules.size; i++) {
            const rule = Array.from(RULES_DETAILS.rules.keys())[i]
            if (RULES_DETAILS.defaultRules.includes(rule)) {
                expect(ruleChecks[i]).toBeChecked()
            } else {
                expect(ruleChecks[i]).not.toBeChecked()
            }
        }

        expect(customRulesInput.textContent).toContain("MyCustomRule1\nMyCustomRule2")

        done()
    })

    it("should test changing the name of the run", async () => {
        renderComponent()

        const nameInput = screen.getByTestId("name-input")
        const nameField = within(nameInput).getByRole("textbox")

        act(() => {
            fireEvent.change(nameField, {target: {value: "NewName"}})
        })

        expect(setName).toHaveBeenCalledTimes(1)
        expect(setName).toHaveBeenCalledWith("NewName")
    })

    it("should test changing the game of the run", (done) => {
        renderComponent()

        const gameInput = screen.getByTestId("game-input")

        gameInput.focus()

        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "ArrowDown"})
        fireEvent.keyDown(gameInput, {key: "Enter"})

        //expect(setGame).toHaveBeenCalledTimes(1)
        expect(setGame).toHaveBeenCalledWith(GAMES[3])

        done()
    })

    it("should test checking rule", (done) => {
        renderComponent()
        const ruleKeys = Array.from(RULES_DETAILS.rules.keys())
        const checked = screen.getAllByTestId("rule-input")[0]

        act(() => {
            fireEvent.click(checked)
        })

        expect(setRules).toHaveBeenCalledTimes(1)
        expect(setRules).toHaveBeenCalledWith(RULES_DETAILS.defaultRules.filter(rule => rule !== ruleKeys[0]))

        done()
    })

    it("should test unchecking rule", (done) => {
        renderComponent()
        const ruleKeys = Array.from(RULES_DETAILS.rules.keys())
        const unChecked = screen.getAllByTestId("rule-input")[ruleKeys.length - 1]

        act(() => {
            fireEvent.click(unChecked)
        })

        expect(setRules).toHaveBeenCalledTimes(1)
        expect(setRules).toHaveBeenCalledWith([...RULES_DETAILS.defaultRules, ruleKeys[ruleKeys.length - 1]])

        done()
    })

    it("should test changing custom rules", (done) => {
        renderComponent()

        const customRulesInput = screen.getByTestId("custom-rules-input")
        const customRulesText = within(customRulesInput).getByRole("textbox")

        act(() => {
            fireEvent.change(customRulesText, {target: {value: "ABC\nXYZ"}})
        })

        expect(setCustomRules).toHaveBeenCalledTimes(1)
        expect(setCustomRules).toHaveBeenCalledWith(["ABC", "XYZ"])

        done()
    })
    it("should not render if data is not loaded yet", (done) => {
        renderComponent(true)
        expect(screen.queryByTestId("create-button")).not.toBeInTheDocument()
        done()
    })
    it("should press the cancel button", (done) => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => userEvent.click(cancelButton))
        expect(onClose).toHaveBeenCalledTimes(1)
        done()
    })
    it("should press the create button", (done) => {
        renderComponent()
        const createButton = screen.getByTestId("create-button")

        act(() => userEvent.click(createButton))
        expect(submit).toHaveBeenCalledTimes(1)
        done()
    })
})