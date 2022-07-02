package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.data.events.MilestoneEventService
import net.namibsun.nuztrack.transfer.events.CreateMilestoneEventTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

class MilestoneEventControllerTest {

    private val principal: Principal = mock()
    private val service: MilestoneEventService = mock()
    private val runsService: NuzlockeRunService = mock()

    private val controller = MilestoneEventController(service, runsService)

    private val user = "Ash"
    private val run = NuzlockeRun(5, user, "First", Games.RED, listOf(), listOf(), RunStatus.COMPLETED)
    private val creator = CreateMilestoneEventTO("Pewter City", "Boulder Badge")

    @Test
    fun createMilestone() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.createMilestoneEvent(eq(run), eq(creator.location), eq(creator.milestone), any(),
                any())).thenReturn(MilestoneEvent(run, creator.location, creator.milestone))

        val result = controller.createMilestoneEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.milestone).isEqualTo(creator.milestone)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
        verify(service, times(1)).createMilestoneEvent(eq(run), eq(creator.location), eq(creator.milestone), any(),
                any())
    }

    @Test
    fun createMilestoneEvent_validationError() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)

        val brokenCreator = CreateMilestoneEventTO("", "")

        assertThrows<ValidationException> { controller.createMilestoneEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEvolutionEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(run.id)).thenReturn(run)

        assertThrows<UnauthorizedException> { controller.createMilestoneEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

}