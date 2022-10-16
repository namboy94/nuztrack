import axios from "axios-observable";
import {NATURES_TO, POKEDEX_TO} from "./pokedex.testconstants";
import {buildResponse} from "../../util/axios";
import {pokedexApi} from "./pokedex.api";
import {GAME_1} from "../games/games.testconstants";

describe("PokedexApi", () => {
    it("should get the Pokedex data", (done) => {
        jest.spyOn(axios, "get").mockReturnValue(buildResponse(POKEDEX_TO))
        pokedexApi.getPokedex$(GAME_1).subscribe({
            next: result => {
                expect(result).toEqual(POKEDEX_TO)
                expect(axios.get).toHaveBeenCalledTimes(1)
                expect(axios.get).toHaveBeenCalledWith("/api/pokedex?game=RED")
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