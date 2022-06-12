import {gamesRepository} from "./games.repository";
import {GAME_LIST, GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN} from "./games.testconstants";

describe("GamesRepository", () => {
    it("should store the GameList", (done) => {
        gamesRepository.setGameList(GAME_LIST)
        gamesRepository.queryGameList$().subscribe({
            next: result => {
                expect(result).toEqual(GAME_LIST)
                done()
            }
        })
    })
    it("should store locations", (done) => {
        gamesRepository.addGameLocations([GAME_LOCATION_PALLET, GAME_LOCATION_VIRIDIAN])
        gamesRepository.queryGameLocations$(GAME_LOCATION_PALLET.gameKey).subscribe({
            next: results => {
                expect(results).toEqual([GAME_LOCATION_PALLET])
                done()
            }
        })
    })
})