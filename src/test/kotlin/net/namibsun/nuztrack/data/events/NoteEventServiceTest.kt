package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class NoteEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = NoteEventService(repository)

    @Test
    fun createNoteEvent() {
        whenever(repository.save(any<NoteEvent>())).thenAnswer { it.getArgument(0) }

        val run = NuzlockeRunBuilder().build()
        val note = service.createNoteEvent(run, "Pallet Town", "Game Start")

        assertThat(note.location).isEqualTo("Pallet Town")
        assertThat(note.text).isEqualTo("Game Start")
        verify(repository, times(1)).save(any<NoteEvent>())
    }
}
