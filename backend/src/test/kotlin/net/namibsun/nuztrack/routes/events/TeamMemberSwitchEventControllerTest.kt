package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.TeamMemberSwitchEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
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

    private val run = NuzlockeRunBuilder().build()
    private val member = TeamMemberBuilder().build()
    private val switchBuilder = TeamMemberSwitchEventBuilder().nuzlockeRun(run).teamMember(member)
    private val teamMemberSwitch = switchBuilder.build()
    private val creator = switchBuilder.buildCreatorTO()

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(teamMemberService.getTeamMember(run.id, member.id)).thenReturn(member)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(teamMemberService.getTeam(run.id)).thenReturn(Triple(listOf(), listOf(member), listOf()))
    }

    @Test
    fun createTeamMemberSwitch() {
        whenever(
                service.createTeamMemberSwitchEvent(
                        eq(run), eq(creator.location), eq(member), eq(TeamMemberSwitchType.ADD), any(), any()
                )
        ).thenReturn(
                teamMemberSwitch
        )

        val result = controller.createTeamMemberSwitchEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.teamMemberId).isEqualTo(member.id)
        assertThat(body.switchType).isEqualTo(creator.switchType)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(teamMemberService, times(2)).getTeamMember(run.id, member.id)
        verify(service, times(1)).createTeamMemberSwitchEvent(
                eq(run), eq(creator.location), eq(member), eq(TeamMemberSwitchType.ADD), any(), any()
        )
        verify(teamMemberService, times(1)).getTeam(run.id)
    }

    @Test
    fun createTeamMemberSwitchEvent_validationError() {
        val brokenCreator = TeamMemberSwitchEventBuilder().location("").buildCreatorTO()

        assertThrows<ValidationException> { controller.createTeamMemberSwitchEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createTeamMemberSwitchEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")

        assertThrows<UnauthorizedException> { controller.createTeamMemberSwitchEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}
