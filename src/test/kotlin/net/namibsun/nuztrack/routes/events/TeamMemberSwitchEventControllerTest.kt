package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.*
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.transfer.events.CreateTeamMemberSwitchEventTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

class TeamMemberSwitchEventControllerTest {

    private val principal: Principal = mock()
    private val service: TeamMemberSwitchEventService = mock()
    private val runsService: NuzlockeRunService = mock()

    private val teamMemberService: TeamMemberService = mock()
    private val controller = TeamMemberSwitchEventController(service, teamMemberService, runsService)

    private val user = "Ash"
    private val run = NuzlockeRun(5, user, "First", Games.RED, listOf(), listOf(), RunStatus.COMPLETED)
    private val member = TeamMember(1, "Squirtle", 7, 5, Gender.MALE, Natures.BOLD, 1, ENCOUNTER)
    private val creator = CreateTeamMemberSwitchEventTO("Location", member.id, "ADD")

    @Test
    fun createTeamMemberSwitch() {
        whenever(principal.name).thenReturn(user)
        whenever(teamMemberService.getTeamMember(run.id, member.id)).thenReturn(member)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.createTeamMemberSwitchEvent(run, creator.location, member, TeamMemberSwitchType.ADD))
                .thenReturn(TeamMemberSwitchEvent(run, creator.location, member, TeamMemberSwitchType.ADD))
        whenever(teamMemberService.getTeam(run.id)).thenReturn(Triple(listOf(), listOf(member), listOf()))

        val result = controller.createTeamMemberSwitchEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.teamMemberId).isEqualTo(member.id)
        assertThat(body.switchType).isEqualTo(creator.switchType)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(teamMemberService, times(2)).getTeamMember(run.id, member.id)
        verify(service, times(1)).createTeamMemberSwitchEvent(run, creator.location, member, TeamMemberSwitchType.ADD)
        verify(teamMemberService, times(1)).getTeam(run.id)
    }

    @Test
    fun createTeamMemberSwitchEvent_validationError() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)

        val brokenCreator = CreateTeamMemberSwitchEventTO("", 0, "")

        assertThrows<ValidationException> { controller.createTeamMemberSwitchEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createTeamMemberSwitchEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(run.id)).thenReturn(run)

        assertThrows<UnauthorizedException> { controller.createTeamMemberSwitchEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}
