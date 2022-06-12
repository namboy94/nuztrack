import {gamesConverter} from "./games.convert";
import {
    GAME_LIST,
    GAME_LIST_TO,
    GAME_LOCATION_PALLET,
    GAME_LOCATION_PALLET_TO,
    MILESTONE,
    MILESTONE_TO
} from "./games.testconstants";

describe("GamesConverter", () => {
    it("should convert GameList TO to model", (done) => {
        expect(gamesConverter.convertGameListTOToModel(GAME_LIST_TO)).toEqual(GAME_LIST)
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