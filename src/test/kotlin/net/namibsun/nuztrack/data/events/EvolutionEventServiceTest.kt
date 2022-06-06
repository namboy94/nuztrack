package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class EvolutionEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = EvolutionEventService(repository)

    private val events = listOf<Event>(
            EvolutionEvent(NUZLOCKE_RUN, "Pallet Town", TEAM_MEMBER, 16, 1, 2),
            EvolutionEvent(NUZLOCKE_RUN, "Pokemon League", TEAM_MEMBER, 32, 2, 3)
    )

    @Test
    fun createEvolutionEvent() {
        whenever(repository.save(any<EvolutionEvent>())).then(AdditionalAnswers.returnsFirstArg<EvolutionEvent>())

        val evolution = service.createEvolutionEvent(NUZLOCKE_RUN, "Pallet Town", TEAM_MEMBER, 50, 1, 2)

        assertThat(evolution.previousPokedexNumber).isEqualTo(1)
        assertThat(evolution.newPokedexNumber).isEqualTo(2)
        verify(repository, times(1)).save(any<EvolutionEvent>())
    }
}
