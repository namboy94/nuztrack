import {gamesRepository} from "./games.repository";
import {GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN, GAMES} from "./games.testconstants";

describe("GamesRepository", () => {
    it("should store the Games", (done) => {
        gamesRepository.setGames(GAMES)
        gamesRepository.queryGames$().subscribe({
            next: result => {
                expect(result).toEqual(GAMES)
                done()
            }
        })
    })
    it("should store locations", (done) => {
        gamesRepository.addGameLocations([GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN])
        gamesRepository.queryGameLocations$(GAME_LOCATION_PALLET.game).subscribe({
            next: results => {
                expect(results).toEqual([GAME_LOCATION_PALLET])
                done()
            }
        })
    })
})