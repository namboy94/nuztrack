import axios from "axios-observable";
import {buildResponse} from "../../util/test/axios";
import {RULES_DETAILS_TO} from "./rules.testconstants";
import {rulesApi} from "./rules.api";

describe("RulesApi", () => {
    it("should fetch the RulesDetails", (done) => {
        const apiMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse(RULES_DETAILS_TO))
        rulesApi.getRulesDetails$().subscribe({
            next: result => expect(result).toEqual(RULES_DETAILS_TO),
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})