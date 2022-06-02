package net.namibsun.nuztrack.constants

enum class ErrorMessages(val message: String) {
    EMPTY_NAME("The provided name was empty"),
    INVALID_GAME("The provided game title is invalid"),
    INVALID_RULE("The provided rule is invalid"),
    RUN_NOT_FOUND("The specified nuzlocke run could not be found"),
    NO_ACCESS_TO_RUN("The user does not have access to this nuzlocke run"),
    INVALID_POKEMON("No Pokemon with this PokeDex number exists")
}