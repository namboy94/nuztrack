package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.TeamMember

fun validateLevel(level: Int) {
    if (level < 1 || level > 100) {
        throw ValidationException(ErrorMessages.LEVEL_OUT_OF_BOUNDS)
    }
}

fun validateTeamMember(teamMember: TeamMember?, mustBeAlive: Boolean = false, mustBeBelowLevel: Int = 100) {
    if (teamMember == null) {
        throw ValidationException(ErrorMessages.INVALID_TEAM_MEMBER)
    }
    if (teamMember.level > mustBeBelowLevel) {
        throw ValidationException(ErrorMessages.LEVEL_BELOW_CURRENT)
    }
    if (mustBeAlive && teamMember.death != null) {
        throw ValidationException(ErrorMessages.TEAM_MEMBER_IS_DEAD)
    }
}

fun validateEmptyLocation(location: String) {
    if (location.isEmpty()) {
        throw ValidationException(ErrorMessages.MISSING_LOCATION)
    }
}