package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.events.*
import net.namibsun.nuztrack.util.formatDateToIsoString

data class EventLogTO(
        val encounters: List<EncounterEventTO>,
        val evolutions: List<EvolutionEventTO>,
        val deaths: List<DeathEventTO>,
        val teamMemberSwitches: List<TeamMemberSwitchEventTO>,
        val notes: List<NoteEventTO>,
        val milestones: List<MilestoneEventTO>
) {
    companion object {
        fun fromEvents(events: List<Event>): EventLogTO {
            val encounters = events.filter { it.eventType == EventType.ENCOUNTER }.map { it as EncounterEvent }
            val deaths = events.filter { it.eventType == EventType.DEATH }.map { it as DeathEvent }
            val evolutions = events.filter { it.eventType == EventType.EVOLUTION }.map { it as EvolutionEvent }
            val notes = events.filter { it.eventType == EventType.NOTE }.map { it as NoteEvent }
            val milestones = events.filter { it.eventType == EventType.MILESTONE }.map { it as MilestoneEvent }
            val switches = events.filter {
                it.eventType == EventType.TEAM_MEMBER_SWITCH
            }.map {
                it as TeamMemberSwitchEvent
            }
            return EventLogTO(
                    encounters = encounters.map { EncounterEventTO.fromEncounterEvent(it) },
                    evolutions = evolutions.map { EvolutionEventTO.fromEvolutionEvent(it) },
                    deaths = deaths.map { DeathEventTO.fromDeathEvent(it) },
                    notes = notes.map { NoteEventTO.fromNoteEvent(it) },
                    milestones = milestones.map { MilestoneEventTO.fromMilestoneEvent(it) },
                    teamMemberSwitches = switches.map { TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(it) }
            )
        }
    }
}

data class EventTO(val id: Long, val runId: Long, val timestamp: String, val location: String) {
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
