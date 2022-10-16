import {pokedexService} from "../../../../data/pokedex/pokedex.service";
import {of} from "rxjs";
import {POKEDEX, POKEMON_SPECIES_SQUIRTLE} from "../../../../data/pokedex/pokedex.testconstants";
import {act, renderHook} from "@testing-library/react";
import {getInteractions, getState} from "../../../../util/viewmodel";
import {TEAM_MEMBER_1} from "../../../../data/team/team.testconstants";
import {PokemonInfoViewModel, usePokemonInfoViewModel} from "./PokemonInfo.vm";
import {Gender} from "../../../../data/team/team.model";

describe("PokemonInfoViewModel", () => {
    function createMocksAndRender(): { current: PokemonInfoViewModel } {
        jest.spyOn(pokedexService, "getPokedex$").mockReturnValue(of(POKEDEX))
        return renderHook(() => usePokemonInfoViewModel()).result
    }

    function fillEntries(result: { current: PokemonInfoViewModel }) {
        act((() => getInteractions(result).onChangeNickname("NewNick")))
        act((() => getInteractions(result).onChangeLevel(55)))
        act((() => getInteractions(result).onChangeGender(Gender.NEUTRAL)))
        act((() => getInteractions(result).onChangeNature("JOLLY")))
    }

    function expectDefaults(result: { current: PokemonInfoViewModel }) {
        expect(getState(result).nickname).toEqual(TEAM_MEMBER_1.nickname)
        expect(getState(result).gender).toEqual(TEAM_MEMBER_1.gender)
        expect(getState(result).nature).toEqual(TEAM_MEMBER_1.nature)
        expect(getState(result).level).toEqual(TEAM_MEMBER_1.level)
        expect(getState(result).species).toEqual(POKEMON_SPECIES_SQUIRTLE)
    }

    it("should supply all relevant information after opening the dialog", () => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog(TEAM_MEMBER_1))

        expect(getState(result).open).toEqual(true)
        expectDefaults(result)
    })

    it("should correctly fill the entries", () => {
        const result = createMocksAndRender()

        act(() => getInteractions(result).openDialog(TEAM_MEMBER_1))
        fillEntries(result)

        expect(getState(result).nickname).toEqual("NewNick")
        expect(getState(result).gender).toEqual(Gender.NEUTRAL)
        expect(getState(result).nature).toEqual("JOLLY")
        expect(getState(result).level).toEqual(55)

        act(getInteractions(result).closeDialog)
        act(() => getInteractions(result).openDialog(TEAM_MEMBER_1))

        expectDefaults(result)
    })
})