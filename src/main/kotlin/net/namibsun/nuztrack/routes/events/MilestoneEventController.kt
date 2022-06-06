package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.MilestoneEventService
import net.namibsun.nuztrack.transfer.events.CreateMilestoneEventTO
import net.namibsun.nuztrack.transfer.events.MilestoneEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class MilestoneEventController(val service: MilestoneEventService, runService: NuzlockeRunService) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/milestones")
    @ResponseBody
    fun createMilestoneEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateMilestoneEventTO,
            principal: Principal
    ): ResponseEntity<MilestoneEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        creator.validate(run, service)
        val milestone = service.createMilestoneEvent(run, creator.location, creator.milestone)
        return ResponseEntity<MilestoneEventTO>(MilestoneEventTO.fromMilestoneEvent(milestone), HttpStatus.CREATED)
    }

}