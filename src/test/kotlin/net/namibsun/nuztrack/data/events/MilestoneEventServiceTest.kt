package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class MilestoneEventServiceTest {
    private val run = NuzlockeRunBuilder().build()
    private val repository: EventRepository = mock()
    private val service = MilestoneEventService(repository)

    @Test
    fun createMilestoneEvent() {
        whenever(repository.save(any<MilestoneEvent>())).thenAnswer { it.getArgument(0) }

        val milestone = service.createMilestoneEvent(run, "Pallet Town", "Pokedex")

        assertThat(milestone.location).isEqualTo("Pallet Town")
        assertThat(milestone.milestone).isEqualTo("Pokedex")
        verify(repository, times(1)).save(any<MilestoneEvent>())
    }
}
