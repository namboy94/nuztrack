import {
    GAME_LOCATION_PALLET,
    GAME_LOCATION_PEWTER,
    GAME_LOCATION_VIRIDIAN,
    LOCATION_REGISTRY,
    MILESTONE,
    MILESTONE_2
} from "./games.testconstants";

describe("GamesModel", () => {
    it("should get a location by its name", () => {
        expect(LOCATION_REGISTRY.getLocationByName(GAME_LOCATION_PALLET.name)).toEqual(GAME_LOCATION_PALLET)
    })
    it("should get null for a location by its name if it does not exist", () => {
        expect(LOCATION_REGISTRY.getLocationByName("DoesNotExist")).toEqual(null)
    })
    it("should get location list", () => {
        expect(LOCATION_REGISTRY.getLocationNames()).toEqual([
            GAME_LOCATION_PALLET.name,
            GAME_LOCATION_VIRIDIAN.name,
            GAME_LOCATION_PEWTER.name
        ])
    })
    it("should get the milestones", () => {
        expect(LOCATION_REGISTRY.getMilestones()).toEqual([MILESTONE, MILESTONE_2])
    })
    it("should get the milestone using its name", () => {
        expect(LOCATION_REGISTRY.getMilestoneByName(MILESTONE.name)).toEqual(MILESTONE)
    })
})
