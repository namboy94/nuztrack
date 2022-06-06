package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.transfer.events.CreateTeamMemberSwitchEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class TeamMemberSwitchEventController(val service: TeamMemberSwitchEventService, runService: NuzlockeRunService) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/team_member_switches")
    @ResponseBody
    fun createTeamMemberSwitchEvent(
            @PathVariable runId: Long,
            @RequestBody creator: Any,
            principal: Principal
    ): ResponseEntity<CreateTeamMemberSwitchEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        return ResponseEntity.ok(null)
    }

}