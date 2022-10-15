package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.DeathEventService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.DeathEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

class DeathEventControllerTest {
    private val principal: Principal = mock()
    private val service: DeathEventService = mock()
    private val runsService: NuzlockeRunService = mock()
    private val switchService: TeamMemberSwitchEventService = mock()
    private val teamMemberService: TeamMemberService = mock()
    private val controller = DeathEventController(service, teamMemberService, switchService, runsService)

    private val run = NuzlockeRunBuilder().build()
    private val member = TeamMemberBuilder().build()
    private val creator = DeathEventBuilder().teamMember(member).buildCreatorTO()

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
    }

    @Test
    fun createDeath() {
        whenever(teamMemberService.getTeamMember(run.id, member.id)).thenReturn(member)
        whenever(service.createDeathEvent(eq(run), eq(creator.location), eq(member), eq(creator.level),
                eq(creator.opponent), eq(creator.description), any(), any())).thenReturn(
                DeathEvent(run, creator.location, member, creator.level, creator.opponent, creator.description))
        whenever(switchService.createTeamMemberSwitchEvent(eq(run), eq(creator.location), eq(member),
                eq(TeamMemberSwitchType.REMOVE), any(), any())).thenReturn(
                TeamMemberSwitchEvent(run, creator.location, member, TeamMemberSwitchType.REMOVE))
        whenever(teamMemberService.setLevel(member.id, creator.level)).thenReturn(member)
        whenever(teamMemberService.getTeam(run.id)).thenReturn(Triple(listOf(member), listOf(), listOf()))

        val result = controller.createDeathEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.teamMemberId).isEqualTo(member.id)
        assertThat(body.description).isEqualTo(creator.description)
        assertThat(body.level).isEqualTo(creator.level)
        assertThat(body.opponent).isEqualTo(creator.opponent)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(teamMemberService, times(2)).getTeamMember(run.id, member.id)
        verify(service, times(1)).createDeathEvent(eq(run), eq(creator.location), eq(member), eq(creator.level),
                eq(creator.opponent), eq(creator.description), any(), any())
        verify(switchService, times(1)).createTeamMemberSwitchEvent(eq(run), eq(creator.location), eq(member),
                eq(TeamMemberSwitchType.REMOVE), any(), any())
        verify(teamMemberService, times(1)).setLevel(member.id, creator.level)
        verify(teamMemberService, times(1)).getTeam(run.id)
    }

    @Test
    fun createDeathEvent_validationError() {
        val brokenCreator = DeathEventBuilder().location("").buildCreatorTO()

        assertThrows<ValidationException> { controller.createDeathEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createDeathEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(run.id)).thenReturn(run)

        assertThrows<UnauthorizedException> { controller.createDeathEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}
