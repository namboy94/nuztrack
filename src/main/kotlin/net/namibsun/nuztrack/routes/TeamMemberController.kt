package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.transfer.TeamMemberTO
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
        val allTeamMembers = service.getAllForNuzlockeRun(run)
        val (alive, dead) = allTeamMembers.partition { it.death == null }
        val (active, boxed) = alive.partition { it.teamSwitches.last().switchType == TeamMemberSwitchType.ADD }
        val team = TeamTO(
                active = active.map { TeamMemberTO.fromTeamMember(it) },
                boxed = boxed.map { TeamMemberTO.fromTeamMember(it) },
                dead = dead.map { TeamMemberTO.fromTeamMember(it) }
        )
        return ResponseEntity.ok(team)
    }
}