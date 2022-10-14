import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {EvolutionEventDialog} from "./EvolutionEventDialog";
import {POKEDEX, POKEMON_SPECIES_WARTORTLE} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";
import {EvolutionEventDialogViewModel} from "../hooks/vm/EvolutionEventDialog.hooks";

describe("EvolutionEventDialog", () => {

    const onChangeLocation = jest.fn()
    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()
    const onChangeTeamMember = jest.fn()
    const onChangeLevel = jest.fn()
    const onChangeEvolutionTarget = jest.fn()

    function renderComponent(): EvolutionEventDialogViewModel {
        const vm: EvolutionEventDialogViewModel = {
            state: {
                open: true,
                pokedex: POKEDEX,
                locations: LOCATION_REGISTRY.getLocationNames(),
                activeTeamMembers: [TEAM_MEMBER_1],
                boxedTeamMembers: [TEAM_MEMBER_3],
                location: "Location",
                level: 16,
                teamMember: TEAM_MEMBER_1,
                evolutionTarget: POKEMON_SPECIES_WARTORTLE
            },
            interactions: {
                onChangeTeamMember: onChangeTeamMember,
                closeDialog: closeDialog,
                openDialog: openDialog,
                onChangeLevel: onChangeLevel,
                onChangeLocation: onChangeLocation,
                onChangeEvolutionTarget: onChangeEvolutionTarget,
                submit: submit
            }
        }
        render(<EvolutionEventDialog {...vm} />)
        return vm
    }

    it("should render all components correctly", () => {
        const props = renderComponent()

        const locationInput = screen.getByTestId("location-input")
        const teamMemberInput = screen.getByTestId("team-member-input")
        const levelInput = screen.getByTestId("level-input")
        const evolutionTargetInput = screen.getByTestId("pokemon-species-input")
        const submitButton = screen.getByTestId("submit-button")
        const cancelButton = screen.getByTestId("cancel-button")

        expect(locationInput).toBeInTheDocument()
        expect(teamMemberInput).toBeInTheDocument()
        expect(levelInput).toBeInTheDocument()
        expect(evolutionTargetInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.location)
        expect(within(teamMemberInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.teamMember!!.nickname)
        expect(within(levelInput).getByRole("spinbutton").getAttribute("value"))
            .toEqual("16")
        expect(within(evolutionTargetInput).getByRole("combobox").getAttribute("value"))
            .toEqual(props.state.evolutionTarget?.name)
    })
    it("should submit", () => {
        renderComponent()
        const submitButton = screen.getByTestId("submit-button")

        act(() => {
            fireEvent.click(submitButton)
        })

        expect(submit).toHaveBeenCalledTimes(1)
    })
    it("should cancel", () => {
        renderComponent()
        const cancelButton = screen.getByTestId("cancel-button")

        act(() => {
            fireEvent.click(cancelButton)
        })

        expect(closeDialog).toHaveBeenCalledTimes(1)
    })
})