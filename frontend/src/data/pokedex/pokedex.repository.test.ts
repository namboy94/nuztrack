import {pokedexRepository} from "./pokedex.repository";
import {NATURES, POKEDEX_DATA} from "./pokedex.testconstants";

describe("PokedexRepository", () => {
    it("should set and get the Pokedex data", (done) => {
        pokedexRepository.setPokedexData(POKEDEX_DATA)
        pokedexRepository.queryPokedexData$().subscribe({
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