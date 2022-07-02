package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.MilestoneEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.MilestoneEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
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

    private val run = NuzlockeRunBuilder().build()
    private val milestoneBuilder = MilestoneEventBuilder().nuzlockeRun(run)
    private val milestone = milestoneBuilder.build()
    private val creator = milestoneBuilder.buildCreatorTO()

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
    }

    @Test
    fun createMilestone() {
        whenever(
                service.createMilestoneEvent(
                        eq(run), eq(creator.location), eq(creator.milestone), any(), any()
                )
        ).thenReturn(milestone)

        val result = controller.createMilestoneEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.milestone).isEqualTo(creator.milestone)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
        verify(service, times(1)).createMilestoneEvent(
                eq(run), eq(creator.location), eq(creator.milestone), any(), any()
        )
    }

    @Test
    fun createMilestoneEvent_validationError() {
        val brokenCreator = MilestoneEventBuilder().location("").buildCreatorTO()

        assertThrows<ValidationException> { controller.createMilestoneEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEvolutionEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")

        assertThrows<UnauthorizedException> { controller.createMilestoneEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

}