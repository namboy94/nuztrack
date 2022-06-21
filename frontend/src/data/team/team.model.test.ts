import {TEAM, TEAM_MEMBER_1, TEAM_MEMBERS} from "./team.testconstants";

describe("Team", () => {
    it("should get all team members", (done) => {
        expect(TEAM.getTeamMembers()).toEqual(TEAM_MEMBERS)
        done()
    })
    it("should get a team member by tehir ID", (done) => {
        expect(TEAM.getTeamMemberById(TEAM_MEMBER_1.id)).toEqual(TEAM_MEMBER_1)
        done()
    })
})