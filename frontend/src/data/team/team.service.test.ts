import {teamApi} from "./team.api";
import {TEAM, TEAM_MEMBER_1, TEAM_MEMBER_2, TEAM_MEMBER_3, TEAM_TO} from "./team.testconstants";
import {of} from "rxjs";
import {teamRepository} from "./team.repository";
import {teamService} from "./team.service";
import {TeamState} from "./team.model";

describe("TeamService", () => {
    const runId = TEAM[0].runId
    it("should load team", (done) => {
        jest.spyOn(teamApi, "getTeam$").mockReturnValue(of(TEAM_TO))
        jest.spyOn(teamRepository, "setTeamMembers").mockImplementation(jest.fn())
        teamService.loadTeam$(runId).subscribe({
            complete: () => {
                expect(teamApi.getTeam$).toHaveBeenCalledTimes(1)
                expect(teamApi.getTeam$).toHaveBeenCalledWith(runId)
                expect(teamRepository.setTeamMembers).toHaveBeenCalledTimes(1)
                expect(teamRepository.setTeamMembers).toHaveBeenCalledWith(TEAM)
                done()
            }
        })
    })
    it("should get the entire team", (done) => {
        jest.spyOn(teamRepository, "queryTeamMembers$").mockReturnValue(of(TEAM))
        teamService.getTeam$(runId).subscribe({
            next: result => {
                expect(result).toEqual(TEAM)
                expect(teamRepository.queryTeamMembers$).toHaveBeenCalledTimes(1)
                expect(teamRepository.queryTeamMembers$).toHaveBeenCalledWith(runId)
                done()
            }
        })
    })
    it("should get the active team members", (done) => {
        jest.spyOn(teamRepository, "queryTeamMembersByTeamState$").mockReturnValue(of([TEAM_MEMBER_1]))
        teamService.getActiveTeamMembers$(runId).subscribe({
            next: result => {
                expect(result).toEqual([TEAM_MEMBER_1])
                expect(teamRepository.queryTeamMembersByTeamState$).toHaveBeenCalledTimes(1)
                expect(teamRepository.queryTeamMembersByTeamState$).toHaveBeenCalledWith(runId, TeamState.ACTIVE)
                done()
            }
        })
    })
    it("should get the boxed team members", (done) => {
        jest.spyOn(teamRepository, "queryTeamMembersByTeamState$").mockReturnValue(of([TEAM_MEMBER_3]))
        teamService.getBoxedTeamMembers$(runId).subscribe({
            next: result => {
                expect(result).toEqual([TEAM_MEMBER_3])
                expect(teamRepository.queryTeamMembersByTeamState$).toHaveBeenCalledTimes(1)
                expect(teamRepository.queryTeamMembersByTeamState$).toHaveBeenCalledWith(runId, TeamState.BOXED)
                done()
            }
        })
    })
    it("should get the dead team members", (done) => {
        jest.spyOn(teamRepository, "queryTeamMembersByTeamState$").mockReturnValue(of([TEAM_MEMBER_2]))
        teamService.getDeadTeamMembers$(runId).subscribe({
            next: result => {
                expect(result).toEqual([TEAM_MEMBER_2])
                expect(teamRepository.queryTeamMembersByTeamState$).toHaveBeenCalledTimes(1)
                expect(teamRepository.queryTeamMembersByTeamState$).toHaveBeenCalledWith(runId, TeamState.DEAD)
                done()
            }
        })
    })
})