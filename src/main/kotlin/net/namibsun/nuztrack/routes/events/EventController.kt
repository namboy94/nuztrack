package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.*
import net.namibsun.nuztrack.transfer.events.*
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
class EventController(val service: EventService, runService: NuzlockeRunService) {
    val authenticator = Authenticator(runService)

    @GetMapping("/api/events/{runId}")
    @ResponseBody
    fun getEvents(@PathVariable runId: Long, principal: Principal): ResponseEntity<EventLogTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)

        val events = service.getAllEvents(run.id)
        val encounters = events.filter { it.eventType == EventType.ENCOUNTER }.map { it as EncounterEvent }
        val deaths = events.filter { it.eventType == EventType.DEATH }.map { it as DeathEvent }
        val evolutions = events.filter { it.eventType == EventType.EVOLUTION }.map { it as EvolutionEvent }
        val notes = events.filter { it.eventType == EventType.NOTE }.map { it as NoteEvent }
        val milestones = events.filter { it.eventType == EventType.MILESTONE }.map { it as MilestoneEvent }
        val switches =
                events.filter { it.eventType == EventType.TEAM_MEMBER_SWITCH }.map { it as TeamMemberSwitchEvent }

        val eventLog = EventLogTO(
                encounters = encounters.map { EncounterEventTO.fromEncounterEvent(it) },
                evolutions = evolutions.map { EvolutionEventTO.fromEvolutionEvent(it) },
                deaths = deaths.map { DeathEventTO.fromDeathEvent(it) },
                notes = notes.map { NoteEventTO.fromNoteEvent(it) },
                milestones = milestones.map { MilestoneEventTO.fromMilestoneEvent(it) },
                teamMemberSwitches = switches.map { TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(it) }
        )
        return ResponseEntity.ok(eventLog)
    }
}