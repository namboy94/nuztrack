package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.util.safeValueOf

enum class RunStatus {
    ACTIVE, FAILED, COMPLETED;

    companion object {
        fun valueOfWithChecks(string: String?): RunStatus {
            return safeValueOf(string, ErrorMessages.INVALID_RUN_STATUS)
        }
    }
}