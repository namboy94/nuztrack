package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.transfer.TeamTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
class TeamMemberController(val service: TeamMemberService, runService: NuzlockeRunService) {
    val authenticator = Authenticator(runService)

    @GetMapping("/api/team/{runId}")
    @ResponseBody
    fun getTeam(@PathVariable runId: Long, principal: Principal): ResponseEntity<TeamTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        val team = service.getTeam(run.id)
        return ResponseEntity.ok(TeamTO.fromTeam(team))
    }
}