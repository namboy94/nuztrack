import {teamConverter} from "./team.convert";
import {TEAM, TEAM_MEMBER_1, TEAM_MEMBER_1_TO, TEAM_TO} from "./team.testconstants";

describe("TeamConverter", () => {
    it("should convert a TeamMember TO to model", (done) => {
        const converted = teamConverter.convertTeamMemberTOToModel(
            TEAM_MEMBER_1_TO, TEAM_MEMBER_1.teamState, TEAM_MEMBER_1.runId
        )
        expect(converted).toEqual(TEAM_MEMBER_1)
        done()
    })
    it("should convert a Team TO to list of TeamMembers", (done) => {
        const converted = teamConverter.convertTeamToTeamMembers(TEAM_TO, TEAM[0].runId)
        expect(converted).toEqual(TEAM)
        done()
    })
})