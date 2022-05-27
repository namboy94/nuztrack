export type NuzlockeRunBasicInfoTO = {
    id: number | null,
    userName: string | null,
    name: string,
    game: string,
}

export type NuzlockeRulesTO = {
    death: boolean,
    mustNickname: boolean,
    onlyFirstEncounter: boolean,
    duplicateClause: boolean,
    duplicateClauseIncludesFailedEncounters: boolean,
    duplicateClauseIncludesEntireSpecies: boolean,
    noTradedPokemon: boolean,
    noGiftedPokemon: boolean,
    noLegendaryPokemon: boolean,
    noItems: boolean,
    noItemsInBattle: boolean,
    noXIteams: boolean,
    noPokeMarts: boolean,
    noPokeCenters: boolean
}

export type NuzlockeRunTO = { runInfo: NuzlockeRunBasicInfoTO, rules: NuzlockeRulesTO }

export type CreateNuzlockeRunTO = { name: string, game: string, rules: NuzlockeRulesTO }