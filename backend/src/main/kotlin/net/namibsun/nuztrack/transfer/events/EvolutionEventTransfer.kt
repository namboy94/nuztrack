package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EvolutionEvent
import net.namibsun.nuztrack.util.parseDateFromIsoString
import net.namibsun.nuztrack.util.validateEmptyLocation
import net.namibsun.nuztrack.util.validateLevel
import net.namibsun.nuztrack.util.validateTeamMember

data class EvolutionEventTO(
        val event: EventTO,
        val teamMemberId: Long,
        val level: Int,
        val previousPokedexNumber: Int,
        val newPokedexNumber: Int
) {
    companion object {
        fun fromEvolutionEvent(event: EvolutionEvent): EvolutionEventTO {
            return EvolutionEventTO(
                    EventTO.fromEvent(event),
                    event.teamMember.id,
                    event.level,
                    event.previousPokedexNumber,
                    event.newPokedexNumber
            )
        }
    }

    fun toEvolutionEvent(run: NuzlockeRun, teamMember: TeamMember, keepId: Boolean = false): EvolutionEvent {
        return EvolutionEvent(
                run, event.location, teamMember, level, previousPokedexNumber, newPokedexNumber,
                if (keepId) event.id else 0, parseDateFromIsoString(event.timestamp)
        )
    }
}

data class CreateEvolutionEventTO(
        val location: String,
        val teamMemberId: Long,
        val level: Int,
        val newPokedexNumber: Int
) {
    fun validate(run: NuzlockeRun, service: TeamMemberService) {
        validateEmptyLocation(location)
        validateLevel(level)
        val teamMember = service.getTeamMember(run.id, teamMemberId)
        validateTeamMember(teamMember, true, level)

        val species = Pokedex.getPokemon(teamMember!!.pokedexNumber)
        if (!species.evolutions.contains(newPokedexNumber)) {
            throw ValidationException(ErrorMessages.INVALID_EVOLUTION_TARGET)
        }
    }
}