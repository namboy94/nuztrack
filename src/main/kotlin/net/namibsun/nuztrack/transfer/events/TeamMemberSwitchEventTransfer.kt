package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent

data class TeamMemberSwitchEventTO(val event: EventTO, val teamMemberId: Long, val switchType: String) {
    companion object {
        fun fromTeamMemberSwitchEvent(event: TeamMemberSwitchEvent): TeamMemberSwitchEventTO {
            return TeamMemberSwitchEventTO(EventTO.fromEvent(event), event.teamMember.id, event.switchType.name)
        }
    }
}