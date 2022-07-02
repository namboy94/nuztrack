package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.util.parseDateFromIsoString
import net.namibsun.nuztrack.util.validateEmptyLocation
import net.namibsun.nuztrack.util.validateLevel
import net.namibsun.nuztrack.util.validateTeamMember

data class DeathEventTO(val event: EventTO, val teamMemberId: Long, val level: Int, val opponent: String,
                        val description: String) {
    companion object {
        fun fromDeathEvent(event: DeathEvent): DeathEventTO {
            return DeathEventTO(EventTO.fromEvent(event), event.teamMember.id, event.level, event.opponent,
                    event.description)
        }
    }

    fun toDeathEvent(run: NuzlockeRun, teamMember: TeamMember, keepId: Boolean = false): DeathEvent {
        return DeathEvent(run, event.location, teamMember, level, opponent, description, if (keepId) event.id else 0,
                parseDateFromIsoString(event.timestamp))
    }
}

data class CreateDeathEventTO(val location: String, val teamMemberId: Long, val level: Int, val opponent: String,
                              val description: String) {
    fun validate(run: NuzlockeRun, service: TeamMemberService) {
        println(description)
        validateEmptyLocation(location)
        if (opponent.isEmpty()) {
            throw ValidationException(ErrorMessages.MISSING_OPPONENT)
        }
        if (description.isEmpty()) {
            throw ValidationException(ErrorMessages.MISSING_DESCRIPTION)
        }
        validateLevel(level)
        validateTeamMember(service.getTeamMember(run.id, teamMemberId), true, level)

        val team = service.getTeam(run.id).first.map { it.id }
        if (!team.contains(teamMemberId)) {
            throw (ValidationException(ErrorMessages.NOT_IN_PARTY))
        }
    }
}