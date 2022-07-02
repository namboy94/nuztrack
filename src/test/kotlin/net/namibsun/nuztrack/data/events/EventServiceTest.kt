package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.MilestoneEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.NoteEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

class EventServiceTest {

    private val run = NuzlockeRunBuilder().build()
    private val repository: EventRepository = mock()
    private val service = EventService(repository)

    private val events = listOf(
            NoteEventBuilder().nuzlockeRun(run).build(),
            MilestoneEventBuilder().nuzlockeRun(run).build()
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByNuzlockeRunIdOrderByTimestamp(run.id)).thenReturn(events)
        assertThat(service.getAllEvents(run.id)).isEqualTo(events)
    }

    @Test
    fun addEvent() {
        events.map {
            whenever(repository.save(it)).thenReturn(it)
            service.addEvent(it)
            verify(repository, times(1)).save(it)
        }
    }
}
