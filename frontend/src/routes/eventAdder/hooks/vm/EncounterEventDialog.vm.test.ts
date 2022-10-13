import {eventsService} from "../../../../data/events/events.service";
import {of, throwError} from "rxjs";
import {ENCOUNTER_EVENT_FAILED, ENCOUNTER_EVENT_SUCCESSFUL} from "../../../../data/events/events.testconstants";
import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {
    NATURES,
    POKEDEX,
    POKEMON_SPECIES_BULBASAUR,
    POKEMON_SPECIES_CHARMANDER,
    POKEMON_SPECIES_IVYSAUR,
    POKEMON_SPECIES_SQUIRTLE
} from "../../../../data/pokedex/pokedex.testconstants";
import {gamesService} from "../../../../data/games/games.service";
import {
    GAME_1,
    GAME_LOCATION_PALLET,
    GAME_LOCATION_VIRIDIAN,
    LOCATION_REGISTRY
} from "../../../../data/games/games.testconstants";
import {act, renderHook} from "@testing-library/react";
import {
    EncounterEventDialogState,
    EncounterEventDialogViewModel,
    useEncounterEventDialogViewModel
} from "./EncounterEventDialog.vm";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {NuzlockeRun} from "../../../../data/runs/runs.model";
import {getInteractions, getState} from "../../../../util/viewmodel";
import {Gender} from "../../../../data/team/team.model";
import {CreateEncounterEvent} from "../../../../data/events/events.model";

