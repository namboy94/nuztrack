import {GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN, LOCATION_REGISTRY} from "./games.testconstants";

describe("GamesModel", () => {
    it("should get a location by its name", (done) => {
        expect(LOCATION_REGISTRY.getLocationByName(GAME_LOCATION_PALLET.name)).toEqual(GAME_LOCATION_PALLET)
        done()
    })
    it("should get null for a location by its name if it does not exist", (done) => {
        expect(LOCATION_REGISTRY.getLocationByName("DoesNotExist")).toEqual(null)
        done()
    })
    it("should get location list", (done) => {
        expect(LOCATION_REGISTRY.getLocationNames()).toEqual([GAME_LOCATION_PALLET.name, GAME_LOCATION_VIRIDIAN.name])
        done()
    })
})
