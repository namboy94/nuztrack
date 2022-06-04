package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class DeathEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = DeathEventService(repository)

    private val events = listOf<Event>(
            DeathEvent(NUZLOCKE_RUN, "Pallet Town", TEAM_MEMBER, 80, "A", "B"),
            DeathEvent(NUZLOCKE_RUN, "Pokemon League", TEAM_MEMBER, 80, "A", "B")
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventType(EventType.DEATH)).thenReturn(events)
        assertThat(service.getAllDeathEvents()).isEqualTo(events)
        verify(repository, times(1)).findAllByEventType(EventType.DEATH)
    }

    @Test
    fun createDeathEvent() {
        whenever(repository.save(any<DeathEvent>())).then(AdditionalAnswers.returnsFirstArg<DeathEvent>())

        val death = service.createDeathEvent(NUZLOCKE_RUN, "Pallet Town", TEAM_MEMBER, 50, "X", "Y")

        assertThat(death.opponent).isEqualTo("X")
        verify(repository, times(1)).save(any<DeathEvent>())
    }
}
