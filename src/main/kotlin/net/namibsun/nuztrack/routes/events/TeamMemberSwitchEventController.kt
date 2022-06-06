package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.transfer.events.CreateTeamMemberSwitchEventTO
import net.namibsun.nuztrack.transfer.events.TeamMemberSwitchEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class TeamMemberSwitchEventController(
        val service: TeamMemberSwitchEventService,
        val teamMemberService: TeamMemberService,
        runService: NuzlockeRunService
) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/team_member_switches")
    @ResponseBody
    fun createTeamMemberSwitchEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateTeamMemberSwitchEventTO,
            principal: Principal
    ): ResponseEntity<TeamMemberSwitchEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        creator.validate(run, teamMemberService)
        val member = teamMemberService.getTeamMember(run.id, creator.teamMemberId)!!
        val switch = service.createTeamMemberSwitchEvent(
                run, creator.location, member, TeamMemberSwitchType.valueOfWithChecks(creator.switchType)
        )
        return ResponseEntity<TeamMemberSwitchEventTO>(
                TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(switch),
                HttpStatus.CREATED
        )
    }

}