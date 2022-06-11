package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.*
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.DeathEventService
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEventService
import net.namibsun.nuztrack.transfer.events.CreateDeathEventTO
import org.assertj.core.api.Assertions.assertThat
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

    private val user = "Ash"
    private val run = NuzlockeRun(5, user, "First", Games.RED, listOf(), listOf(), RunStatus.COMPLETED)
    private val member = TeamMember(
            1, "Squirtle", 7, 5, Gender.MALE, Natures.BOLD, 1, ENCOUNTER,
            teamSwitches = listOf(TeamMemberSwitchEvent(run, "Oak's Lab", TEAM_MEMBER, TeamMemberSwitchType.ADD))
    )
    private val creator = CreateDeathEventTO("Location", member.id, 10, "Gary", "Died")

    @Test
    fun createDeath() {
        whenever(principal.name).thenReturn(user)
        whenever(teamMemberService.getTeamMember(run.id, member.id)).thenReturn(member)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.createDeathEvent(
                run, creator.location, member, creator.level, creator.opponent, creator.description
        )).thenReturn(DeathEvent(run, creator.location, member, creator.level, creator.opponent, creator.description))
        whenever(switchService.createTeamMemberSwitchEvent(
                run, creator.location, member, TeamMemberSwitchType.REMOVE
        )).thenReturn(TeamMemberSwitchEvent(run, creator.location, member, TeamMemberSwitchType.REMOVE))
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
        verify(service, times(1)).createDeathEvent(
                run, creator.location, member, creator.level, creator.opponent, creator.description
        )
        verify(switchService, times(1)).createTeamMemberSwitchEvent(
                run, creator.location, member, TeamMemberSwitchType.REMOVE
        )
        verify(teamMemberService, times(1)).setLevel(member.id, creator.level)
        verify(teamMemberService, times(1)).getTeam(run.id)
    }

    @Test
    fun createDeathEvent_validationError() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)

        val brokenCreator = CreateDeathEventTO("", 0, 0, "", "")

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
