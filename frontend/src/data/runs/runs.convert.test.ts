import {runsConverter} from "./runs.convert";
import {NUZLOCKE_RUN, NUZLOCKE_RUN_CREATOR, NUZLOCKE_RUN_CREATOR_TO, NUZLOCKE_RUN_TO} from "./runs.testconstants";

describe("Converting runs models and TOs", () => {
    it("should convert a NuzlockeRun TO to a model", (done) => {
        expect(runsConverter.convertNuzlockeRunTOToModel(NUZLOCKE_RUN_TO)).toEqual(NUZLOCKE_RUN)
        done()
    })
    it("should convert a NuzlockeRun model to a TO", (done) => {
        expect(runsConverter.convertNuzlockeRunModelToTO(NUZLOCKE_RUN)).toEqual(NUZLOCKE_RUN_TO)
        done()
    })
    it("should convert a NuzlockeRunCreator TO to a model", (done) => {
        expect(runsConverter.convertNuzlockeRunCreatorTOToModel(NUZLOCKE_RUN_CREATOR_TO)).toEqual(NUZLOCKE_RUN_CREATOR)
        done()
    })
    it("should convert a NuzlockeRunCreator model to a TO", (done) => {
        expect(runsConverter.convertNuzlockeRunCreatorModelToTO(NUZLOCKE_RUN_CREATOR)).toEqual(NUZLOCKE_RUN_CREATOR_TO)
        done()
    })
})