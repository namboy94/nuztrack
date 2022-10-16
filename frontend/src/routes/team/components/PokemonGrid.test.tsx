import {PokemonGridViewModel} from "../hooks/vm/PokemonGrid.vm";
import {TEAM, TEAM_MEMBER_1} from "../../../data/team/team.testconstants";
import {POKEDEX, POKEMON_SPECIES_BULBASAUR} from "../../../data/pokedex/pokedex.testconstants";
import {Gender, TeamState} from "../../../data/team/team.model";
import {act, fireEvent, render, screen} from "@testing-library/react";
import {PokemonGrid} from "./PokemonGrid";
import {TeamMemberSwitchEventDialogViewModel} from "../../eventAdder/hooks/vm/TeamMemberSwitchEventDialog.vm";
import {SwitchType} from "../../../data/events/events.model";
import {PokemonInfoViewModel} from "../hooks/vm/PokemonInfo.vm";

describe("PokemonGrid", () => {

    const notify = jest.fn()
    const openInfoPage = jest.fn()
    const openTeamMemberSwitchDialog = jest.fn()
    const closePopups = jest.fn()

    function renderComponent() {
        const teamMemberSwitchDialogVm: TeamMemberSwitchEventDialogViewModel = {
            state: {
                mode: SwitchType.REMOVE,
                open: false,
                pokedex: POKEDEX,
                location: "",
                locations: [],
                teamMember: null,
                activeTeamMembers: [TEAM_MEMBER_1],
                boxedTeamMembers: []
            },
            interactions: {
                openDialog: jest.fn(),
                closeDialog: jest.fn(),
                submit: jest.fn(),
                onChangeTeamMember: jest.fn(),
                onChangeLocation: jest.fn()
            }
        }
        const pokemonInfoVm: PokemonInfoViewModel = {
            state: {
                open: false,
                nickname: "",
                level: 5,
                gender: Gender.MALE,
                nature: "ADAMANT",
                species: POKEMON_SPECIES_BULBASAUR
            },
            interactions: {
                openDialog: jest.fn(),
                closeDialog: jest.fn(),
                submit: jest.fn(),
                onChangeNature: jest.fn(),
                onChangeNickname: jest.fn(),
                onChangeLevel: jest.fn(),
                onChangeGender: jest.fn(),
            }
        }
        const vm: PokemonGridViewModel = {
            state: {
                teamMembers: TEAM.getTeamMembers(),
                teamState: TeamState.ACTIVE,
                infoPageVm: pokemonInfoVm,
                teamMemberSwitchDialogVm: teamMemberSwitchDialogVm
            },
            interactions: {
                notify: notify,
                openInfoPage: openInfoPage,
                openTeamMemberSwitchDialog: openTeamMemberSwitchDialog,
                closePopups: closePopups
            }
        }
        render(<PokemonGrid {...vm}/>)
    }

    it("should show all Pokemon", () => {
        renderComponent()
        expect(screen.getAllByTestId("pokemon-card").length).toEqual(TEAM.getTeamMembers().length)
    })

    it("should press the team member switch button", () => {
        renderComponent()
        act(() => {
            fireEvent.click(screen.getAllByTestId("team-member-switch-button")[0])
        })
        expect(openTeamMemberSwitchDialog).toHaveBeenCalledTimes(1)
    })

    it("should press the info button", () => {
        renderComponent()
        act(() => {
            fireEvent.click(screen.getAllByTestId("pokemon-info-button")[0])
        })
        expect(openInfoPage).toHaveBeenCalledTimes(1)
    })

})