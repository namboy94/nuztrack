import {pokedexRepository} from "./pokedex.repository";
import {NATURES, POKEDEX_DATA} from "./pokedex.testconstants";
import {GAME_1} from "../games/games.testconstants";

describe("PokedexRepository", () => {
    it("should set and get the Pokedex data", (done) => {
        pokedexRepository.setPokedexData(POKEDEX_DATA, GAME_1)
        pokedexRepository.queryPokedexData$(GAME_1).subscribe({
            next: result => {
                expect(result).toEqual(POKEDEX_DATA)
                done()
            }
        })
    })
    it("should set and get the natures data", (done) => {
        pokedexRepository.setNatures(NATURES)
        pokedexRepository.queryNatures$().subscribe({
            next: result => {
                expect(result).toEqual(NATURES)
                done()
            }
        })
    })
})