package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.*
import net.namibsun.nuztrack.data.events.EvolutionEvent
import net.namibsun.nuztrack.data.events.EvolutionEventService
import net.namibsun.nuztrack.transfer.events.CreateEvolutionEventTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

class EvolutionEventControllerTest {

    private val principal: Principal = mock()
    private val service: EvolutionEventService = mock()
    private val runsService: NuzlockeRunService = mock()

    private val teamMemberService: TeamMemberService = mock()
    private val controller = EvolutionEventController(service, teamMemberService, runsService)

    private val user = "Ash"
    private val run = NuzlockeRun(5, user, "First", Games.RED, listOf(), listOf(), RunStatus.COMPLETED)
    private val member = TeamMember(1, "Squirtle", 7, 5, Natures.BOLD, 1, ENCOUNTER)
    private val creator = CreateEvolutionEventTO("Location", member.id, 16, 8)

    @Test
    fun createEvolution() {
        whenever(principal.name).thenReturn(user)
        whenever(teamMemberService.getTeamMember(run.id, member.id)).thenReturn(member)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.createEvolutionEvent(
                run, creator.location, member, creator.level, creator.newPokedexNumber
        )).thenReturn(EvolutionEvent(
                run, creator.location, member, creator.level, member.pokedexNumber, creator.newPokedexNumber
        ))
        whenever(teamMemberService.setLevel(member.id, creator.level)).thenReturn(member)
        whenever(teamMemberService.evolveTo(member.id, creator.newPokedexNumber)).thenReturn(member)

        val result = controller.createEvolutionEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.teamMemberId).isEqualTo(member.id)
        assertThat(body.level).isEqualTo(creator.level)
        assertThat(body.event.location).isEqualTo(creator.location)
        assertThat(body.previousPokedexNumber).isEqualTo(member.pokedexNumber)
        assertThat(body.newPokedexNumber).isEqualTo(creator.newPokedexNumber)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(any())
        verify(teamMemberService, times(2)).getTeamMember(run.id, member.id)
        verify(service, times(1)).createEvolutionEvent(
                run, creator.location, member, creator.level, creator.newPokedexNumber
        )
        verify(teamMemberService, times(1)).setLevel(member.id, creator.level)
        verify(teamMemberService, times(1)).evolveTo(member.id, creator.newPokedexNumber)
    }

    @Test
    fun createEvolutionEvent_validationError() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)

        val brokenCreator = CreateEvolutionEventTO("", 0, 0, 0)

        assertThrows<ValidationException> { controller.createEvolutionEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEvolutionEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(run.id)).thenReturn(run)

        assertThrows<UnauthorizedException> { controller.createEvolutionEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}
