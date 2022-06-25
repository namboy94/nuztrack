package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.util.safeValueOf

enum class MultiRunOptions(val description: String) {

    RESET_LEVELS("Resets the level of all living Pokemon to Level 5"),
    RESET_SPECIES("Resets the species of all living Pokemon to their base species"),
    INCLUDE_PARTY("Transfers the active party to the next game"),
    INCLUDE_BOX("Transfers all boxed Pokemon as well"),
    INCLUDE_DEAD("Transfers all dead Pokemon as well");

    companion object {
        fun valueOfWithChecks(string: String?): MultiRunOptions {
            return safeValueOf(string, ErrorMessages.INVALID_MULTI_RUN_OPTION)
        }
    }
}