import {render, screen, within} from "@testing-library/react";
import {CreateNewRunDialog} from "./CreateNewRunDialog";
import {GAMES} from "../../../data/games/games.testconstants";
import {RULES_DETAILS} from "../../../data/rules/rules.testconstants";
import {CreateNewRunDialogInteractions, CreateNewRunDialogState} from "../hooks/CreateNewRunDialog.hooks";

describe("CreateNewRunDialog", () => {

    const open = jest.fn()
    const onClose = jest.fn()
    const submit = jest.fn()
    const onChangeName = jest.fn()
    const onChangeGame = jest.fn()
    const toggleRule = jest.fn()
    const onChangeCustomRules = jest.fn()

    function renderComponent(loading: boolean = false) {
        const state: CreateNewRunDialogState = {
            customRules: ["MyCustomRule1", "MyCustomRule2"],
            game: GAMES[0],
            name: "MyName",
            rules: RULES_DETAILS.defaultRules,
            open: true,
            allGames: GAMES,
            rulesDetails: RULES_DETAILS,
            loading: loading
        }
        const interactions: CreateNewRunDialogInteractions = {
            open: open,
            onClose: onClose,
            submit: submit,
            onChangeName: onChangeName,
            onChangeGame: onChangeGame,
            onChangeCustomRules: onChangeCustomRules,
            toggleRule: toggleRule,
        }
        render(<CreateNewRunDialog state={state} interactions={interactions}/>)
    }

    it("should render the component", (done) => {
        renderComponent()

        const nameInput = screen.getByTestId("name-input")
        const gameInput = screen.getByTestId("game-input")
        const ruleInputs = screen.getAllByTestId("multi-checkbox-input")
        const customRulesInput = screen.getByTestId("freeform-list-input")
        const createButton = screen.getByTestId("submit-button")
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

    it("should not render if data is not loaded yet", (done) => {
        renderComponent(true)
        expect(screen.queryByTestId("create-button")).not.toBeInTheDocument()
        done()
    })
})
