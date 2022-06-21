import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {DeathEventDialog, DeathEventDialogProps, DeathEventDialogState} from "./DeathEventDialog";

describe("DeathEventDialog", () => {
    const reset = jest.fn()
    const setLocation = jest.fn()
    const onClose = jest.fn()
    const submit = jest.fn()
    const setOpponent = jest.fn()
    const setDescription = jest.fn()
    const setTeamMember = jest.fn()
    const setLevel = jest.fn()

    function renderComponent(loading: boolean = false): DeathEventDialogProps {
        const state: DeathEventDialogState = {
            description: "DESC",
            opponent: "OPPO",
            setDescription: setDescription,
            setOpponent: setOpponent,
            level: 16,
            setLevel: setLevel,
            setTeamMember: setTeamMember,
            teamMember: TEAM_MEMBER_1,
            location: "Location",
            reset: reset,
            setLocation: setLocation
        }
        const props: DeathEventDialogProps = {
            activeTeamMembers: [TEAM_MEMBER_1],
            boxedTeamMembers: [TEAM_MEMBER_3],
            pokedex: POKEDEX,
            locations: LOCATION_REGISTRY.getLocationNames(),
            open: true,
            state: state,
            submit: submit,
            onClose: onClose
        }

        if (loading) {
            props.pokedex = undefined
        }

        render(<DeathEventDialog {...props} />)
        return props
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

        expect(setLocation).toHaveBeenCalledTimes(1)
        expect(setLocation).toHaveBeenCalledWith("AAAAA")
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

        expect(setTeamMember).toHaveBeenCalledTimes(1)
        expect(setTeamMember).toHaveBeenCalledWith(TEAM_MEMBER_3)
        done()
    })
    it("should change the level", (done) => {
        renderComponent()
        const levelInput = screen.getByTestId("level-input")

        fireEvent.change(within(levelInput).getByRole("spinbutton"), {target: {value: 85}})

        expect(setLevel).toHaveBeenCalledTimes(1)
        expect(setLevel).toHaveBeenCalledWith(85)

        done()
    })
    it("should change the level", (done) => {
        renderComponent()
        const levelInput = screen.getByTestId("level-input")

        fireEvent.change(within(levelInput).getByRole("spinbutton"), {target: {value: 85}})

        expect(setLevel).toHaveBeenCalledTimes(1)
        expect(setLevel).toHaveBeenCalledWith(85)

        done()
    })
    it("should change the opponent", (done) => {
        renderComponent()
        const opponentInput = screen.getByTestId("opponent-input")

        fireEvent.change(within(opponentInput).getByRole("textbox"), {target: {value: "AAAAA"}})

        expect(setOpponent).toHaveBeenCalledTimes(1)
        expect(setOpponent).toHaveBeenCalledWith("AAAAA")

        done()
    })
    it("should change the description", (done) => {
        renderComponent()
        const descriptionInput = screen.getByTestId("description-input")

        fireEvent.change(within(descriptionInput).getByRole("textbox"), {target: {value: "AAAAA"}})

        expect(setDescription).toHaveBeenCalledTimes(1)
        expect(setDescription).toHaveBeenCalledWith("AAAAA")

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

        expect(onClose).toHaveBeenCalledTimes(1)
        done()
    })
    it("should not render anything if data is not loaded", (done) => {
        renderComponent(true)
        expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument()
        done()
    })
})