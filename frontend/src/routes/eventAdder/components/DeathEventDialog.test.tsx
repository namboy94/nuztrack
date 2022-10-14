import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {fireEvent, render, screen, within} from "@testing-library/react";
import {DeathEventDialog} from "./DeathEventDialog";
import {DeathEventDialogViewModel} from "../hooks/vm/DeathEventDialog.vm";

describe("DeathEventDialog", () => {
    const onChangeLocation = jest.fn()
    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()
    const onChangeOpponent = jest.fn()
    const onChangeDescription = jest.fn()
    const onChangeTeamMember = jest.fn()
    const onChangeLevel = jest.fn()

    function renderComponent(): DeathEventDialogViewModel {
        const vm: DeathEventDialogViewModel = {
            state: {
                open: true,
                pokedex: POKEDEX,
                locations: LOCATION_REGISTRY.getLocationNames(),
                activeTeamMembers: [TEAM_MEMBER_1],
                boxedTeamMembers: [TEAM_MEMBER_3],
                location: "Location",
                level: 16,
                teamMember: TEAM_MEMBER_1,
                opponent: "OPPO",
                description: "DESC"
            },
            interactions: {
                onChangeTeamMember: onChangeTeamMember,
                closeDialog: closeDialog,
                openDialog: openDialog,
                onChangeDescription: onChangeDescription,
                onChangeLevel: onChangeLevel,
                onChangeOpponent: onChangeOpponent,
                onChangeLocation: onChangeLocation,
                submit: submit
            }
        }
        render(<DeathEventDialog {...vm} />)
        return vm
    }

    it("should render all components correctly", () => {
        const props = renderComponent()

        const locationInput = screen.getByTestId("location-input")
        const teamMemberInput = screen.getByTestId("team-member-input")
        const levelInput = screen.getByTestId("level-input")
        const opponentInput = screen.getByTestId("opponent-input")
        const descriptionInput = screen.getByTestId("description-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(locationInput).toBeInTheDocument()
        expect(teamMemberInput).toBeInTheDocument()
        expect(levelInput).toBeInTheDocument()
        expect(opponentInput).toBeInTheDocument()
        expect(descriptionInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.location)
        expect(within(teamMemberInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.teamMember!!.nickname)
        expect(within(levelInput).getByRole("spinbutton").getAttribute("value"))
            .toEqual("16")
        expect(within(descriptionInput).getByRole("textbox").getAttribute("value"))
            .toEqual(props.state.description)
        expect(within(opponentInput).getByRole("textbox").textContent).toEqual(props.state.opponent)
    })
    it("should change the opponent", () => {
        renderComponent()
        const opponentInput = screen.getByTestId("opponent-input")

        fireEvent.change(within(opponentInput).getByRole("textbox"), {target: {value: "AAAAA"}})

        expect(onChangeOpponent).toHaveBeenCalledTimes(1)
        expect(onChangeOpponent).toHaveBeenCalledWith("AAAAA")
    })
    it("should change the description", () => {
        renderComponent()
        const descriptionInput = screen.getByTestId("description-input")

        fireEvent.change(within(descriptionInput).getByRole("textbox"), {target: {value: "AAAAA"}})

        expect(onChangeDescription).toHaveBeenCalledTimes(1)
        expect(onChangeDescription).toHaveBeenCalledWith("AAAAA")
    })
})
