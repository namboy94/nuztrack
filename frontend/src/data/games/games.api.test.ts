import axios from "axios-observable";
import {buildResponse} from "../../util/test/axios";
import {GAME_LIST_TO, GAME_LOCATION_PALLET_TO, GAME_LOCATION_VIRIDIAN_TO} from "./games.testconstants";
import {gamesApi} from "./games.api";

describe("GamesApi", () => {
    it("should get all games", (done) => {
        const getMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse(GAME_LIST_TO))
        gamesApi.getGameList$().subscribe({
            next: x => {
                expect(x).toEqual(GAME_LIST_TO)
            },
            complete: () => {
                expect(getMock).toHaveBeenCalledWith(`/api/games`)
                expect(getMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should get all locations for a game", (done) => {
        const expected = [GAME_LOCATION_PALLET_TO, GAME_LOCATION_VIRIDIAN_TO]
        const getMock = jest.spyOn(axios, "get").mockReturnValue(buildResponse(expected))
        gamesApi.getGameLocations$("RED").subscribe({
            next: x => {
                expect(x).toEqual(expected)
            },
            complete: () => {
                expect(getMock).toHaveBeenCalledWith(`/api/games/RED/locations`)
                expect(getMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})