import axios from "axios-observable";
import {NATURES_TO, POKEDEX_TO} from "./pokedex.testconstants";
import {buildResponse} from "../../util/test/axios";
import {pokedexApi} from "./pokedex.api";

describe("PokedexApi", () => {
    it("should get the Pokedex data", (done) => {
        jest.spyOn(axios, "get").mockReturnValue(buildResponse(POKEDEX_TO))
        pokedexApi.getPokedex$().subscribe({
            next: result => {
                expect(result).toEqual(POKEDEX_TO)
                expect(axios.get).toHaveBeenCalledTimes(1)
                expect(axios.get).toHaveBeenCalledWith("/api/pokedex")
                done()
            }
        })
    })
    it("should get the natures data", (done) => {
        jest.spyOn(axios, "get").mockReturnValue(buildResponse(NATURES_TO))
        pokedexApi.getNatures$().subscribe({
            next: result => {
                expect(result).toEqual(NATURES_TO)
                expect(axios.get).toHaveBeenCalledTimes(1)
                expect(axios.get).toHaveBeenCalledWith("/api/pokedex/natures")
                done()
            }
        })
    })
})