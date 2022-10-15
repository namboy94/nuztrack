import {render, screen} from "@testing-library/react";
import {TeamMemberSwitchLogEntry} from "./TeamMemberSwitchLogEntry";
import {
    EVENT_REGISTRY,
    TEAM_MEMBER_SWITCH_EVENT,
    TEAM_MEMBER_SWITCH_REMOVE_EVENT
} from "../../../../data/events/events.testconstants";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";
import {TEAM} from "../../../../data/team/team.testconstants";
import {TeamMemberSwitchEvent} from "../../../../data/events/events.model";

describe("TeamMemberSwitchLogEntry", () => {

    function renderComponent(event: TeamMemberSwitchEvent) {
        render(<TeamMemberSwitchLogEntry event={event} eventRegistry={EVENT_REGISTRY} pokedex={POKEDEX} team={TEAM}/>)
    }

    it("should display a team member add event correctly", () => {
        renderComponent(TEAM_MEMBER_SWITCH_EVENT)
        const entry = screen.getByTestId("team-member-switch-log-entry")

        const nickname = TEAM.getTeamMemberById(TEAM_MEMBER_SWITCH_EVENT.teamMemberId)!!.nickname

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain(`Added ${nickname} to the active party`)
        expect(entry.textContent).toContain(TEAM_MEMBER_SWITCH_EVENT.location)
    })

    it("should display a team member remove event correctly", () => {
        renderComponent(TEAM_MEMBER_SWITCH_REMOVE_EVENT)
        const entry = screen.getByTestId("team-member-switch-log-entry")

        const nickname = TEAM.getTeamMemberById(TEAM_MEMBER_SWITCH_REMOVE_EVENT.teamMemberId)!!.nickname

        expect(entry).toBeInTheDocument()
        expect(entry.textContent).toContain(`Removed ${nickname} from the active party`)
        expect(entry.textContent).toContain(TEAM_MEMBER_SWITCH_REMOVE_EVENT.location)
    })

})