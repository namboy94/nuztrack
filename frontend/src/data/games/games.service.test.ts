import {of} from "rxjs";
import {gamesApi} from "./games.api";
import {GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN, GAMES, GAMES_TO} from "./games.testconstants";
import {gamesRepository} from "./games.repository";
import {gamesService} from "./games.service";

describe("GamesService", () => {
    it("should load the GameList", (done) => {
        const apiMock = jest.spyOn(gamesApi, "getGames$").mockReturnValue(of(GAMES_TO))
        const repoMock = jest.spyOn(gamesRepository, "setGames").mockImplementation()
        gamesService.loadGames$().subscribe({
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledWith(GAMES)
                done()
            }
        })
    })
    it("should load the GameLocations", (done) => {
        const apiMock = jest.spyOn(gamesApi, "getGameLocations$").mockReturnValue(
            of([GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN])
        )
        const repoMock = jest.spyOn(gamesRepository, "addGameLocations").mockImplementation()
        gamesService.loadGameLocations$(GAME_LOCATION_PALLET.game).subscribe({
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledWith([GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN])
                done()
            }
        })
    })
    it("should fetch existing GameList", (done) => {
        const apiMock = jest.spyOn(gamesApi, "getGames$").mockImplementation()
        const repoMock = jest.spyOn(gamesRepository, "queryGames$").mockReturnValue(of(GAMES))
        gamesService.getGames$().subscribe({
            next: result => expect(result).toEqual(GAMES),
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(0)
                expect(repoMock).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should fetch existing GameLocations", (done) => {
        const apiMock = jest.spyOn(gamesApi, "getGameLocations$").mockImplementation()
        const repoMock = jest.spyOn(gamesRepository, "queryGameLocations$")
            .mockReturnValue(of([GAME_LOCATION_PALLET]))
        gamesService.getGameLocations$(GAME_LOCATION_PALLET.game).subscribe({
            next: result => expect(result).toEqual([GAME_LOCATION_PALLET]),
            complete: () => {
                expect(apiMock).toHaveBeenCalledTimes(0)
                expect(repoMock).toHaveBeenCalledTimes(1)
                expect(repoMock).toHaveBeenCalledWith(GAME_LOCATION_PALLET.game)
                done()
            }
        })
    })
})