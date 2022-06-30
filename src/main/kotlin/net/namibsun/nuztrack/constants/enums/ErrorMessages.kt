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
    INVALID_NICKNAME("The provided nickname is either too short or too long"),
    DUPLICATE_ENCOUNTER("This encounter is a duplicate"),
    INVALID_TEAM_MEMBER("This team member is not valid"),
    MISSING_OPPONENT("No Opponent was provided"),
    MISSING_DESCRIPTION("No Description was provided"),
    TEAM_MEMBER_IS_DEAD("The team member is already dead"),
    LEVEL_BELOW_CURRENT("This level is below the team member's current level"),
    INVALID_EVOLUTION_TARGET("This Pokemon can't evolve into the provided species"),
    PARTY_FULL("The party is already full"),
    LAST_MEMBER_IN_PARTY("This is the last team member in the active party"),
    ALREADY_IN_PARTY("This team member is already in the active party"),
    ALREADY_NOT_IN_PARTY("This team member is already not in the active party"),
    MILESTONE_ALREADY_REACHED("This milestone has already been reached"),
    INVALID_MILESTONE("This milestone is invalid for this game"),
    MILESTONE_IN_WRONG_LOCATION("The location provided is incorrect for this milestone"),
    NO_TEXT("No text was provided"),
    MISSING_LOCATION("No location was provided for this event"),
    NOT_IN_PARTY("The Pokemon is not currently in the active party"),
    HAS_NATURE_BUT_OLD_GAME("A nature was provided, but this game does not support these."),
    HAS_ABILITY_BUT_OLD_GAME("An ability slot was provided, but this game does not support these."),
    HAS_GENDER_BUT_OLD_GAME("A gender was provided, but this game does not support these."),
    NICKNAME_ALREADY_USED("This nickname has already been used"),
    INVALID_MULTI_RUN_OPTION("This option is not a valid multi-run option"),
    MULTI_RUN_BACKWARDS("A multi-run can only go to newer generations, not older ones")
}