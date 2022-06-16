import {TEAM_MEMBER_1, TEAM_MEMBER_2, TEAM_MEMBER_3} from "./team.testconstants";
import {teamRepository} from "./team.repository";
import {TeamState} from "./team.model";

describe("TeamRepository", () => {

    const runId = TEAM_MEMBER_1.runId
    const teamMembers = [TEAM_MEMBER_1, TEAM_MEMBER_2, TEAM_MEMBER_3]

    beforeEach(() => {
        teamRepository.setTeamMembers(teamMembers)
    })

    it("should add team members", (done) => {
        teamRepository.setTeamMembers([])
        teamRepository.addTeamMember(TEAM_MEMBER_1)
        teamRepository.addTeamMember(TEAM_MEMBER_2)
        teamRepository.queryTeamMembers$(runId).subscribe({
            next: result => {
                expect(result).toEqual([TEAM_MEMBER_1, TEAM_MEMBER_2])
                done()
            }
        })
    })

    it("should get all team members", (done) => {
        teamRepository.queryTeamMembers$(runId).subscribe({
            next: result => {
                expect(result).toEqual(teamMembers)
                done()
            }
        })
    })

    it("should get team members by team state", (done) => {
        teamRepository.queryTeamMembersByTeamState$(runId, TeamState.ACTIVE).subscribe({
            next: result => {
                expect(result).toEqual([TEAM_MEMBER_1])
                done()
            }
        })
    })
})