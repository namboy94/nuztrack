package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.DeathEventService
import net.namibsun.nuztrack.transfer.events.CreateDeathEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class DeathEventController(val service: DeathEventService, runService: NuzlockeRunService) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/deaths")
    @ResponseBody
    fun createDeathEvent(
            @PathVariable runId: Long,
            @RequestBody creator: Any,
            principal: Principal
    ): ResponseEntity<CreateDeathEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        return ResponseEntity.ok(null)
    }

}