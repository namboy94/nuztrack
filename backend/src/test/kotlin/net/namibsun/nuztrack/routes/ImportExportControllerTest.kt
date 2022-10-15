package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.transfer.NuzlockeRunTO
import net.namibsun.nuztrack.transfer.TeamTO
import net.namibsun.nuztrack.transfer.events.EventLogTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

internal class ImportExportControllerTest {

    private val runsService: NuzlockeRunService = mock()
    private val eventService: EventService = mock()
    private val teamService: TeamMemberService = mock()
    private val controller = ImportExportController(runsService, eventService, teamService)
    private val principal: Principal = mock()

    private val run = NuzlockeRunBuilder().addDefaultEvents().build()
    private val encounters = run.events.filter { it.eventType == EventType.ENCOUNTER }.map { it as EncounterEvent }
    private val team = Triple(
            encounters
                    .filter { it.teamMember?.death == null && it.teamMember?.teamSwitches?.size == 1 }
                    .map { it.teamMember!! },
            encounters
                    .filter { it.teamMember?.death == null && it.teamMember?.teamSwitches?.size == 0 }
                    .map { it.teamMember!! },
            encounters
                    .filter { it.teamMember?.death != null }
                    .map { it.teamMember!! },
    )

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(eventService.getAllEvents(run.id)).thenReturn(run.events)
        whenever(teamService.getTeam(run.id)).thenReturn(team)
    }


    @Test
    fun export() {
        val result = controller.export(run.id, principal)
        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)

        val exported = result.body!!

        assertThat(exported.run).isEqualTo(NuzlockeRunTO.fromNuzlockeRun(run))
        assertThat(exported.events).isEqualTo(EventLogTO.fromEvents(run.events))
        assertThat(exported.team).isEqualTo(TeamTO.fromTeam(team))
    }

    @Test
    fun import() {
        val exported = controller.export(run.id, principal).body!!

        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.createRun("OtherUser", run.name, run.game, run.rules, run.customRules)).thenReturn(run)
        whenever(eventService.addEvent(any())).thenAnswer { params -> params.getArgument(0) }
        whenever(teamService.addTeamMember(any())).thenAnswer { params -> params.getArgument(0) }

        val result = controller.import(exported, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)

        verify(runsService, times(1)).createRun("OtherUser", run.name, run.game, run.rules, run.customRules)
        verify(eventService, times(run.events.size)).addEvent(any())
        verify(teamService, times(team.first.size + team.second.size + team.third.size)).addTeamMember(any())
    }

}