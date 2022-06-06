package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EvolutionEventService
import net.namibsun.nuztrack.transfer.events.CreateEvolutionEventTO
import net.namibsun.nuztrack.transfer.events.EvolutionEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class EvolutionEventController(
        val service: EvolutionEventService,
        val teamMemberService: TeamMemberService,
        runService: NuzlockeRunService
) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/evolutions")
    @ResponseBody
    fun createEvolutionEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateEvolutionEventTO,
            principal: Principal
    ): ResponseEntity<EvolutionEventTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        creator.validate(run, teamMemberService)
        val member = teamMemberService.getTeamMember(run.id, creator.teamMemberId)!!

        val evolutionEvent = service.createEvolutionEvent(
                run, creator.location, member, creator.level, creator.newPokedexNumber
        )
        teamMemberService.setLevel(member.id, creator.level)
        return ResponseEntity.ok(EvolutionEventTO.fromEvolutionEvent(evolutionEvent))
    }

}