import {rulesConverter} from "./rules.convert";
import {RULES_DETAILS, RULES_DETAILS_TO} from "./rules.testconstants";

describe("RulesConverter", () => {
    it("should convert RulesDetails TO to model", (done) => {
        expect(rulesConverter.convertRulesDetailsTOToModel(RULES_DETAILS_TO)).toEqual(RULES_DETAILS)
        done()
    })
})