package net.namibsun.nuztrack.routes.runs

data class NuzlockeRunBasicInfoTO(
        val id: Int?,
        val userName: String?,
        val name: String,
        val game: String,
)

data class NuzlockeRulesTO(
        val death: Boolean,
        val mustNickname: Boolean,
        val onlyFirstEncounter: Boolean,
        val duplicateClause: Boolean,
        val duplicateClauseIncludesFailedEncounters: Boolean,
        val duplicateClauseIncludesEntireSpecies: Boolean,
        val noTradedPokemon: Boolean,
        val noGiftedPokemon: Boolean,
        val noLegendaryPokemon: Boolean,
        val noItems: Boolean,
        val noItemsInBattle: Boolean,
        val noXIteams: Boolean,
        val noPokeMarts: Boolean,
        val noPokeCenters: Boolean
)

data class NuzlockeRunTO(val runInfo: NuzlockeRunBasicInfoTO, val rules: NuzlockeRulesTO)

data class CreateNuzlockeRunTO(val name: String, val game: String, val rules: NuzlockeRulesTO)