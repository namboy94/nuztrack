import {of, throwError} from "rxjs";
import {POKEMON_SPECIES_WARTORTLE} from "../../../../data/pokedex/pokedex.testconstants";
import {act, renderHook} from "@testing-library/react";
import {TEAM_MEMBER_1, TEAM_MEMBER_3} from "../../../../data/team/team.testconstants";
import {EvolutionEventDialogViewModel, useEvolutionEventDialogViewModel} from "./EvolutionEventDialog.vm";
import {NUZLOCKE_RUN} from "../../../../data/runs/runs.testconstants";
import {eventsService} from "../../../../data/events/events.service";
import {EVOLUTION_EVENT} from "../../../../data/events/events.testconstants";
import {CreateEvolutionEvent} from "../../../../data/events/events.model";
import {getInteractions, getState} from "../../../../util/viewmodel";
import {createMocksForTeamMemberEventViewModel} from "./TeamMemberEvent.vm.test";

describe("useEvolutionEventDialogViewModel", () => {

    const notify = jest.fn()

    function createMocksAndRender(): { current: EvolutionEventDialogViewModel } {
        createMocksForTeamMemberEventViewModel()
        return renderHook(() => useEvolutionEventDialogViewModel(NUZLOCKE_RUN, notify)).result
    }

    function fillFields(hookResult: { current: EvolutionEventDialogViewModel }) {
        const interactions = getInteractions(hookResult)
        act(() => {
            interactions.onChangeLocation("LOCATION")
            interactions.onChangeTeamMember(TEAM_MEMBER_1)
            interactions.onChangeLevel(16)
            interactions.onChangeEvolutionTarget(POKEMON_SPECIES_WARTORTLE)
        })
    }

    it("should reset if closed", () => {
        const result = createMocksAndRender()
        fillFields(result)

        act(getInteractions(result).closeDialog)

        expect(getState(result).evolutionTarget).toEqual(null)
    })

    it("should reset level and evolution target if team member is switched", () => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)

        act(() => getInteractions(result).onChangeTeamMember(TEAM_MEMBER_3))

        expect(getState(result).level).toEqual(TEAM_MEMBER_3.level)
        expect(getState(result).evolutionTarget).toEqual(null)
    })

    it("should submit successfully", () => {
        jest.spyOn(eventsService, "createEvolutionEvent$").mockReturnValue(of(EVOLUTION_EVENT))

        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)
        act(() => getInteractions(result).submit())

        const expected: CreateEvolutionEvent = {
            location: "LOCATION",
            teamMemberId: TEAM_MEMBER_1.id,
            newPokedexNumber: POKEMON_SPECIES_WARTORTLE.pokedexNumber,
            level: 16
        }
        expect(eventsService.createEvolutionEvent$).toHaveBeenCalledTimes(1)
        expect(eventsService.createEvolutionEvent$).toHaveBeenCalledWith(NUZLOCKE_RUN.id, expected)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith(expect.anything(), "success")

    })

    it("should submit unsuccessfully", (done) => {
        jest.spyOn(eventsService, "createEvolutionEvent$").mockReturnValue(throwError(() => {
            throw {response: {data: {reason: "TEST"}}}
        }))

        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog())
        fillFields(result)
        act(() => getInteractions(result).submit())

        expect(eventsService.createEvolutionEvent$).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledTimes(1)
        expect(notify).toHaveBeenCalledWith("Failed to create Evolution Event: 'TEST'", "error")
        done()
    })
})