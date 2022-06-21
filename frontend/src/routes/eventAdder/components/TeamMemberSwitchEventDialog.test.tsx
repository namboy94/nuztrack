import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {
    TeamMemberSwitchEventDialog,
    TeamMemberSwitchEventDialogProps,
    TeamMemberSwitchEventDialogState
} from "./TeamMemberSwitchEventDialog";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {SwitchType} from "../../../data/events/events.model";

describe("TeamMemberSwitchEventDialog", () => {

    const reset = jest.fn()
    const setTeamMember = jest.fn()
    const setLocation = jest.fn()
    const onClose = jest.fn()
    const submit = jest.fn()

    function renderComponent(
        mode: SwitchType = SwitchType.ADD,
        loading: boolean = false
    ): TeamMemberSwitchEventDialogProps {
        const state: TeamMemberSwitchEventDialogState = {
            reset: reset,
            teamMember: null,
            setTeamMember: setTeamMember,
            location: "LOCATION",
            setLocation: setLocation
        }
        const props: TeamMemberSwitchEventDialogProps = {
            open: true,
            state: state,
            mode: mode,
            submit: submit,
            onClose: onClose,
            pokedex: POKEDEX,
            locations: LOCATION_REGISTRY.getLocationNames(),
            activeTeamMembers: [TEAM_MEMBER_1],
            boxedTeamMembers: [TEAM_MEMBER_3]
        }
        if (loading) {
            props.pokedex = undefined
        }
        render(<TeamMemberSwitchEventDialog {...props}/>)
        return props
    }

    it("should render all UI elements correctly", (done) => {
        const props = renderComponent()

        const locationInput = screen.getByTestId("location-input")
        const teamMemberInput = screen.getByTestId("team-member-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(locationInput).toBeInTheDocument()
        expect(teamMemberInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value")).toEqual(props.state.location)
        expect(within(teamMemberInput).getByRole("combobox").getAttribute("value")).toEqual("")
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
    it("should add a team member", (done) => {
        renderComponent(SwitchType.ADD)

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
    it("should remove a team member", (done) => {
        renderComponent(SwitchType.REMOVE)

        const teamMemberInput = screen.getByTestId("team-member-input")

        fireEvent.focus(teamMemberInput)
        fireEvent.change(
            within(teamMemberInput).getByRole("combobox"),
            {target: {value: TEAM_MEMBER_1.nickname}}
        )
        fireEvent.keyDown(teamMemberInput, {key: "ArrowDown"})
        fireEvent.keyDown(teamMemberInput, {key: "Enter"})

        expect(setTeamMember).toHaveBeenCalledTimes(1)
        expect(setTeamMember).toHaveBeenCalledWith(TEAM_MEMBER_1)
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
        renderComponent(SwitchType.ADD, true)
        expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument()
        done()
    })
})