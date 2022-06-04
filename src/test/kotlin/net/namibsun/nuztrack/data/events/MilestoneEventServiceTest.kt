package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class MilestoneEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = MilestoneEventService(repository)

    private val events = listOf<Event>(
            MilestoneEvent(NUZLOCKE_RUN, "Pallet Town", "Pokedex"),
            MilestoneEvent(NUZLOCKE_RUN, "Pokemon League", "Champion")
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventType(EventType.MILESTONE)).thenReturn(events)
        assertThat(service.getAllMilestoneEvents()).isEqualTo(events)
        verify(repository, times(1)).findAllByEventType(EventType.MILESTONE)
    }

    @Test
    fun createMilestoneEvent() {
        whenever(repository.save(any<MilestoneEvent>())).then(AdditionalAnswers.returnsFirstArg<MilestoneEvent>())

        val milestone = service.createMilestoneEvent(NUZLOCKE_RUN, "Pallet Town", "Pokedex")

        assertThat(milestone.location).isEqualTo("Pallet Town")
        assertThat(milestone.milestone).isEqualTo("Pokedex")
        verify(repository, times(1)).save(any<MilestoneEvent>())
    }
}
