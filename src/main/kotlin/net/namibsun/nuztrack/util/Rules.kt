package net.namibsun.nuztrack.util

enum class Rules(val key: String, val description: String) {
    DEATH("death", "Any Pokémon that faints is considered dead and must be released or permanently boxed"),
    MUST_NICKNAME("mustNickname", "Every Pokémon has to be nicknamed"),
    ONLY_FIRST_ENCOUNTER("onlyFirstEncounter", "Only the first encounter on any given route may be caught"),
    DUPLICATE_CLAUSE("duplicateClause", "Duplicate encounters do not count"),
    DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS("duplicateClauseIncludesFailedEncounters", "Failed encounters also count as duplicates"),
    DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES("duplicateClauseIncludesEntireSpecies", "Species of the same evolutionary line count as duplicates"),
    NO_TRADED_POKEMON("noTradedPokemon", "Use of traded Pokémon is not allowed"),
    NO_GIFTED_POKEMON("noGiftedPokemon", "Use of gift Pokémon is not allowed"),
    NO_GIFTED_POKEMON_STARTER_EXCEPTION("noGiftedPokemonStarterException", "Use of the Starter Pokémon is allowed even if gift Pokemon are not allowed"),
    NO_LEGENDARY_POKEMON("noLegendaryPokemon", "Use of Legendary Pokémon is not allowed"),
    NO_ITEMS("noItems", "Items may not be used"),
    NO_ITEMS_IN_BATTLE("noItemsInBattle", "Items may not be used in battle"),
    NO_X_ITEMS("noXItems", "X-Items may not be used"),
    NO_POKE_MARTS("noPokeMarts", "PokéMarts may not be used"),
    NO_POKE_CENTERS("noPokeCenters", "PokéCenters nay not be used")
}

fun getValueOfRuleKey(ruleKey: String): Rules {
    return try {
        Rules.values().first { it.key == ruleKey }
    } catch (e: NoSuchElementException) {
        throw ValidationException(ErrorMessages.INVALID_RULE)
    }
}

fun getDefaultRules(): List<Rules> {
    return listOf(Rules.DEATH, Rules.ONLY_FIRST_ENCOUNTER, Rules.MUST_NICKNAME)
}
