import axios from "axios";
import {CreateNuzlockeRunTO, NuzlockeRulesTO, NuzlockeRunBasicInfoTO} from "./runsTransfer";

export function loadRuns(): Promise<NuzlockeRunBasicInfoTO[]> {
    return axios.get("/api/runs").then(x => x.data)
}

export function createRun(name: string, game: string): Promise<void> {
    const rules: NuzlockeRulesTO = {
        death: false,
        duplicateClause: false,
        duplicateClauseIncludesEntireSpecies: false,
        duplicateClauseIncludesFailedEncounters: false,
        mustNickname: false,
        noGiftedPokemon: false,
        noItems: false,
        noItemsInBattle: false,
        noLegendaryPokemon: false,
        noPokeCenters: false,
        noPokeMarts: false,
        noTradedPokemon: false,
        noXIteams: false,
        onlyFirstEncounter: false
    }
    const creator: CreateNuzlockeRunTO = {
        name: name,
        game: game,
        rules: rules,
    }
    return axios.post("/api/runs", creator)
}