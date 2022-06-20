import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {EvolutionEventDialog, EvolutionEventDialogProps, EvolutionEventDialogState} from "./EvolutionEventDialog";
import {POKEDEX, POKEMON_SPECIES_IVYSAUR, POKEMON_SPECIES_WARTORTLE} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../data/team/team.testconstants";

describe("EvolutionEventDialog", () => {

    const reset = jest.fn()
    const setLocation = jest.fn()
    const onClose = jest.fn()
    const submit = jest.fn()
    const setEvolutionTarget = jest.fn()
    const setTeamMember = jest.fn()
    const setLevel = jest.fn()

    function renderComponent(loading: boolean = false, noSelectedEvo: boolean = false): EvolutionEventDialogProps {
        const state: EvolutionEventDialogState = {
            evolutionTarget: POKEMON_SPECIES_WARTORTLE,
            level: 16,
            setEvolutionTarget: setEvolutionTarget,
            setLevel: setLevel,
            setTeamMember: setTeamMember,
            teamMember: TEAM_MEMBER_1,
            location: "Location",
            reset: reset,
            setLocation: setLocation
        }
        const props: EvolutionEventDialogProps = {
            activeTeamMembers: [TEAM_MEMBER_1],
            boxedTeamMembers: [TEAM_MEMBER_3],
            pokedex: POKEDEX,
            locations: LOCATION_REGISTRY.getLocationNames(),
            open: true,
            state: state,
            submit: submit,
            onClose: onClose
        }

        if (noSelectedEvo) {
            props.state.evolutionTarget = null
        }
        if (loading) {
            props.pokedex = undefined
        }

        render(<EvolutionEventDialog {...props}/>)
        return props
    }

    it("should correctly render all inputs", (done) => {
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
            .toEqual(props.state.evolutionTarget!!.name)
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
    it("should change the evolution target", (done) => {
        renderComponent(false, true)

        const evolutionTargetInput = screen.getByTestId("pokemon-species-input")
        expect(within(evolutionTargetInput).getByRole("combobox").getAttribute("value")).toEqual("")


        fireEvent.focus(evolutionTargetInput)
        fireEvent.change(
            within(evolutionTargetInput).getByRole("combobox"),
            {target: {value: POKEMON_SPECIES_IVYSAUR.name}}
        )
        fireEvent.keyDown(evolutionTargetInput, {key: "ArrowDown"})
        fireEvent.keyDown(evolutionTargetInput, {key: "Enter"})

        expect(setEvolutionTarget).toHaveBeenCalledTimes(1)
        expect(setEvolutionTarget).toHaveBeenCalledWith(POKEMON_SPECIES_WARTORTLE)
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