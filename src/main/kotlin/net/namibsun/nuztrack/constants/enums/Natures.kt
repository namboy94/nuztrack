package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.util.safeValueOf

enum class Natures {
    HARDY,
    LONELY,
    BRAVE,
    ADAMANT,
    NAUGHTY,
    BOLD,
    DOCILE,
    RELAXED,
    IMPISH,
    LAX,
    TIMID,
    HASTY,
    SERIOUS,
    JOLLY,
    NAIVE,
    MODEST,
    MILD,
    QUIET,
    BASHFUL,
    RASH,
    CALM,
    GENTLE,
    SASSY,
    CAREFUL,
    QUIRKY;

    companion object {
        fun valueOfWithChecks(string: String): Natures {
            return safeValueOf(string, ErrorMessages.INVALID_NATURE)
        }
    }
}