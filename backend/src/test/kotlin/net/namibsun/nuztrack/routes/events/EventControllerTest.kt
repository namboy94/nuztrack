package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.EventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.http.HttpStatus
import java.security.Principal

class EventControllerTest {

    private val principal: Principal = mock()
    private val runsService: NuzlockeRunService = mock()
    private val service: EventService = mock()
    private val controller = EventController(service, runsService)

    private val run = NuzlockeRunBuilder().addDefaultEvents().build()

    @BeforeEach
    fun setUp() {
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.getAllEvents(run.id)).thenReturn(run.events)
        whenever(principal.name).thenReturn(run.userName)
    }

    @Test
    fun getEvents() {
        val response = controller.getEvents(run.id, principal)
        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        val result = response.body!!

        assertThat(result.encounters.size).isEqualTo(run.events.count { it.eventType == EventType.ENCOUNTER })
        assertThat(result.deaths.size).isEqualTo(run.events.count { it.eventType == EventType.DEATH })
        assertThat(result.evolutions.size).isEqualTo(run.events.count { it.eventType == EventType.EVOLUTION })
        assertThat(result.teamMemberSwitches.size).isEqualTo(
                run.events.count { it.eventType == EventType.TEAM_MEMBER_SWITCH })
        assertThat(result.notes.size).isEqualTo(run.events.count { it.eventType == EventType.NOTE })
        assertThat(result.milestones.size).isEqualTo(run.events.count { it.eventType == EventType.MILESTONE })

        verify(service, times(1)).getAllEvents(run.id)
        verify(principal, times(1)).name
    }

    @Test
    fun getEvents_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")

        assertThrows<UnauthorizedException> { controller.getEvents(run.id, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}