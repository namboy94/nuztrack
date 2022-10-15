import {render, screen} from "@testing-library/react";
import {EncounterLogEntry} from "./EncounterLogEntry";
import {ENCOUNTER_EVENT_FAILED, ENCOUNTER_EVENT_SUCCESSFUL} from "../../../../data/events/events.testconstants";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {TEAM} from "../../../../data/team/team.testconstants";
import {EncounterEvent} from "../../../../data/events/events.model";

describe("EncounterLogEntry", () => {

    function renderComponent(event: EncounterEvent) {
        render(<EncounterLogEntry event={event} pokedex={POKEDEX} team={TEAM}/>)
    }

    it("should display a successful encounter event correctly", () => {
        renderComponent(ENCOUNTER_EVENT_SUCCESSFUL)
        const entry = screen.getByTestId("encounter-log-entry")

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain("Caught")
        expect(entry.textContent).toContain(`at level ${ENCOUNTER_EVENT_SUCCESSFUL.level}`)
        expect(entry.textContent).toContain(ENCOUNTER_EVENT_SUCCESSFUL.location)
        expect(entry.textContent).toContain(POKEDEX.getSpecies(ENCOUNTER_EVENT_SUCCESSFUL.pokedexNumber)!!.name)
        expect(entry.textContent).toContain(TEAM.getTeamMemberById(ENCOUNTER_EVENT_SUCCESSFUL.teamMemberId!!)!!.nickname)
    })

    it("should display an unsuccessful encounter event correctly", () => {
        renderComponent(ENCOUNTER_EVENT_FAILED)
        const entry = screen.getByTestId("encounter-log-entry")

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain("Encountered")
        expect(entry.textContent).not.toContain("Caught")
        expect(entry.textContent).toContain(`at level ${ENCOUNTER_EVENT_FAILED.level}`)
        expect(entry.textContent).toContain(ENCOUNTER_EVENT_FAILED.location)
        expect(entry.textContent).toContain(POKEDEX.getSpecies(ENCOUNTER_EVENT_FAILED.pokedexNumber)!!.name)
    })

})