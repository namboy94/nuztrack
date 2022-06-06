package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEventService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.transfer.events.CreateDeathEventTO
import net.namibsun.nuztrack.transfer.events.DeathEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class DeathEventController(
        val service: DeathEventService,
        val teamMemberService: TeamMemberService,
        val switchService: TeamMemberSwitchEventService,
        runService: NuzlockeRunService
) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/deaths")
    @ResponseBody
    fun createDeathEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateDeathEventTO,
            principal: Principal
    ): ResponseEntity<DeathEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        creator.validate(run, teamMemberService)

        val member = teamMemberService.getTeamMember(run.id, creator.teamMemberId)!!

        val deathEvent = service.createDeathEvent(
                run, creator.location, member, creator.level, creator.opponent, creator.description
        )
        teamMemberService.setLevel(member.id, creator.level)
        switchService.createTeamMemberSwitchEvent(run, creator.location, member, TeamMemberSwitchType.REMOVE)
        return ResponseEntity.ok(DeathEventTO.fromDeathEvent(deathEvent))
    }
}