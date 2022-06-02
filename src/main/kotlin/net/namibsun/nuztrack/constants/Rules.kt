package net.namibsun.nuztrack.constants

enum class Rules(val description: String) {
    DEATH("Any Pokémon that faints is considered dead and must be released or permanently boxed"),
    MUST_NICKNAME("Every Pokémon has to be nicknamed"),
    ONLY_FIRST_ENCOUNTER("Only the first encounter on any given route may be caught"),
    DUPLICATE_CLAUSE("Duplicate encounters do not count"),
    DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS("Failed encounters also count as duplicates"),
    DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES("Species of the same evolutionary line count as duplicates"),
    NO_TRADED_POKEMON("Use of traded Pokémon is not allowed"),
    NO_GIFTED_POKEMON("Use of gift Pokémon is not allowed"),
    NO_GIFTED_POKEMON_STARTER_EXCEPTION("Use of the Starter Pokémon is allowed even if gift Pokemon are not allowed"),
    NO_LEGENDARY_POKEMON("Use of Legendary Pokémon is not allowed"),
    NO_ITEMS("Items may not be used"),
    NO_ITEMS_IN_BATTLE("Items may not be used in battle"),
    NO_X_ITEMS("X-Items may not be used"),
    NO_POKE_MARTS("PokéMarts may not be used"),
    NO_POKE_CENTERS("PokéCenters nay not be used");

    companion object {
        fun valueOfWithChecks(string: String): Rules {
            try {
                return valueOf(string.uppercase())
            } catch (e: IllegalArgumentException) {
                throw ValidationException(ErrorMessages.INVALID_RULE)
            }
        }

        fun defaultRules(): List<Rules> {
            return listOf(DEATH, ONLY_FIRST_ENCOUNTER, MUST_NICKNAME)
        }
    }
}

