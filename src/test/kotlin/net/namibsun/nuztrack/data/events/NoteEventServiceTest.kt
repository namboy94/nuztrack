package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class NoteEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = NoteEventService(repository)

    private val events = listOf<Event>(
            NoteEvent(NUZLOCKE_RUN, "Pallet Town", "Hello World"),
            NoteEvent(NUZLOCKE_RUN, "Pokemon League", "Goodbye")
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventTypeOrderByTimestamp(EventType.NOTE)).thenReturn(events)
        assertThat(service.getAllNoteEvents()).isEqualTo(events)
        verify(repository, times(1)).findAllByEventTypeOrderByTimestamp(EventType.NOTE)
    }

    @Test
    fun createNoteEvent() {
        whenever(repository.save(any<NoteEvent>())).then(AdditionalAnswers.returnsFirstArg<NoteEvent>())

        val note = service.createNoteEvent(NUZLOCKE_RUN, "Pallet Town", "Game Start")

        assertThat(note.location).isEqualTo("Pallet Town")
        verify(repository, times(1)).save(any<NoteEvent>())
    }
}
