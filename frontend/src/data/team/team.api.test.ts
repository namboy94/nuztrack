import axios from "axios-observable";
import {buildResponse} from "../../util/test/axios";
import {TEAM_TO} from "./team.testconstants";
import {teamApi} from "./team.api";

describe("TeamApi", () => {
    it("should get the team from the API", (done) => {
        const getMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse(TEAM_TO))
        teamApi.getTeam$(1).subscribe({
            next: x => {
                expect(x).toEqual(TEAM_TO)
            },
            complete: () => {
                expect(getMock).toHaveBeenCalledWith(`/api/team/1`)
                expect(getMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})