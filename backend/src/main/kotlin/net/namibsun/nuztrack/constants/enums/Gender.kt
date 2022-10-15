package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.util.safeValueOf

enum class Gender {
    MALE, FEMALE, NEUTRAL;

    companion object {
        fun valueOfWithChecks(string: String?): Gender {
            return safeValueOf(string, ErrorMessages.INVALID_GENDER)
        }
    }
}