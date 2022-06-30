package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.MultiRunOptions
import net.namibsun.nuztrack.data.*
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
class MultiRunController(
        val multiRunNuzlockeService: MultiRunNuzlockeService,
        val runService: NuzlockeRunService,
        val teamMemberService: TeamMemberService,
        val encounterEventService: EncounterEventService,
        val deathEventService: DeathEventService
) {

    @Suppress("LeakingThis")
    val authenticator = Authenticator(runService)

    @GetMapping("/api/runs/multi/options")
    @ResponseBody
    fun getMultiRunOptions(): ResponseEntity<List<MultiRunOptionTO>> {
        return ResponseEntity.ok(MultiRunOptions.values().map { MultiRunOptionTO.fromOption(it) })
    }

    @PostMapping("/api/runs/multi")
    @ResponseBody
    fun createMultiRun(@RequestBody createMultiRun: CreateMultiRunTO, principal: Principal): ResponseEntity<NuzlockeRunTO> {
        val currentRun = authenticator.loadAuthenticatedRun(createMultiRun.runId, principal.name)
        createMultiRun.validate(currentRun)

        val newRun = runService.createRun(
                userName = principal.name,
                name = createMultiRun.name,
                game = Games.valueOfWithChecks(createMultiRun.game),
                rules = currentRun.rules.map { it },
                customRules = currentRun.customRules.map { it }
        )
        multiRunNuzlockeService.linkRuns(currentRun, newRun)

        val options = createMultiRun.options.map { MultiRunOptions.valueOfWithChecks(it) }
        val teamMembersToTransfer = this.collectTransferTargets(currentRun.id, options)
        for (teamMember in teamMembersToTransfer) {
            this.transferTeamMemberToNewGame(newRun, teamMember, options)
        }
        if (options.contains(MultiRunOptions.INCLUDE_FAILED_ENCOUNTERS)) {
            this.transferFailedEncounters(currentRun, newRun)
        }

        val freshRun = runService.getRun(newRun.id) ?: newRun
        return ResponseEntity<NuzlockeRunTO>(NuzlockeRunTO.fromNuzlockeRun(freshRun), HttpStatus.CREATED)
    }

    private fun collectTransferTargets(runId: Long, options: List<MultiRunOptions>): List<TeamMember> {
        val team = teamMemberService.getTeam(runId)
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
        return teamMembersToTransfer
    }

    private fun transferTeamMemberToNewGame(
            newRun: NuzlockeRun,
            teamMember: TeamMember,
            options: List<MultiRunOptions>
    ) {
        val resetLevel = options.contains(MultiRunOptions.RESET_LEVELS) && teamMember.death == null
        val resetSpecies = options.contains(MultiRunOptions.RESET_SPECIES) && teamMember.death == null

        val level = if (resetLevel) 5 else teamMember.level
        val baseSpecies = Pokedex.getBaseSpeciesForGame(teamMember.pokedexNumber, newRun.game)
        val pokedexNumber = if (resetSpecies) baseSpecies else teamMember.pokedexNumber

        val generatedGender = Pokedex.generateGender(teamMember.pokedexNumber, newRun.game)
        val gender = if (teamMember.gender == null) generatedGender else teamMember.gender

        val nature = if (teamMember.nature == null) Pokedex.generateNature(newRun.game) else teamMember.nature
        val generatedAbilitySlot = Pokedex.generateAbilitySlot(teamMember.pokedexNumber, newRun.game)
        val abilitySlot = if (teamMember.abilitySlot == null) generatedAbilitySlot else teamMember.abilitySlot

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
                    teamMember.death!!.level,
                    teamMember.death!!.opponent,
                    teamMember.death!!.description
            )
        }
    }

    private fun transferFailedEncounters(currentRun: NuzlockeRun, newRun: NuzlockeRun) {
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
}
