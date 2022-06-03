package net.namibsun.nuztrack.constants

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
            try {
                return valueOf(string.uppercase())
            } catch (e: IllegalArgumentException) {
                throw ValidationException(ErrorMessages.INVALID_NATURE)
            }
        }
    }
}