package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.MilestoneEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class MilestoneEventServiceTest {
    private val run = NuzlockeRunBuilder().build()
    private val repository: EventRepository = mock()
    private val service = MilestoneEventService(repository)

    private val events = listOf(
            MilestoneEventBuilder().id(1).build(),
            MilestoneEventBuilder().id(2).location("Cerulean City").milestone("Cascade Badge").build()
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.MILESTONE, 1)).thenReturn(
                        events
                )
        assertThat(service.getMilestoneEvents(1)).isEqualTo(events)
        verify(repository, times(1)).findAllByEventTypeAndNuzlockeRunIdOrderByTimestamp(EventType.MILESTONE, 1)
    }

    @Test
    fun createMilestoneEvent() {
        whenever(repository.save(any<MilestoneEvent>())).thenAnswer { it.getArgument(0) }

        val milestone = service.createMilestoneEvent(run, "Pallet Town", "Pokedex")

        assertThat(milestone.location).isEqualTo("Pallet Town")
        assertThat(milestone.milestone).isEqualTo("Pokedex")
        verify(repository, times(1)).save(any<MilestoneEvent>())
    }
}
