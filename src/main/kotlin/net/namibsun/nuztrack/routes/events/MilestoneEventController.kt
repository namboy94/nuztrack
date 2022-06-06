package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.MilestoneEventService
import net.namibsun.nuztrack.transfer.events.CreateMilestoneEventTO
import net.namibsun.nuztrack.util.Authenticator
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
            @RequestBody creator: Any,
            principal: Principal
    ): ResponseEntity<CreateMilestoneEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        return ResponseEntity.ok(null)
    }

}