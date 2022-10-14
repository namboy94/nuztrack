import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {TeamMemberSwitchEventDialog} from "./TeamMemberSwitchEventDialog";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {SwitchType} from "../../../data/events/events.model";
import {TeamMemberSwitchEventDialogViewModel} from "../hooks/vm/TeamMemberSwitchEventDialog.vm";

describe("TeamMemberSwitchEventDialog", () => {

    const onChangeLocation = jest.fn()
    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()
    const onChangeTeamMember = jest.fn()

    function renderComponent(mode: SwitchType): TeamMemberSwitchEventDialogViewModel {
        const vm: TeamMemberSwitchEventDialogViewModel = {
            state: {
                open: true,
                mode: mode,
                pokedex: POKEDEX,
                locations: LOCATION_REGISTRY.getLocationNames(),
                activeTeamMembers: [TEAM_MEMBER_1],
                boxedTeamMembers: [TEAM_MEMBER_3],
                location: "Location",
                teamMember: TEAM_MEMBER_1,
            },
            interactions: {
                onChangeTeamMember: onChangeTeamMember,
                closeDialog: closeDialog,
                openDialog: openDialog,
                onChangeLocation: onChangeLocation,
                submit: submit
            }
        }
        render(<TeamMemberSwitchEventDialog {...vm} />)
        return vm
    }

    it("should render all UI elements correctly", () => {
        const props = renderComponent(SwitchType.ADD)

        const locationInput = screen.getByTestId("location-input")
        const teamMemberInput = screen.getByTestId("team-member-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(locationInput).toBeInTheDocument()
        expect(teamMemberInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.location)
        expect(within(teamMemberInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.teamMember!!.nickname)
    })
    it("should submit", () => {
        renderComponent(SwitchType.ADD)
        const submitButton = screen.getByTestId("submit-button")

        act(() => {
            fireEvent.click(submitButton)
        })

        expect(submit).toHaveBeenCalledTimes(1)
    })
    it("should cancel", () => {
        renderComponent(SwitchType.ADD)
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => {
            fireEvent.click(cancelButton)
        })

        expect(closeDialog).toHaveBeenCalledTimes(1)
    })
})