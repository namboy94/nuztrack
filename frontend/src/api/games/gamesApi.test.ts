import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {loadGames} from "./gamesApi"

describe("gamesApi", () => {

    const axiosMock = new MockAdapter(axios)

    it("should return a promise", () => {
        const response = {games: ["A", "B", "C"]}
        axiosMock.onGet("/games").reply(200, response)
        loadGames().then(result => expect(result).toStrictEqual(response))
    })


})