describe("useEncounterEventDialogProps", () => {

    const notify = jest.fn()
    const events = [ENCOUNTER_EVENT_SUCCESSFUL, ENCOUNTER_EVENT_FAILED]

    function createMocksAndRender(run: NuzlockeRun): { current: EncounterEventDialogViewModel } {
        jest.spyOn(eventsService, "getEncounterEvents$").mockReturnValue(of(events))
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        jest.spyOn(pokedexService, "getNatures$").mockReturnValue(of(NATURES))
        jest.spyOn(gamesService, "getGameLocationRegistry$").mockReturnValue(of(LOCATION_REGISTRY))
        return renderHook(() => useEncounterEventDialogViewModel(run, notify)).result
    }

    function fillEntries(hookResult: { current: EncounterEventDialogViewModel }) {
        act(getInteractions(hookResult).openDialog)
        act(() => {
            getInteractions(hookResult).onChangeLocation(GAME_LOCATION_PALLET.name)
            getInteractions(hookResult).onChangePokemonSpecies(POKEMON_SPECIES_SQUIRTLE)
            getInteractions(hookResult).onChangeLevel(50)
            getInteractions(hookResult).onChangeGender(Gender.FEMALE)
        })
        act(() => getInteractions(hookResult).onChangeCaught(true))
        act(() => {
            getInteractions(hookResult).onChangeNickname("XYZ")
            getInteractions(hookResult).onChangeNature("BOLD")
            getInteractions(hookResult).onChangeAbilitySlot(3)
        })
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
        expect(state.pokemonSpecies).toEqual(null)
        expect(state.level).toEqual(5)
        expect(state.gender).toEqual(Gender.MALE)
        expect(state.caught).toEqual(false)
        expect(state.nickname).toEqual("")
        expect(state.nature).toEqual("ADAMANT")
        expect(state.abilitySlot).toEqual(1)
        expect(state.possibleAbilitySlots).toEqual([1])
        expect(state.possibleEncounters).toEqual([])
    }

    function verifySubmission(run: NuzlockeRun, success: boolean, expected?: CreateEncounterEvent) {
        let result = createMocksAndRender(run)

        act(() => getInteractions(result).openDialog())
        fillEntries(result)

        if (!!expected && !expected.caught) {
            act(() => getInteractions(result).onChangeCaught(false))
        }

        act(() => getInteractions(result).submit())

        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), success ? "success" : "error")
        expect(eventsService.createEncounterEvent$).toHaveBeenCalledTimes(1)

        if (!!expected) {
            expect(eventsService.createEncounterEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        }

        if (success) {
            expectDefaultEntries(getState(result))
            expect(getState(result).open).toBeFalsy()
        } else {
            expect(getState(result).open).toBeTruthy()
        }
    }

    it("should test the data loading", () => {
        const state = getState(createMocksAndRender(NUZLOCKE_RUN))
        expect(state.locations).toEqual([GAME_LOCATION_VIRIDIAN.name])
        expect(state.pokedex).toEqual(POKEDEX)
        expect(eventsService.getEncounterEvents$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocationRegistry$).toHaveBeenCalledTimes(1)
    })

    it("should open the dialog, change the values, and close the dialog", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN)

        expect(getState(result).open).toBeFalsy()

        act(getInteractions(result).openDialog)
        expect(getState(result).open).toBeTruthy()

        fillEntries(result)
        expectChangedEntries(getState(result))

        act(getInteractions(result).closeDialog)

        expect(getState(result).open).toBeFalsy()
        expectDefaultEntries(getState(result))
    })

    it("should submit a new encounter event", () => {
        jest.spyOn(eventsService, "createEncounterEvent$").mockReturnValue(of(ENCOUNTER_EVENT_SUCCESSFUL))
        const expected: CreateEncounterEvent = {
            caught: true,
            level: 50,
            location: GAME_LOCATION_PALLET.name,
            pokedexNumber: POKEMON_SPECIES_SQUIRTLE.pokedexNumber,
            pokemon: {abilitySlot: 3, gender: Gender.FEMALE, nature: "BOLD", nickname: "XYZ"}
        }
        verifySubmission(NUZLOCKE_RUN, true, expected)
    })

    it("should submit a new encounter event with failed catch", () => {
        const eventResult = {...ENCOUNTER_EVENT_SUCCESSFUL, caught: false}
        jest.spyOn(eventsService, "createEncounterEvent$").mockReturnValue(of(eventResult))
        const expected: CreateEncounterEvent = {
            caught: false,
            level: 50,
            location: GAME_LOCATION_PALLET.name,
            pokedexNumber: POKEMON_SPECIES_SQUIRTLE.pokedexNumber,
            pokemon: null
        }
        verifySubmission(NUZLOCKE_RUN, true, expected)
    })

    it("should submit a new encounter event for an old game", () => {
        jest.spyOn(eventsService, "createEncounterEvent$").mockReturnValue(of(ENCOUNTER_EVENT_SUCCESSFUL))
        const run = {...NUZLOCKE_RUN, game: GAME_1}
        const expected: CreateEncounterEvent = {
            caught: true,
            level: 50,
            location: GAME_LOCATION_PALLET.name,
            pokedexNumber: POKEMON_SPECIES_SQUIRTLE.pokedexNumber,
            pokemon: {abilitySlot: null, gender: null, nature: null, nickname: "XYZ"}
        }
        verifySubmission(run, true, expected)
    })

    it("should submit a bad encounter event", () => {

        jest.spyOn(eventsService, "createEncounterEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))
        verifySubmission(NUZLOCKE_RUN, false)
    })

    it("should reset capture details if caught is set to false", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN)

        fillEntries(result)
        act(() => getInteractions(result).onChangeCaught(false))

        expect(getState(result).possibleAbilitySlots).toEqual([1])
        expect(getState(result).nature).toEqual("ADAMANT")
        expect(getState(result).abilitySlot).toEqual(1)
        expect(getState(result).nickname).toEqual("")
    })

    it("should set the possible encounters for a location if it is set", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN)

        fillEntries(result)
        act(() => getInteractions(result).onChangeLocation(GAME_LOCATION_VIRIDIAN.name))

        expect(getState(result).possibleEncounters).toEqual([POKEMON_SPECIES_IVYSAUR])
    })

    it("should reset capture details if caught is set to false", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN)
        fillEntries(result)

        act(() => getInteractions(result).onChangeCaught(false))

        expect(getState(result).nickname).toEqual("")
        expect(getState(result).nature).toEqual("ADAMANT")
        expect(getState(result).abilitySlot).toEqual(1)
        expect(getState(result).caught).toEqual(false)
        expect(getState(result).pokemonSpecies).toEqual(POKEMON_SPECIES_SQUIRTLE)
    })

    it("should not set caught to true if no Pokemon is set", () => {
        const result = createMocksAndRender(NUZLOCKE_RUN)

        act(getInteractions(result).openDialog)
        act(() => getInteractions(result).onChangeCaught(true))

        expect(getState(result).caught).toEqual(false)
    })
})
