package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.util.safeValueOf

enum class TeamMemberSwitchType {
    ADD, REMOVE;

    companion object {
        fun valueOfWithChecks(string: String): TeamMemberSwitchType {
            return safeValueOf(string, ErrorMessages.INVALID_TEAM_MEMBER_SWITCH_TYPE)
        }
    }
}