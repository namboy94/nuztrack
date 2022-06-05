package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

class EventServiceTest {
    private val repository: EventRepository = mock()
    private val service = EventService(repository)

    private val events = listOf<Event>(
            NoteEvent(NUZLOCKE_RUN, "Pallet Town", "Hello World"),
            NoteEvent(NUZLOCKE_RUN, "Pokemon League", "Goodbye")
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByNuzlockeRunId(1)).thenReturn(events)
        assertThat(service.getAllEvents(1)).isEqualTo(events)
    }
}
