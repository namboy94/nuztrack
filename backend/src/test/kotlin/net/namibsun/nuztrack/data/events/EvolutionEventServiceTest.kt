package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class EvolutionEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = EvolutionEventService(repository)

    @Test
    fun createEvolutionEvent() {
        whenever(repository.save(any<EvolutionEvent>())).thenAnswer { it.getArgument(0) }

        val run = NuzlockeRunBuilder().build()
        val member = TeamMemberBuilder().isBulbasaur().build()
        val evolution = service.createEvolutionEvent(run, "Pallet Town", member, 50, 2)

        assertThat(evolution.previousPokedexNumber).isEqualTo(1)
        assertThat(evolution.newPokedexNumber).isEqualTo(2)
        verify(repository, times(1)).save(any<EvolutionEvent>())
    }
}
