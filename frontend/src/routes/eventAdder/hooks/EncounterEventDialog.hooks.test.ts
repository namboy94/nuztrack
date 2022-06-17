import {eventsService} from "../../../data/events/events.service";
import {of, throwError} from "rxjs";
import {ENCOUNTER_EVENT_FAILED, ENCOUNTER_EVENT_SUCCESSFUL} from "../../../data/events/events.testconstants";
import {pokedexService} from "../../../data/pokedex/pokedex.service";
import {NATURES, POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {gamesService} from "../../../data/games/games.service";
import {GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN} from "../../../data/games/games.testconstants";
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
        jest.spyOn(gamesService, "getGameLocations$").mockReturnValue(of(locations))
        return renderHook(() => useEncounterEventDialogProps(NUZLOCKE_RUN, notify)).result
    }

    function fillEntries(state: EncounterEventDialogState) {
        state.setLocation("ABC")
        state.setPokemonSpecies(123)
        state.setLevel(50)
        state.setGender(Gender.FEMALE)
        state.setCaught(true)
        state.setNickname("XYZ")
        state.setNature("BOLD")
        state.setAbilitySlot(3)
    }

    function expectChangedEntries(state: EncounterEventDialogState) {
        expect(state.location).toEqual("ABC")
        expect(state.pokemonSpecies).toEqual(123)
        expect(state.level).toEqual(50)
        expect(state.gender).toEqual(Gender.FEMALE)
        expect(state.caught).toEqual(true)
        expect(state.nickname).toEqual("XYZ")
        expect(state.nature).toEqual("BOLD")
        expect(state.abilitySlot).toEqual(3)
    }

    function expectDefaultEntries(state: EncounterEventDialogState) {
        expect(state.location).toEqual("")
        expect(state.pokemonSpecies).toEqual(1)
        expect(state.level).toEqual(5)
        expect(state.gender).toEqual(Gender.MALE)
        expect(state.caught).toEqual(false)
        expect(state.nickname).toEqual("")
        expect(state.nature).toEqual("ADAMANT")
        expect(state.abilitySlot).toEqual(1)
    }

    it("should test the data loading", (done) => {
        const result = createMocksAndRender().current[1]
        expect(result.locations).toEqual([GAME_LOCATION_VIRIDIAN])
        expect(result.pokedex).toEqual(POKEDEX)
        expect(result.natures).toEqual(NATURES)
        expect(eventsService.getEncounterEvents$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getPokedex$).toHaveBeenCalledTimes(1)
        expect(pokedexService.getNatures$).toHaveBeenCalledTimes(1)
        expect(gamesService.getGameLocations$).toHaveBeenCalledTimes(1)
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
            location: "ABC",
            pokedexNumber: 123,
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
})