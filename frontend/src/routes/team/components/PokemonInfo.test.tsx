import {POKEMON_SPECIES_SQUIRTLE} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1} from "../../../data/team/team.testconstants";
import {render, screen} from "@testing-library/react";
import {PokemonInfoViewModel} from "../hooks/vm/PokemonInfo.vm";
import {PokemonInfo} from "./PokemonInfo";

describe("PokemonInfo", () => {

    const onChangeNickname = jest.fn()
    const onChangeLevel = jest.fn()
    const onChangeNature = jest.fn()
    const onChangeGender = jest.fn()
    const openDialog = jest.fn()
    const closeDialog = jest.fn()
    const submit = jest.fn()

    function renderComponent() {
        const vm: PokemonInfoViewModel = {
            state: {
                open: true,
                nickname: TEAM_MEMBER_1.nickname,
                level: TEAM_MEMBER_1.level,
                gender: TEAM_MEMBER_1.gender,
                nature: TEAM_MEMBER_1.nature,
                species: POKEMON_SPECIES_SQUIRTLE
            },
            interactions: {
                onChangeNickname: onChangeNickname,
                onChangeNature: onChangeNature,
                onChangeLevel: onChangeLevel,
                onChangeGender: onChangeGender,
                openDialog: openDialog,
                closeDialog: closeDialog,
                submit: submit
            }
        }
        render(<PokemonInfo {...vm}/>)
    }

    it("should render the Pokemon Info", () => {
        renderComponent()
        expect(screen.getByTestId("pokemon-info-title").textContent).toContain(TEAM_MEMBER_1.nickname)
    })

})