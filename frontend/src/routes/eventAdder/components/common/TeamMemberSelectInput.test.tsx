import {fireEvent, render, screen, within} from "@testing-library/react";
import {TeamMemberSelectInput} from "./TeamMemberSelectInput";
import {TEAM_MEMBER_1, TEAM_MEMBER_3, TEAM_MEMBERS} from "../../../../data/team/team.testconstants";
import {TeamState} from "../../../../data/team/team.model";
import {POKEDEX} from "../../../../data/pokedex/pokedex.testconstants";

describe("TeamMemberSelectInput", () => {

    const setTeamMember = jest.fn()

    function renderComponent() {
        render(<TeamMemberSelectInput
            teamMember={TEAM_MEMBER_1}
            setTeamMember={setTeamMember}
            activeTeamMembers={TEAM_MEMBERS.filter(x => x.teamState == TeamState.ACTIVE)}
            boxedTeamMembers={TEAM_MEMBERS.filter(x => x.teamState == TeamState.BOXED)}
            pokedex={POKEDEX}
        />)
    }

    it("should select a team member", () => {
        renderComponent()
        const teamMemberInput = screen.getByTestId("team-member-input")

        fireEvent.focus(teamMemberInput)
        fireEvent.change(
            within(teamMemberInput).getByRole("combobox"),
            {target: {value: TEAM_MEMBER_3.nickname}}
        )
        fireEvent.keyDown(teamMemberInput, {key: "ArrowDown"})
        fireEvent.keyDown(teamMemberInput, {key: "Enter"})

        expect(setTeamMember).toHaveBeenCalledTimes(1)
        expect(setTeamMember).toHaveBeenCalledWith(TEAM_MEMBER_3)
    })
})