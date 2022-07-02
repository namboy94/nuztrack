package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.util.parseDateFromIsoString
import net.namibsun.nuztrack.util.validateEmptyLocation
import net.namibsun.nuztrack.util.validateTeamMember

data class TeamMemberSwitchEventTO(val event: EventTO, val teamMemberId: Long, val switchType: String) {
    companion object {
        fun fromTeamMemberSwitchEvent(event: TeamMemberSwitchEvent): TeamMemberSwitchEventTO {
            return TeamMemberSwitchEventTO(EventTO.fromEvent(event), event.teamMember.id, event.switchType.name)
        }
    }

    fun toTeamMemberSwitchEvent(
            run: NuzlockeRun, teamMember: TeamMember, keepId: Boolean = false
    ): TeamMemberSwitchEvent {
        return TeamMemberSwitchEvent(
                run, event.location, teamMember, TeamMemberSwitchType.valueOfWithChecks(switchType),
                if (keepId) event.id else 0, parseDateFromIsoString(event.timestamp)
        )
    }
}

data class CreateTeamMemberSwitchEventTO(
        val location: String,
        val teamMemberId: Long,
        val switchType: String
) {
    fun validate(run: NuzlockeRun, service: TeamMemberService) {
        validateEmptyLocation(location)
        val switchTypeEnum = TeamMemberSwitchType.valueOfWithChecks(switchType)

        validateTeamMember(service.getTeamMember(run.id, teamMemberId), true)
        val team = service.getTeam(run.id)


        val partyIds = team.first.map { it.id }

        if (switchTypeEnum == TeamMemberSwitchType.ADD) {
            if (partyIds.contains(teamMemberId)) {
                throw ValidationException(ErrorMessages.ALREADY_IN_PARTY)
            }
            if (partyIds.size == 6) {
                throw ValidationException(ErrorMessages.PARTY_FULL)
            }
        }
        if (switchTypeEnum == TeamMemberSwitchType.REMOVE) {
            if (!partyIds.contains(teamMemberId)) {
                throw ValidationException(ErrorMessages.ALREADY_NOT_IN_PARTY)
            }
            if (partyIds.size == 1) {
                throw ValidationException(ErrorMessages.LAST_MEMBER_IN_PARTY)
            }
        }
    }
}