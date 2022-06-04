package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.transfer.events.CreateEncounterEventTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class EncounterEventController(val service: EncounterEventService, runService: NuzlockeRunService) {

    val authenticator = Authenticator(runService)

    @PostMapping("/api/events/{runId}/encounters")
    @ResponseBody
    fun createEncounterEvent(
            @PathVariable runId: Long,
            @RequestBody creator: CreateEncounterEventTO,
            principal: Principal
    ) {
        val run = this.authenticator.loadAuthenticatedRun(runId, principal)
        creator.validate(service.getLocationsWithEncounters(runId))
        if (creator.caught && creator.pokemon != null) {
            service.createSuccessfulEncounterEvent(
                    run,
                    creator.location,
                    creator.pokedexNumber,
                    creator.level,
                    Gender.valueOfWithChecks(creator.gender),
                    creator.pokemon.nickname,
                    Natures.valueOfWithChecks(creator.pokemon.nature),
                    Pokedex.getAbilitySlot(creator.pokedexNumber, creator.pokemon.ability)
            )
        } else {
            service.createFailedEncounterEvent(
                    run,
                    creator.location,
                    creator.pokedexNumber,
                    creator.level,
                    Gender.valueOfWithChecks(creator.gender)
            )
        }
    }
}