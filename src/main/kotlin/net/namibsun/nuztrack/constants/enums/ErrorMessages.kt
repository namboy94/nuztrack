package net.namibsun.nuztrack.constants.enums

enum class ErrorMessages(val message: String) {
    EMPTY_NAME("The provided name was empty"),
    INVALID_GAME("The provided game title is invalid"),
    INVALID_RULE("The provided rule is invalid"),
    RUN_NOT_FOUND("The specified nuzlocke run could not be found"),
    NO_ACCESS_TO_RUN("The user does not have access to this nuzlocke run"),
    INVALID_POKEMON("No Pokemon with this PokeDex number exists"),
    INVALID_RUN_STATUS("The provided run status is not valid"),
    INVALID_NATURE("The provided nature is not valid"),
    LEVEL_OUT_OF_BOUNDS("A Pokemon Level must be between 1 and 100"),
    CAUGHT_AND_NO_POKEMON("If 'caught' is selected, a Pokemon must be specified."),
    NOT_CAUGHT_BUT_POKEMON("If 'caught' is not selected, no Pokemon should be specified"),
    INVALID_ABILITY("The ability is not a valid ability for this Pokemon"),
    ENCOUNTER_IN_LOCATION_ALREADY_USED("There has already been an encounter in this location"),
    INVALID_GENDER("No valid gender was specified"),
    INVALID_TEAM_MEMBER_SWITCH_TYPE("The team member switch operation ca only be ADD or REMOVE"),
    INVALID_ABILITY_SLOT("The provided ability slot is not a valid ability slot for this Pokemon"),
    INVALID_NICKNAME("The provided nickname is either too short or too long")
}