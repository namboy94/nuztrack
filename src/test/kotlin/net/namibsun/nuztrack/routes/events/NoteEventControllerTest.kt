package net.namibsun.nuztrack.routes.events

import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.events.NoteEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.NoteEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.http.HttpStatus
import java.security.Principal

class NoteEventControllerTest {

    private val principal: Principal = mock()
    private val service: NoteEventService = mock()
    private val runsService: NuzlockeRunService = mock()

    private val controller = NoteEventController(service, runsService)

    private val run = NuzlockeRunBuilder().build()
    private val noteBuilder = NoteEventBuilder().nuzlockeRun(run)
    private val note = noteBuilder.build()
    private val creator = noteBuilder.buildCreatorTO()

    @BeforeEach
    fun setUp() {
        whenever(principal.name).thenReturn(run.userName)
        whenever(runsService.getRun(run.id)).thenReturn(run)
    }

    @Test
    fun createNote() {
        whenever(service.createNoteEvent(eq(run), eq(creator.location), eq(creator.text), any(), any())).thenReturn(
                note
        )

        val result = controller.createNoteEvent(run.id, creator, principal)
        val body = result.body!!

        assertThat(result.statusCode).isEqualTo(HttpStatus.CREATED)
        assertThat(body.text).isEqualTo(creator.text)
        assertThat(body.event.location).isEqualTo(creator.location)

        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
        verify(service, times(1)).createNoteEvent(eq(run), eq(creator.location), eq(creator.text), any(), any())
    }

    @Test
    fun createNoteEvent_validationError() {
        val brokenCreator = NoteEventBuilder().location("").buildCreatorTO()

        assertThrows<ValidationException> { controller.createNoteEvent(run.id, brokenCreator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }

    @Test
    fun createEvolutionEvent_unauthorized() {
        whenever(principal.name).thenReturn("OtherUser")

        assertThrows<UnauthorizedException> { controller.createNoteEvent(run.id, creator, principal) }
        verify(principal, times(1)).name
        verify(runsService, times(1)).getRun(run.id)
    }
}