import {render, screen} from "@testing-library/react";
import {EvolutionLogEntry} from "./EvolutionLogEntry";
import {DEATH_EVENT, EVOLUTION_EVENT} from "../../../../data/events/events.testconstants";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {TEAM} from "../../../../data/team/team.testconstants";

describe("EvolutionLogEntry", () => {

    function renderComponent() {
        render(<EvolutionLogEntry event={EVOLUTION_EVENT} pokedex={POKEDEX} team={TEAM}/>)
    }

    it("should display the event correctly", () => {
        renderComponent()
        const entry = screen.getByTestId("evolution-log-entry")

        const nickname = TEAM.getTeamMemberById(DEATH_EVENT.teamMemberId)!!.nickname
        const species = POKEDEX.getSpecies(EVOLUTION_EVENT.newPokedexNumber).name
        const level = EVOLUTION_EVENT.level

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain(`${nickname} evolved into a ${species} at level ${level}`)
        expect(entry.textContent).toContain(EVOLUTION_EVENT.location)
    })

})