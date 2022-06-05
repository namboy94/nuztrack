package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.*
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.transfer.TeamMemberTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.http.HttpStatus
import java.security.Principal

internal class TeamMemberControllerTest {

    private val principal: Principal = mock()
    private val runsService: NuzlockeRunService = mock()
    private val service: TeamMemberService = mock()
    private val controller = TeamMemberController(service, runsService)

    private val user = "Ash"
    private val nuzlockeRun = NuzlockeRun(
            5, user, "First", Games.RED, listOf(Rules.ONLY_FIRST_ENCOUNTER), listOf(), RunStatus.COMPLETED
    )

    private val teamMemberOne = TeamMember(
            1, "A", 1, 1, Natures.BOLD, 1,
            EncounterEvent(nuzlockeRun, "A", 1, 1, Gender.MALE, true),
            teamSwitches = listOf(
                    TeamMemberSwitchEvent(nuzlockeRun, "A", TEAM_MEMBER, TeamMemberSwitchType.ADD)
            )
    )
    private val teamMemberTwo = TeamMember(
            1, "B", 1, 1, Natures.ADAMANT, 1,
            EncounterEvent(nuzlockeRun, "B", 1, 1, Gender.MALE, true),
            teamSwitches = listOf(
                    TeamMemberSwitchEvent(nuzlockeRun, "B", TEAM_MEMBER, TeamMemberSwitchType.ADD),
                    TeamMemberSwitchEvent(nuzlockeRun, "B", TEAM_MEMBER, TeamMemberSwitchType.REMOVE)
            )
    )
    private val teamMemberThree = TeamMember(
            1, "C", 1, 1, Natures.NAUGHTY, 1,
            EncounterEvent(nuzlockeRun, "C", 1, 1, Gender.MALE, true),
            teamSwitches = listOf(
                    TeamMemberSwitchEvent(nuzlockeRun, "C", TEAM_MEMBER, TeamMemberSwitchType.ADD)
            ),
            death = DeathEvent(nuzlockeRun, "C", TEAM_MEMBER, 1, "C", "C")
    )


    @Test
    fun getTeam() {
        whenever(service.getAllForNuzlockeRun(nuzlockeRun))
                .thenReturn(listOf(teamMemberOne, teamMemberTwo, teamMemberThree))
        whenever(runsService.getRun(nuzlockeRun.id)).thenReturn(nuzlockeRun)
        whenever(principal.name).thenReturn(user)

        val result = controller.getTeam(nuzlockeRun.id, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(result.body!!.active[0]).isEqualTo(TeamMemberTO.fromTeamMember(teamMemberOne))
        assertThat(result.body!!.boxed[0]).isEqualTo(TeamMemberTO.fromTeamMember(teamMemberTwo))
        assertThat(result.body!!.dead[0]).isEqualTo(TeamMemberTO.fromTeamMember(teamMemberThree))

        verify(principal, times(1)).name
        verify(service, times(1)).getAllForNuzlockeRun(nuzlockeRun)
        verify(runsService, times(1)).getRun(nuzlockeRun.id)
    }
}