import {fireEvent, render, screen, within} from "@testing-library/react";
import {EncounterEventDialog, EncounterEventDialogProps, EncounterEventDialogState} from "./EncounterEventDialog";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {
    NATURES,
    POKEDEX,
    POKEMON_SPECIES_BULBASAUR,
    POKEMON_SPECIES_CHARMANDER,
    POKEMON_SPECIES_SQUIRTLE
} from "../../../data/pokedex/pokedex.testconstants";
import {LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {Gender} from "../../../data/team/team.model";

describe("EncounterEventDialog", () => {
    const reset = jest.fn()
    const setAbilitySlot = jest.fn()
    const setCaught = jest.fn()
    const setGender = jest.fn()
    const setLevel = jest.fn()
    const setLocation = jest.fn()
    const setNature = jest.fn()
    const setNickname = jest.fn()
    const setPokemonSpecies = jest.fn()
    const submit = jest.fn()
    const onClose = jest.fn()

    afterEach(() => {
        jest.resetAllMocks()
    })

    function renderComponent(notLoaded: boolean = false): EncounterEventDialogProps {
        const state: EncounterEventDialogState = {
            abilitySlot: 1,
            caught: true,
            gender: Gender.MALE,
            level: 7,
            location: "Test Town",
            nature: "MODEST",
            nickname: "Nick",
            pokemonSpecies: POKEMON_SPECIES_CHARMANDER,
            possibleAbilitySlots: [1, 3],
            possibleEncounters: [POKEMON_SPECIES_BULBASAUR, POKEMON_SPECIES_CHARMANDER, POKEMON_SPECIES_SQUIRTLE],
            reset: reset,
            setAbilitySlot: setAbilitySlot,
            setCaught: setCaught,
            setGender: setGender,
            setLevel: setLevel,
            setLocation: setLocation,
            setNature: setNature,
            setNickname: setNickname,
            setPokemonSpecies: setPokemonSpecies
        }
        const props: EncounterEventDialogProps = {
            locations: LOCATION_REGISTRY.getLocationNames(),
            natures: NATURES,
            open: true,
            pokedex: POKEDEX,
            run: NUZLOCKE_RUN,
            state: state,
            submit: submit,
            onClose: onClose
        }
        if (notLoaded) {
            props.pokedex = undefined
            props.natures = undefined
        }
        render(<EncounterEventDialog {...props}/>)
        return props
    }

    it("should render all inputs correctly", (done) => {
        const props = renderComponent()

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

        expect(within(locationInput).getByRole("combobox").getAttribute("value")).toEqual(props.state.location)
        expect(within(pokemonSpeciesInput).getByRole("combobox")
            .getAttribute("value")).toEqual(props.state.pokemonSpecies!!.name)
        expect(within(genderInput).getByRole("button").getAttribute("tabindex")).toEqual(props.state.gender.toString())
        expect(parseInt(within(levelInput).getByRole("spinbutton").getAttribute("value")!!)).toEqual(props.state.level)
        expect(within(caughtInput).getByRole("checkbox").getAttribute("value")).toEqual(`${props.state.caught}`)
        expect(within(nicknameInput).getByRole("textbox", {hidden: true})
            .getAttribute("value")).toEqual(props.state.nickname)
        expect(within(natureInput).getByRole("combobox", {hidden: true})
            .getAttribute("value")).toEqual(props.state.nature)
        expect(within(abilitySlotInput).getByRole("combobox", {hidden: true}).getAttribute("value"))
            .toEqual(POKEDEX.getAbilityName(props.state.pokemonSpecies!!.pokedexNumber, props.state.abilitySlot))


        done()
    })
    it("should test changing the pokemon species", (done) => {
        renderComponent()
        const pokemonSpeciesInput = screen.getByTestId("pokemon-species-input")

        fireEvent.focus(pokemonSpeciesInput)
        fireEvent.change(within(pokemonSpeciesInput).getByRole("combobox"), {target: {value: "Squi"}})
        fireEvent.keyDown(pokemonSpeciesInput, {key: "ArrowDown"})
        fireEvent.keyDown(pokemonSpeciesInput, {key: "Enter"})

        expect(setPokemonSpecies).toHaveBeenCalledTimes(1)
        expect(setPokemonSpecies).toHaveBeenCalledWith(POKEMON_SPECIES_SQUIRTLE)

        done()
    })
    it("should test changing the gender", (done) => {
        renderComponent()
        const genderInput = screen.getByTestId("gender-input")

        fireEvent.mouseDown(within(genderInput).getByRole("button"))
        const femaleInput = screen.getByTestId("female-gender-select")
        fireEvent.click(femaleInput)

        expect(setGender).toHaveBeenCalledTimes(1)
        expect(setGender).toHaveBeenCalledWith(Gender.FEMALE)

        done()
    })
    it("should test changing caught", (done) => {
        renderComponent()
        const caughtInput = screen.getByTestId("caught-input")

        fireEvent.click(caughtInput)

        expect(setCaught).toHaveBeenCalledTimes(1)
        expect(setCaught).toHaveBeenCalledWith(false)
        done()
    })
    it("should test changing nickname", (done) => {
        renderComponent()
        const nicknameInput = screen.getByTestId("nickname-input")

        fireEvent.change(within(nicknameInput).getByRole("textbox", {hidden: true}), {target: {value: "Test"}})

        expect(setNickname).toHaveBeenCalledTimes(1)
        expect(setNickname).toHaveBeenCalledWith("Test")
        done()
    })
    it("should test changing nature", (done) => {
        renderComponent()
        const natureInput = screen.getByTestId("nature-input")

        fireEvent.focus(natureInput)
        fireEvent.change(within(natureInput).getByRole("combobox"), {target: {value: "Timi"}})
        fireEvent.keyDown(natureInput, {key: "ArrowDown"})
        fireEvent.keyDown(natureInput, {key: "Enter"})

        expect(setNature).toHaveBeenCalledTimes(1)
        expect(setNature).toHaveBeenCalledWith("TIMID")
        done()
    })
    it("should test changing ability", (done) => {
        renderComponent()
        const abilitySlotInput = screen.getByTestId("ability-slot-input")

        fireEvent.focus(abilitySlotInput)
        fireEvent.change(within(abilitySlotInput).getByRole("combobox"), {target: {value: "Sola"}})
        fireEvent.keyDown(abilitySlotInput, {key: "ArrowDown"})
        fireEvent.keyDown(abilitySlotInput, {key: "Enter"})

        expect(setAbilitySlot).toHaveBeenCalledTimes(1)
        expect(setAbilitySlot).toHaveBeenCalledWith(3)
        done()
    })
    it("should submit", (done) => {
        renderComponent()
        const button = screen.getByTestId("submit-button")
        fireEvent.click(button)
        expect(submit).toHaveBeenCalledTimes(1)
        done()
    })
    it("should cancel", (done) => {
        renderComponent()
        const button = screen.getByTestId("cancel-button")
        fireEvent.click(button)
        expect(onClose).toHaveBeenCalledTimes(1)
        done()
    })
    it("should not render anything if data is not loaded", (done) => {
        renderComponent(true)
        expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument()
        done()
    })
})