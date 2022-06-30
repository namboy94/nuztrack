package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EventService
import net.namibsun.nuztrack.transfer.NuzlockeRunExportTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import net.namibsun.nuztrack.transfer.TeamTO
import net.namibsun.nuztrack.transfer.events.EventLogTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
class ImportExportController(
        val runService: NuzlockeRunService,
        val eventService: EventService,
        val teamService: TeamMemberService
) {

    @Suppress("LeakingThis")
    val authenticator = Authenticator(runService)

    @GetMapping("/api/export/{runId}")
    fun export(@PathVariable runId: Long, principal: Principal): ResponseEntity<NuzlockeRunExportTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        val events = eventService.getAllEvents(runId)
        val team = teamService.getTeam(runId)
        val export = NuzlockeRunExportTO(
                NuzlockeRunTO.fromNuzlockeRun(run),
                EventLogTO.fromEvents(events),
                TeamTO.fromTeam(team)
        )
        return ResponseEntity.ok(export)
    }
}