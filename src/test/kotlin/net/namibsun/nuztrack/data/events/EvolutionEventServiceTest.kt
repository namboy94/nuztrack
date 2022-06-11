package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.ENCOUNTER
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import net.namibsun.nuztrack.data.TeamMember
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

        val member = TeamMember(0, "Bulba", 1, 5, Gender.MALE, Natures.NAUGHTY, 1, ENCOUNTER)
        val evolution = service.createEvolutionEvent(NUZLOCKE_RUN, "Pallet Town", member, 50, 2)

        assertThat(evolution.previousPokedexNumber).isEqualTo(1)
        assertThat(evolution.newPokedexNumber).isEqualTo(2)
        verify(repository, times(1)).save(any<EvolutionEvent>())
    }
}
