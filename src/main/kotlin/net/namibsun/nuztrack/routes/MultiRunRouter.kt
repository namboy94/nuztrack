package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.MultiRunOptions
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.MultiRunNuzlockeService
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEventService
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.transfer.CreateMultiRunTO
import net.namibsun.nuztrack.transfer.MultiRunOptionTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class MultiRunRouter(
        val multiRunNuzlockeService: MultiRunNuzlockeService,
        val runService: NuzlockeRunService,
        val teamMemberService: TeamMemberService,
        val encounterEventService: EncounterEventService,
        val deathEventService: DeathEventService
) {

    val authenticator = Authenticator(runService)

    @GetMapping("/api/runs/multi/options")
    @ResponseBody
    fun getMultiRunOptions(): ResponseEntity<List<MultiRunOptionTO>> {
        return ResponseEntity.ok(MultiRunOptions.values().map { MultiRunOptionTO(it.name, it.description) })
    }

    @PostMapping("/api/runs/multi")
    @ResponseBody
    fun createRun(@RequestBody createMultiRun: CreateMultiRunTO, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        val currentRun = authenticator.loadAuthenticatedRun(createMultiRun.runId, principal.name)
        createMultiRun.validate()

        val multiRun = multiRunNuzlockeService.getOrCreateMultiRunForRun(currentRun)
        val newRun = runService.createRun(
                userName = principal.name,
                name = createMultiRun.name,
                game = Games.valueOfWithChecks(createMultiRun.game),
                rules = currentRun.rules.map { it },
                customRules = currentRun.customRules.map { it },
                multiRun = multiRun
        )

        val options = createMultiRun.options.map { MultiRunOptions.valueOfWithChecks(it) }

        val team = teamMemberService.getTeam(currentRun.id)
        val teamMembersToTransfer = mutableListOf<TeamMember>()
        if (options.contains(MultiRunOptions.INCLUDE_PARTY)) {
            teamMembersToTransfer.addAll(team.first)
        }
        if (options.contains(MultiRunOptions.INCLUDE_BOX)) {
            teamMembersToTransfer.addAll(team.second)
        }
        if (options.contains(MultiRunOptions.INCLUDE_DEAD)) {
            teamMembersToTransfer.addAll(team.third)
        }

        for (teamMember in teamMembersToTransfer) {
            val level = if (options.contains(MultiRunOptions.RESET_LEVELS) && teamMember.death == null) {
                5
            } else {
                teamMember.level
            }
            val pokedexNumber = if (options.contains(MultiRunOptions.RESET_SPECIES) && teamMember.death == null) {
                Pokedex.getPokemon(teamMember.pokedexNumber).baseSpecies
            } else {
                teamMember.pokedexNumber
            }
            val gender = if (newRun.game.generation == 1) {
                null
            } else if (newRun.game.generation > 1 && currentRun.game.generation == 1) {
                Gender.NEUTRAL
            } else {
                teamMember.gender
            }
            val nature = if (newRun.game.generation < 3) null else teamMember.nature ?: Natures.BASHFUL
            val abilitySlot = if (newRun.game.generation < 3) null else teamMember.abilitySlot ?: 1
            val encounter = encounterEventService.createEncounterEvent(
                    nuzlockeRun = newRun,
                    location = "Previous Game",
                    pokedexNumber = pokedexNumber,
                    level = level,
                    true
            )
            val newTeamMember = teamMemberService.createTeamMember(
                    encounter = encounter,
                    nickname = teamMember.nickname,
                    gender = gender,
                    nature = nature,
                    abilitySlot = abilitySlot
            )
            if (teamMember.death != null) {
                deathEventService.createDeathEvent(
                        newRun,
                        "Previous Game",
                        newTeamMember,
                        teamMember.level,
                        teamMember.death!!.opponent,
                        teamMember.death!!.description
                )
            }
        }

        if (options.contains(MultiRunOptions.INCLUDE_FAILED_ENCOUNTERS)) {
            for (encounter in encounterEventService.getEncounterEvents(currentRun.id).filter { !it.caught }) {
                encounterEventService.createEncounterEvent(
                        newRun,
                        "Previous Game",
                        encounter.pokedexNumber,
                        encounter.level,
                        false
                )
            }
        }

        return ResponseEntity<NuzlockeRunTO>(NuzlockeRunTO.fromNuzlockeRun(newRun), HttpStatus.CREATED)
    }
}
