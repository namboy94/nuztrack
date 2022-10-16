import {PokemonGridItem, PokemonGridItemProps} from "./PokemonGridItem";
import {GAME_1} from "../../../data/games/games.testconstants";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {TEAM_MEMBER_1} from "../../../data/team/team.testconstants";
import {TeamState} from "../../../data/team/team.model";
import {act, fireEvent, render, screen} from "@testing-library/react";

describe("PokemonGridItem", () => {

    const openTeamMemberSwitchDialog = jest.fn()
    const openInfoPage = jest.fn()

    function renderComponent() {
        const props: PokemonGridItemProps = {
            game: GAME_1,
            openTeamMemberSwitchDialog: openTeamMemberSwitchDialog,
            openInfoPage: openInfoPage,
            pokedex: POKEDEX,
            teamMember: TEAM_MEMBER_1,
            teamState: TeamState.ACTIVE
        }
        render(<PokemonGridItem {...props}/>)
    }

    it("should render the Pokemon", () => {
        renderComponent()
        expect(screen.getByTestId("pokemon-title")).toBeInTheDocument()
        expect(screen.getByTestId("pokemon-card-image")).toBeInTheDocument()
        expect(screen.getByTestId("team-member-switch-button")).toBeInTheDocument()
        expect(screen.getByTestId("info-button")).toBeInTheDocument()
    })

    it("should press the team member switch button", () => {
        renderComponent()
        act(() => {
            fireEvent.click(screen.getByTestId("team-member-switch-button"))
        })
        expect(openTeamMemberSwitchDialog).toHaveBeenCalledTimes(1)
    })

    it("should press the info page button", () => {
        renderComponent()
        act(() => {
            fireEvent.click(screen.getByTestId("info-button"))
        })
        expect(openInfoPage).toHaveBeenCalledTimes(1)
    })

    it("should press the sprite and show the info page", () => {
        renderComponent()
        act(() => {
            fireEvent.click(screen.getByTestId("pokemon-card-image"))
        })
        expect(openInfoPage).toHaveBeenCalledTimes(1)
    })

})