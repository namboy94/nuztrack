package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.EvolutionEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EvolutionEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
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

    private val run = NuzlockeRunBuilder().build()
    private val member = TeamMemberBuilder().build()
    private val evolutionBuilder = EvolutionEventBuilder().teamMember(member).nuzlockeRun(run)
    private val evolution = evolutionBuilder.build()
    private val creator = evolutionBuilder.buildCreatorTO()

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(teamMemberService.getTeamMember(run.id, member.id)).thenReturn(member)
        whenever(teamMemberService.setLevel(member.id, creator.level)).thenReturn(member)
        whenever(teamMemberService.evolveTo(member.id, creator.newPokedexNumber)).thenReturn(member)
    }

    @Test
    fun createEvolution() {
        whenever(
                service.createEvolutionEvent(
                        eq(run), eq(creator.location), eq(member), eq(creator.level), eq(creator.newPokedexNumber),
                        any(), any()
                )
        ).thenReturn(evolution)

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
                eq(run), eq(creator.location), eq(member), eq(creator.level), eq(creator.newPokedexNumber), any(), any()
        )
        verify(teamMemberService, times(1)).setLevel(member.id, creator.level)
        verify(teamMemberService, times(1)).evolveTo(member.id, creator.newPokedexNumber)
    }

    @Test
    fun createEvolutionEvent_validationError() {
        val brokenCreator = EvolutionEventBuilder().location("").buildCreatorTO()

        assertThrows<ValidationException> { controller.createEvolutionEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEvolutionEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")

        assertThrows<UnauthorizedException> { controller.createEvolutionEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}
