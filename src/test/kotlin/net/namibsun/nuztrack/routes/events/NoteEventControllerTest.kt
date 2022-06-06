package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.NoteEvent
import net.namibsun.nuztrack.data.events.NoteEventService
import net.namibsun.nuztrack.transfer.events.CreateNoteEventTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.http.HttpStatus
import java.security.Principal

class NoteEventControllerTest {

    private val principal: Principal = mock()
    private val service: NoteEventService = mock()
    private val runsService: NuzlockeRunService = mock()

    private val controller = NoteEventController(service, runsService)

    private val user = "Ash"
    private val run = NuzlockeRun(5, user, "First", Games.RED, listOf(), listOf(), RunStatus.COMPLETED)
    private val creator = CreateNoteEventTO("Mahogany Town", "Saw a ghost")

    @Test
    fun createNote() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(service.createNoteEvent(run, creator.location, creator.text)).thenReturn(
                NoteEvent(run, creator.location, creator.text)
        )

        val result = controller.createNoteEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.text).isEqualTo(creator.text)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
        verify(service, times(1)).createNoteEvent(run, creator.location, creator.text)
    }

    @Test
    fun createNoteEvent_validationError() {
        whenever(principal.name).thenReturn(user)
        whenever(runsService.getRun(run.id)).thenReturn(run)

        val brokenCreator = CreateNoteEventTO("", "")

        assertThrows<ValidationException> { controller.createNoteEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEvolutionEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")
        whenever(runsService.getRun(run.id)).thenReturn(run)

        assertThrows<UnauthorizedException> { controller.createNoteEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}