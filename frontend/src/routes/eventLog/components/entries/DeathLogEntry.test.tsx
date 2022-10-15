import {render, screen} from "@testing-library/react";
import {DeathLogEntry} from "./DeathLogEntry";
import {DEATH_EVENT} from "../../../../data/events/events.testconstants";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {TEAM} from "../../../../data/team/team.testconstants";

describe("DeathLogEntry", () => {

    function renderComponent() {
        render(<DeathLogEntry event={DEATH_EVENT} pokedex={POKEDEX} team={TEAM}/>)
    }

    it("should display the event correctly", () => {
        renderComponent()
        const entry = screen.getByTestId("death-log-entry")

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain("died fighting against")
        expect(entry.textContent).toContain(DEATH_EVENT.opponent)
        expect(entry.textContent).toContain(DEATH_EVENT.description)
        expect(entry.textContent).toContain(DEATH_EVENT.location)
        expect(entry.textContent).toContain(TEAM.getTeamMemberById(DEATH_EVENT.teamMemberId)!!.nickname)
    })

})