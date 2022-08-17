import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
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

    it("should render all components correctly", (done) => {
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
        done()
    })
    it("should select a location", (done) => {
        renderComponent()
        const locationInput = screen.getByTestId("location-input")

        fireEvent.change(within(locationInput).getByRole("combobox"), {target: {value: "AAAAA"}})
        fireEvent.keyDown(locationInput, {key: "Enter"})

        expect(onChangeLocation).toHaveBeenCalledTimes(1)
        expect(onChangeLocation).toHaveBeenCalledWith("AAAAA")
        done()
    })
    it("should change the team member", (done) => {
        renderComponent()

        const teamMemberInput = screen.getByTestId("team-member-input")

        fireEvent.focus(teamMemberInput)
        fireEvent.change(
            within(teamMemberInput).getByRole("combobox"),
            {target: {value: TEAM_MEMBER_3.nickname}}
        )
        fireEvent.keyDown(teamMemberInput, {key: "ArrowDown"})
        fireEvent.keyDown(teamMemberInput, {key: "Enter"})

        expect(onChangeTeamMember).toHaveBeenCalledTimes(1)
        expect(onChangeTeamMember).toHaveBeenCalledWith(TEAM_MEMBER_3)
        done()
    })
    it("should change the level", (done) => {
        renderComponent()
        const levelInput = screen.getByTestId("level-input")

        fireEvent.change(within(levelInput).getByRole("spinbutton"), {target: {value: 85}})

        expect(onChangeLevel).toHaveBeenCalledTimes(1)
        expect(onChangeLevel).toHaveBeenCalledWith(85)

        done()
    })
    it("should change the opponent", (done) => {
        renderComponent()
        const opponentInput = screen.getByTestId("opponent-input")

        fireEvent.change(within(opponentInput).getByRole("textbox"), {target: {value: "AAAAA"}})

        expect(onChangeOpponent).toHaveBeenCalledTimes(1)
        expect(onChangeOpponent).toHaveBeenCalledWith("AAAAA")

        done()
    })
    it("should change the description", (done) => {
        renderComponent()
        const descriptionInput = screen.getByTestId("description-input")

        fireEvent.change(within(descriptionInput).getByRole("textbox"), {target: {value: "AAAAA"}})

        expect(onChangeDescription).toHaveBeenCalledTimes(1)
        expect(onChangeDescription).toHaveBeenCalledWith("AAAAA")

        done()
    })
    it("should submit", (done) => {
        renderComponent()
        const submitButton = screen.getByTestId("submit-button")

        act(() => {
            fireEvent.click(submitButton)
        })

        expect(submit).toHaveBeenCalledTimes(1)
        done()
    })
    it("should cancel", (done) => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => {
            fireEvent.click(cancelButton)
        })

        expect(closeDialog).toHaveBeenCalledTimes(1)
        done()
    })
})
