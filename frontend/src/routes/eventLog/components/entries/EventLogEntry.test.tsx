import {Event} from "../../../../data/events/events.model";
import {render, screen} from "@testing-library/react";
import {EventLogEntry} from "./EventLogEntry";
import {
    DEATH_EVENT,
    ENCOUNTER_EVENT_SUCCESSFUL,
    EVENT_REGISTRY,
    EVOLUTION_EVENT,
    MILESTONE_EVENT,
    NOTE_EVENT,
    TEAM_MEMBER_SWITCH_EVENT
} from "../../../../data/events/events.testconstants";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {TEAM} from "../../../../data/team/team.testconstants";
import {LOCATION_REGISTRY} from "../../../../data/games/games.testconstants";

describe("EventLogEntry", () => {

    function renderComponent(event: Event) {
        render(<EventLogEntry
            event={event}
            eventRegistry={EVENT_REGISTRY}
            pokedex={POKEDEX}
            team={TEAM}
            locationRegistry={LOCATION_REGISTRY}
        />)
    }

    it("should correctly render an encounter event", () => {
        renderComponent(ENCOUNTER_EVENT_SUCCESSFUL)
        expect(screen.getByTestId("encounter-log-entry")).toBeInTheDocument()
    })
    it("should correctly render an evolution event", () => {
        renderComponent(EVOLUTION_EVENT)
        expect(screen.getByTestId("evolution-log-entry")).toBeInTheDocument()
    })
    it("should correctly render a death event", () => {
        renderComponent(DEATH_EVENT)
        expect(screen.getByTestId("death-log-entry")).toBeInTheDocument()
    })
    it("should correctly render a team member switch event", () => {
        renderComponent(TEAM_MEMBER_SWITCH_EVENT)
        expect(screen.getByTestId("team-member-switch-log-entry")).toBeInTheDocument()
    })
    it("should correctly render a milestone event", () => {
        renderComponent(MILESTONE_EVENT)
        expect(screen.getByTestId("milestone-log-entry")).toBeInTheDocument()
    })
    it("should correctly render a note event", () => {
        renderComponent(NOTE_EVENT)
        expect(screen.getByTestId("note-log-entry")).toBeInTheDocument()
    })
    it("should fall back to empty tag", () => {
        // @ts-ignore
        const dummy: Event = {...DEATH_EVENT, type: ""}
        renderComponent(dummy)
        expect(screen.queryAllByTestId("death-log-entry").length).toEqual(0)
    })
})