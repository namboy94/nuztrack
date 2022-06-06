package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EvolutionEventService
import net.namibsun.nuztrack.transfer.events.CreateEvolutionEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class EvolutionEventController(
        val service: EvolutionEventService,
        teamMemberService: TeamMemberService,
        runService: NuzlockeRunService
) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/evolutions")
    @ResponseBody
    fun createEvolutionEvent(
            @PathVariable runId: Long,
            @RequestBody creator: Any,
            principal: Principal
    ): ResponseEntity<CreateEvolutionEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        return ResponseEntity.ok(null)
    }

}