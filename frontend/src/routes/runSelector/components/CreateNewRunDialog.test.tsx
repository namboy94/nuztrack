import {render} from "@testing-library/react";
import {CreateNewRunDialog, CreateNewRunDialogProps, CreateNewRunDialogState} from "./CreateNewRunDialog";
import {GAME_LIST} from "../../../data/games/games.testconstants";
import {RULES_DETAILS} from "../../../data/rules/rules.testconstants";

describe("CreateNewRunDialog", () => {

    const onClose = jest.fn()
    const submit = jest.fn()
    const setName = jest.fn()
    const setGame = jest.fn()
    const setRules = jest.fn()
    const setCustomRules = jest.fn()
    const reset = jest.fn()

    function renderComponent() {
        const state: CreateNewRunDialogState = {
            customRules: [],
            game: "",
            name: "",
            rules: [],
            setRules: setRules,
            setName: setName,
            setCustomRules: setCustomRules,
            setGame: setGame,
            reset: reset
        }
        const props: CreateNewRunDialogProps = {
            gameList: GAME_LIST,
            open: true,
            rulesDetails: RULES_DETAILS,
            state: state,
            onClose: onClose,
            submit: submit
        }
        render(<CreateNewRunDialog {...props} />)
    }

    it("should render the component", (done) => {

    })
})