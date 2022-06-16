import {pokedexApi} from "./pokedex.api";
import {NATURES, NATURES_TO, POKEDEX, POKEDEX_DATA, POKEDEX_TO} from "./pokedex.testconstants";
import {of} from "rxjs";
import {pokedexRepository} from "./pokedex.repository";
import {pokedexService} from "./pokedex.service";

describe("PokedexService", () => {
    it("should load the Pokedex data", (done) => {
        jest.spyOn(pokedexApi, "getPokedex$").mockReturnValue(of(POKEDEX_TO))
        jest.spyOn(pokedexRepository, "setPokedexData").mockImplementation(jest.fn())
        pokedexService.loadPokedexData$().subscribe({
            complete: () => {
                expect(pokedexApi.getPokedex$).toHaveBeenCalledTimes(1)
                expect(pokedexRepository.setPokedexData).toHaveBeenCalledTimes(1)
                expect(pokedexRepository.setPokedexData).toHaveBeenCalledWith(POKEDEX_DATA)
                done()
            }
        })
    })
    it("should load the natures data", (done) => {
        jest.spyOn(pokedexApi, "getNatures$").mockReturnValue(of(NATURES_TO))
        jest.spyOn(pokedexRepository, "setNatures").mockImplementation(jest.fn())
        pokedexService.loadNatures$().subscribe({
            complete: () => {
                expect(pokedexApi.getNatures$).toHaveBeenCalledTimes(1)
                expect(pokedexRepository.setNatures).toHaveBeenCalledTimes(1)
                expect(pokedexRepository.setNatures).toHaveBeenCalledWith(NATURES)
                done()
            }
        })
    })
    it("should get the Pokedex data", (done) => {
        jest.spyOn(pokedexRepository, "queryPokedexData$").mockReturnValue(of(POKEDEX_DATA))
        pokedexService.getPokedex$().subscribe({
            next: result => {
                expect(result).toEqual(POKEDEX)
                expect(pokedexRepository.queryPokedexData$).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
    it("should get the natures data", (done) => {
        jest.spyOn(pokedexRepository, "queryNatures$").mockReturnValue(of(NATURES))
        pokedexService.getNatures$().subscribe({
            next: result => {
                expect(result).toEqual(NATURES)
                expect(pokedexRepository.queryNatures$).toHaveBeenCalledTimes(1)
                done()
            }
        })
    })
})