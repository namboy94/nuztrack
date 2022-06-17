import {gamesConverter} from "./games.convert";
import {
    GAME_1,
    GAME_1_TO,
    GAME_2,
    GAME_2_TO,
    GAME_LOCATION_PALLET,
    GAME_LOCATION_PALLET_TO,
    MILESTONE,
    MILESTONE_TO
} from "./games.testconstants";

describe("GamesConverter", () => {
    it("should convert Game TO to model", (done) => {
        expect(gamesConverter.convertGameTOToModel(GAME_1_TO)).toEqual(GAME_1)
        expect(gamesConverter.convertGameTOToModel(GAME_2_TO)).toEqual(GAME_2)
        done()
    })
    it("should convert GameLocation TO to model", (done) => {
        expect(gamesConverter.convertGameLocationTOToModel(GAME_LOCATION_PALLET_TO)).toEqual(GAME_LOCATION_PALLET)
        done()
    })
    it("should convert Milestone TO to model", (done) => {
        expect(gamesConverter.convertMilestoneTOToModel(MILESTONE_TO)).toEqual(MILESTONE)
        done()
    })
})