package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages

inline fun <reified K : Enum<K>> safeValueOf(string: String?, validationErrorMessage: ErrorMessages): K {
    try {
        return java.lang.Enum.valueOf(K::class.java, string?.uppercase() ?: "")
    } catch (e: IllegalArgumentException) {
        throw ValidationException(validationErrorMessage)
    }
}
