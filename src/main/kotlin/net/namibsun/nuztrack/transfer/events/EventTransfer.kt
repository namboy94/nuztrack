package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.Event
import net.namibsun.nuztrack.util.formatDateToIsoString

data class EventLogTO(
        val encounters: List<EncounterEventTO>,
        val evolutions: List<EvolutionEventTO>,
        val deaths: List<DeathEventTO>,
        val teamMemberSwitches: List<TeamMemberSwitchEventTO>,
        val notes: List<NoteEventTO>,
        val milestones: List<MilestoneEventTO>
)

data class EventTO(val id: Long, val runId: Long, val timeStamp: String, val location: String) {
    companion object {
        fun fromEvent(event: Event): EventTO {
            return EventTO(
                    event.id,
                    event.nuzlockeRun.id,
                    formatDateToIsoString(event.timestamp),
                    event.location
            )
        }
    }
}
