package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.EventService
import net.namibsun.nuztrack.transfer.events.EventLogTO
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
        return ResponseEntity.ok(EventLogTO.fromEvents(events))
    }
}