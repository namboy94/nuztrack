import {of} from "rxjs";
import {rulesApi} from "./rules.api";
import {RULES_DETAILS, RULES_DETAILS_TO} from "./rules.testconstants";
import {rulesRepository} from "./rules.repository";
import {rulesService} from "./rules.service";

describe("RulesService", () => {
    it("should load the RulesDetails", (done) => {
        const apiMock = jest.spyOn(rulesApi, "getRulesDetails$").mockReturnValue(of(RULES_DETAILS_TO))
        const repoMock = jest.spyOn(rulesRepository, "setRulesDetails").mockImplementation()
        rulesService.loadRulesDetails$().subscribe({
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should get the existing RulesDetails", (done) => {
        const apiMock = jest.spyOn(rulesApi, "getRulesDetails$").mockImplementation()
        const repoMock = jest.spyOn(rulesRepository, "queryRulesDetails$").mockReturnValue(of(RULES_DETAILS))
        rulesService.getRulesDetails$().subscribe({
            next: result => expect(result).toEqual(RULES_DETAILS),
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(0)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})