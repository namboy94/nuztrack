package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.transfer.events.CreateEncounterEventTO
import net.namibsun.nuztrack.transfer.events.EncounterEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class EncounterEventController(
        val encounterService: EncounterEventService,
        val teamMemberService: TeamMemberService,
        runService: NuzlockeRunService
) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/encounters")
    @ResponseBody
    fun createEncounterEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateEncounterEventTO,
            principal: Principal
    ): ResponseEntity<EncounterEventTO> {
        val run = this.authenticator.loadAuthenticatedRun(runId, principal.name)
        creator.validate(encounterService.getLocationsWithEncounters(runId), run.rules)

        val encounter = encounterService.createEncounterEvent(
                run,
                creator.location,
                creator.pokedexNumber,
                creator.level,
                Gender.valueOfWithChecks(creator.gender),
                creator.caught
        )
        if (creator.caught && creator.pokemon != null) {
            teamMemberService.createTeamMember(
                    encounter,
                    creator.pokemon.nickname,
                    Natures.valueOfWithChecks(creator.pokemon.nature),
                    creator.pokemon.abilitySlot
            )
        }
        return ResponseEntity<EncounterEventTO>(EncounterEventTO.fromEncounterEvent(encounter), HttpStatus.CREATED)
    }
}