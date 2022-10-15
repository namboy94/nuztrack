import {PokemonGridViewModel} from "../hooks/vm/PokemonGrid.vm";
import {TEAM} from "../../../data/team/team.testconstants";
import {POKEDEX} from "../../../data/pokedex/pokedex.testconstants";
import {TeamState} from "../../../data/team/team.model";
import {NUZLOCKE_RUN} from "../../../data/runs/runs.testconstants";
import {render, screen} from "@testing-library/react";
import {PokemonGrid} from "./PokemonGrid";

describe("PokemonGrid", () => {

    const notify = jest.fn()

    function renderComponent() {
        const vm: PokemonGridViewModel = {
            state: {
                pokedex: POKEDEX,
                teamMembers: TEAM.getTeamMembers(),
                teamState: TeamState.ACTIVE,
                run: NUZLOCKE_RUN
            },
            interactions: {
                notify: notify
            }
        }
        render(<PokemonGrid {...vm}/>)
    }

    it("should show all Pokemon", () => {
        renderComponent()
        expect(screen.getAllByTestId("team-member-card").length).toEqual(TEAM.getTeamMembers().length)
    })

})