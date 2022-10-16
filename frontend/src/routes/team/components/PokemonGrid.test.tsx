import {PokemonGridViewModel} from "../hooks/vm/PokemonGrid.vm";
import {TEAM, TEAM_MEMBER_1} from "../../../data/team/team.testconstants";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {TeamState} from "../../../data/team/team.model";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import {PokemonGrid} from "./PokemonGrid";
import {TeamMemberSwitchEventDialogViewModel} from "../../eventAdder/hooks/vm/TeamMemberSwitchEventDialog.vm";
import {SwitchType} from "../../../data/events/events.model";

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
        const vm: PokemonGridViewModel = {
            state: {
                pokedex: POKEDEX,
                teamMembers: TEAM.getTeamMembers(),
                teamState: TeamState.ACTIVE,
                run: NUZLOCKE_RUN,
                selectedTeamMember: null,
                infoPageOpen: false,
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

})