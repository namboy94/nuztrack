import {fireEvent, render, screen, within} from "@testing-library/react";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {
    POKEDEX,
    POKEMON_SPECIES_BULBASAUR,
    POKEMON_SPECIES_CHARMANDER,
    POKEMON_SPECIES_SQUIRTLE
} from "../../../data/pokedex/pokedex.testconstants";
import {Gender} from "../../../data/team/team.model";
import {EncounterEventDialogInteractions, EncounterEventDialogState} from "../hooks/vm/EncounterEventDialog.vm";
import {EncounterEventDialog} from "./EncounterEventDialog";

describe("EncounterEventDialog", () => {

    const submit = jest.fn()
    const closeDialog = jest.fn()
    const onChangeLocation = jest.fn()
    const onChangePokemonSpecies = jest.fn()
    const onChangeLevel = jest.fn()
    const onChangeGender = jest.fn()
    const onChangeCaught = jest.fn()
    const onChangeNickname = jest.fn()
    const onChangeNature = jest.fn()
    const onChangeAbilitySlot = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function renderComponent(): EncounterEventDialogState {
        const state: EncounterEventDialogState = {
            locations: [],
            open: true,
            pokedex: POKEDEX,
            run: NUZLOCKE_RUN,
            abilitySlot: 1,
            caught: true,
            gender: Gender.MALE,
            level: 7,
            location: "Test Town",
            nature: "MODEST",
            nickname: "Nick",
            pokemonSpecies: POKEMON_SPECIES_CHARMANDER,
            possibleAbilitySlots: [1, 3],
            possibleEncounters: [POKEMON_SPECIES_BULBASAUR, POKEMON_SPECIES_CHARMANDER, POKEMON_SPECIES_SQUIRTLE]
        }
        const interactions: EncounterEventDialogInteractions = {
            submit: submit,
            openDialog: jest.fn(),
            closeDialog: closeDialog,
            onChangeLocation: onChangeLocation,
            onChangePokemonSpecies: onChangePokemonSpecies,
            onChangeLevel: onChangeLevel,
            onChangeGender: onChangeGender,
            onChangeCaught: onChangeCaught,
            onChangeNickname: onChangeNickname,
            onChangeNature: onChangeNature,
            onChangeAbilitySlot: onChangeAbilitySlot,
        }
        const viewModel = {state: state, interactions: interactions}
        render(<EncounterEventDialog {...viewModel}/>)
        return state
    }

    it("should render all inputs correctly", () => {
        const state = renderComponent()

        const locationInput = screen.getByTestId("location-input")
        const pokemonSpeciesInput = screen.getByTestId("pokemon-species-input")
        const genderInput = screen.getByTestId("gender-input")
        const levelInput = screen.getByTestId("level-input")
        const caughtInput = screen.getByTestId("caught-input")
        const nicknameInput = screen.getByTestId("nickname-input")
        const natureInput = screen.getByTestId("nature-input")
        const abilitySlotInput = screen.getByTestId("ability-slot-input")

        expect(locationInput).toBeInTheDocument()
        expect(pokemonSpeciesInput).toBeInTheDocument()
        expect(genderInput).toBeInTheDocument()
        expect(levelInput).toBeInTheDocument()
        expect(caughtInput).toBeInTheDocument()
        expect(nicknameInput).toBeInTheDocument()
        expect(natureInput).toBeInTheDocument()
        expect(abilitySlotInput).toBeInTheDocument()

        expect(within(locationInput).getByRole("combobox").getAttribute("value")).toEqual(state.location)
        expect(within(pokemonSpeciesInput).getByRole("combobox")
            .getAttribute("value")).toEqual(state.pokemonSpecies!!.name)
        expect(within(genderInput).getByRole("button").getAttribute("tabindex")).toEqual(state.gender.toString())
        expect(parseInt(within(levelInput).getByRole("spinbutton").getAttribute("value")!!)).toEqual(state.level)
        expect(within(caughtInput).getByRole("checkbox").getAttribute("value")).toEqual(`${state.caught}`)
        expect(within(nicknameInput).getByRole("textbox", {hidden: true})
            .getAttribute("value")).toEqual(state.nickname)
        expect(within(natureInput).getByRole("combobox", {hidden: true})
            .getAttribute("value")).toEqual(state.nature)
        expect(within(abilitySlotInput).getByRole("combobox", {hidden: true}).getAttribute("value"))
            .toEqual(POKEDEX.getAbilityName(state.pokemonSpecies!!.pokedexNumber, state.abilitySlot))
    })
    it("should test changing caught", () => {
        renderComponent()
        const caughtInput = screen.getByTestId("caught-input")

        fireEvent.click(caughtInput)

        expect(onChangeCaught).toHaveBeenCalledTimes(1)
        expect(onChangeCaught).toHaveBeenCalledWith(false)
    })
    it("should submit", () => {
        renderComponent()
        const button = screen.getByTestId("submit-button")
        fireEvent.click(button)
        expect(submit).toHaveBeenCalledTimes(1)
    })
    it("should cancel", () => {
        renderComponent()
        const button = screen.getByTestId("cancel-button")
        fireEvent.click(button)
        expect(closeDialog).toHaveBeenCalledTimes(1)
    })
})