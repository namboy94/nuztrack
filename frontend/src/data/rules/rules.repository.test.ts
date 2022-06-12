import {rulesRepository} from "./rules.repository";
import {RULES_DETAILS} from "./rules.testconstants";

describe("RulesRepository", () => {
    it("should set and get RulesDetails", (done) => {
        rulesRepository.setRulesDetails(RULES_DETAILS)
        rulesRepository.queryRulesDetails$().subscribe({
            next: result => {
                expect(result).toEqual(RULES_DETAILS)
                done()
            }
        })
    })
})