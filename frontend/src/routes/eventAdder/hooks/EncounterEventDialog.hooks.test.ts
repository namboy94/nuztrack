import {eventsService} from "../../../data/events/events.service";
import {of, throwError} from "rxjs";
import {ENCOUNTER_EVENT_FAILED, ENCOUNTER_EVENT_SUCCESSFUL} from "../../../data/events/events.testconstants";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {
    NATURES,
    POKEDEX,
    POKEMON_SPECIES_BULBASAUR,
    POKEMON_SPECIES_CHARMANDER,
    POKEMON_SPECIES_IVYSAUR,
    POKEMON_SPECIES_SQUIRTLE
} from "../../../data/pokedex/pokedex.testconstants";
import {gamesService} from "../../../data/games/games.service";
import {GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN, LOCATION_REGISTRY} from "../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {useEncounterEventDialogProps} from "./EncounterEventDialog.hooks";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {Gender} from "../../../data/team/team.model";
import {EncounterEventDialogState} from "../components/EncounterEventDialog";
import {CreateEncounterEvent} from "../../../data/events/events.model";

describe("useEncounterEventDialogProps", () => {

    const notify = jest.fn()
    const events = [ENCOUNTER_EVENT_SUCCESSFUL, ENCOUNTER_EVENT_FAILED]
    const locations = [GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN]

    function createMocksAndRender() {
        jest.spyOn(eventsService, "getEncounterEvents$").mockReturnValue(of(events))
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(pokedexService, "getNatures$").mockReturnValue(of(NATURES))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        return renderHook(() => useEncounterEventDialogProps(NUZLOCKE_RUN, notify)).result
    }

    function fillEntries(state: EncounterEventDialogState) {
        state.setLocation(GAME_LOCATION_PALLET.name)
        state.setPokemonSpecies(POKEMON_SPECIES_SQUIRTLE)
        state.setLevel(50)
        state.setGender(Gender.FEMALE)
        state.setCaught(true)
        state.setNickname("XYZ")
        state.setNature("BOLD")
        state.setAbilitySlot(3)
    }

    function expectChangedEntries(state: EncounterEventDialogState) {
        expect(state.location).toEqual(GAME_LOCATION_PALLET.name)
        expect(state.pokemonSpecies).toEqual(POKEMON_SPECIES_SQUIRTLE)
        expect(state.level).toEqual(50)
        expect(state.gender).toEqual(Gender.FEMALE)
        expect(state.caught).toEqual(true)
        expect(state.nickname).toEqual("XYZ")
        expect(state.nature).toEqual("BOLD")
        expect(state.abilitySlot).toEqual(3)
        expect(state.possibleAbilitySlots).toEqual([1, 3])
        expect(state.possibleEncounters).toEqual([
            POKEMON_SPECIES_BULBASAUR, POKEMON_SPECIES_CHARMANDER, POKEMON_SPECIES_SQUIRTLE
        ])
    }

    function expectDefaultEntries(state: EncounterEventDialogState) {
        expect(state.location).toEqual("")
        expect(state.pokemonSpecies).toEqual(undefined)
        expect(state.level).toEqual(5)
        expect(state.gender).toEqual(Gender.MALE)
        expect(state.caught).toEqual(false)
        expect(state.nickname).toEqual("")
        expect(state.nature).toEqual("ADAMANT")
        expect(state.abilitySlot).toEqual(1)
        expect(state.possibleAbilitySlots).toEqual([1])
        expect(state.possibleEncounters).toEqual([])
    }

    it("should test the data loading", (done) => {
        const result = createMocksAndRender().current[1]
        expect(result.locations).toEqual([GAME_LOCATION_VIRIDIAN.name])
        expect(result.pokedex).toEqual(POKEDEX)
        expect(result.natures).toEqual(NATURES)
        expect(eventsService.getEncounterEvents$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getNatures$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
        done()
    })

    it("should open the dialog, change the values, and close the dialog", (done) => {
        const result = createMocksAndRender()
        let [openDialog, current] = result.current

        expect(current.open).toBeFalsy()

        act(openDialog)
        current = result.current[1]
        expect(current.open).toBeTruthy()

        act(() => fillEntries(current.state))
        current = result.current[1]
        expectChangedEntries(current.state)

        act(current.onClose)
        current = result.current[1]
        expect(current.open).toBeFalsy()
        expectDefaultEntries(current.state)

        done()
    })
    it("should submit a new encounter event", (done) => {

        jest.spyOn(eventsService, "createEncounterEvent$").mockReturnValue(of(ENCOUNTER_EVENT_SUCCESSFUL))

        const result = createMocksAndRender()
        let [openDialog, current] = result.current

        const expected: CreateEncounterEvent = {
            caught: true,
            level: 50,
            location: GAME_LOCATION_PALLET.name,
            pokedexNumber: POKEMON_SPECIES_SQUIRTLE.pokedexNumber,
            pokemon: {abilitySlot: 3, gender: Gender.FEMALE, nature: "BOLD", nickname: "XYZ"}
        }

        act(() => {
            openDialog()
            fillEntries(current.state)
        })

        current = result.current[1]
        act(() => current.submit())
        current = result.current[1]

        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")
        expect(eventsService.createEncounterEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createEncounterEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expectDefaultEntries(current.state)
        expect(current.open).toBeFalsy()

        done()

    })
    it("should submit a bad encounter event", (done) => {

        jest.spyOn(eventsService, "createEncounterEvent$").mockReturnValue(throwError(() => {
        }))

        const result = createMocksAndRender()
        let [openDialog, current] = result.current

        act(() => {
            openDialog()
            fillEntries(current.state)
        })

        current = result.current[1]
        act(() => current.submit())
        current = result.current[1]

        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "error")
        expect(eventsService.createEncounterEvent$).toHaveBeenCalledTimes(1)
        expectChangedEntries(current.state)
        expect(current.open).toBeTruthy()

        done()

    })
    it("should reset capture details if caught is set to false", (done) => {
        const result = createMocksAndRender()
        let [openDialog, current] = result.current

        act(() => {
            openDialog()
            fillEntries(current.state)
            current.state.setCaught(false)
        })

        current = result.current[1]

        expect(current.state.possibleAbilitySlots).toEqual([1])
        expect(current.state.nature).toEqual("ADAMANT")
        expect(current.state.abilitySlot).toEqual(1)
        expect(current.state.nickname).toEqual("")
        done()
    })
    it("should set the possible encounters for a location if it is set", (done) => {
        const result = createMocksAndRender()
        let [openDialog, current] = result.current

        act(() => {
            openDialog()
            fillEntries(current.state)
            current.state.setLocation(GAME_LOCATION_VIRIDIAN.name)
        })

        current = result.current[1]

        expect(current.state.possibleEncounters).toEqual([POKEMON_SPECIES_IVYSAUR])

        done()
    })
})