package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.GameLocationRegistry
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.data.events.MilestoneEventService
import net.namibsun.nuztrack.util.parseDateFromIsoString
import net.namibsun.nuztrack.util.validateEmptyLocation

data class MilestoneEventTO(val event: EventTO, val milestone: String) {
    companion object {
        fun fromMilestoneEvent(event: MilestoneEvent): MilestoneEventTO {
            return MilestoneEventTO(EventTO.fromEvent(event), event.milestone)
        }
    }

    fun toMilestoneEvent(run: NuzlockeRun, keepId: Boolean = false): MilestoneEvent {
        return MilestoneEvent(
                run, event.location, milestone, if (keepId) event.id else 0, parseDateFromIsoString(event.timestamp)
        )
    }
}

data class CreateMilestoneEventTO(
        val location: String,
        val milestone: String
) {
    fun validate(run: NuzlockeRun, service: MilestoneEventService) {
        validateEmptyLocation(location)
        val existingMilestones = service.getMilestoneEvents(run.id).map { it.milestone }
        val validMilestones = GameLocationRegistry.getMilestonesForGame(run.game)

        if (existingMilestones.contains(milestone)) {
            throw ValidationException(ErrorMessages.MILESTONE_ALREADY_REACHED)
        }

        val realMilestone = validMilestones.firstOrNull { it.name == milestone }
                ?: throw ValidationException(ErrorMessages.INVALID_MILESTONE)
        if (realMilestone.location != location) {
            throw ValidationException(ErrorMessages.MILESTONE_IN_WRONG_LOCATION)
        }
    }
}