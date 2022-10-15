import {runsConverter} from "./runs.convert";
import {
    MULTI_RUN_CREATOR,
    MULTI_RUN_CREATOR_TO,
    MULTI_RUN_OPTION,
    MULTI_RUN_OPTION_TO,
    NUZLOCKE_RUN,
    NUZLOCKE_RUN_CREATOR,
    NUZLOCKE_RUN_CREATOR_TO,
    NUZLOCKE_RUN_TO
} from "./runs.testconstants";

describe("Converting runs models and TOs", () => {
    it("should convert a NuzlockeRun TO to a model", () => {
        expect(runsConverter.convertNuzlockeRunTOToModel(NUZLOCKE_RUN_TO)).toEqual(NUZLOCKE_RUN)
    })
    it("should convert a NuzlockeRunCreator model to a TO", () => {
        expect(runsConverter.convertNuzlockeRunCreatorModelToTO(NUZLOCKE_RUN_CREATOR)).toEqual(NUZLOCKE_RUN_CREATOR_TO)
    })
    it("should convert a MultiRunCreator model to a TO", () => {
        expect(runsConverter.convertCreateMultiRunModelToTO(MULTI_RUN_CREATOR)).toEqual(MULTI_RUN_CREATOR_TO)
    })
    it("should convert a MultiRunOption TO to a model", () => {
        expect(runsConverter.convertMultiRunOptionTOToModel(MULTI_RUN_OPTION_TO)).toEqual(MULTI_RUN_OPTION)
    })
})