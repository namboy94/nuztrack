package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EventService
import net.namibsun.nuztrack.transfer.NuzlockeRunExportTO
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import net.namibsun.nuztrack.transfer.TeamTO
import net.namibsun.nuztrack.transfer.events.EventLogTO
import net.namibsun.nuztrack.util.Authenticator
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
class ImportExportController(
        val runService: NuzlockeRunService,
        val eventService: EventService,
        val teamService: TeamMemberService
) {

    @Suppress("LeakingThis")
    val authenticator = Authenticator(runService)

    @GetMapping("/api/export/{runId}")
    @ResponseBody
    fun export(@PathVariable runId: Long, principal: Principal): ResponseEntity<NuzlockeRunExportTO> {
        val run = authenticator.loadAuthenticatedRun(runId, principal.name)
        val events = eventService.getAllEvents(runId)
        val team = teamService.getTeam(runId)
        val export = NuzlockeRunExportTO(
                NuzlockeRunTO.fromNuzlockeRun(run),
                EventLogTO.fromEvents(events),
                TeamTO.fromTeam(team)
        )
        return ResponseEntity.ok(export)
    }

    @PostMapping("/api/import")
    @ResponseBody
    fun import(@RequestBody exportData: NuzlockeRunExportTO, principal: Principal): ResponseEntity<Unit> {
        val runData = exportData.run
        val eventsData = exportData.events
        val teamData = exportData.team
        val teamMembers =
                teamData.active.associateBy { it.id } +
                        teamData.boxed.associateBy { it.id } +
                        teamData.dead.associateBy { it.id }
        val newTeamMembers = mutableMapOf<Long, TeamMember>()

        val run = runService.createRun(
                principal.name,
                runData.name,
                Games.valueOfWithChecks(runData.game.key),
                runData.rules.map { Rules.valueOfWithChecks(it) },
                runData.customRules
        )
        eventsData.encounters.map {
            val encounter = eventService.addEvent(it.toEncounterEvent(run)) as EncounterEvent
            if (encounter.caught && it.teamMemberId != null && it.teamMemberId in teamMembers) {
                newTeamMembers[it.teamMemberId] = teamMembers[it.teamMemberId]!!.toTeamMember(encounter)
            }
        }
        eventsData.deaths.filter { it.teamMemberId in newTeamMembers }.map {
            eventService.addEvent(it.toDeathEvent(run, newTeamMembers[it.teamMemberId]!!))
        }
        eventsData.evolutions.filter { it.teamMemberId in newTeamMembers }.map {
            eventService.addEvent(it.toEvolutionEvent(run, newTeamMembers[it.teamMemberId]!!))
        }
        eventsData.teamMemberSwitches.filter { it.teamMemberId in newTeamMembers }.map {
            eventService.addEvent(it.toTeamMemberSwitchEvent(run, newTeamMembers[it.teamMemberId]!!))
        }
        eventsData.notes.map { eventService.addEvent(it.toNoteEvent(run)) }
        eventsData.milestones.map { eventService.addEvent(it.toMilestoneEvent(run)) }
        return ResponseEntity.ok(Unit)
    }
}
