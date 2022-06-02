package net.namibsun.nuztrack.constants

enum class RunStatus {
    ACTIVE, FAILED, COMPLETED;

    companion object {
        fun valueOfWithChecks(string: String): RunStatus {
            try {
                return valueOf(string.uppercase())
            } catch (e: IllegalArgumentException) {
                throw ValidationException(ErrorMessages.INVALID_RUN_STATUS)
            }
        }
    }
}