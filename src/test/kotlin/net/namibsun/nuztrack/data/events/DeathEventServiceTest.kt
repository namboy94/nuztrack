package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class DeathEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = DeathEventService(repository)

    @Test
    fun createDeathEvent() {
        whenever(repository.save(any<DeathEvent>())).then(AdditionalAnswers.returnsFirstArg<DeathEvent>())

        val run = NuzlockeRunBuilder().build()
        val member = TeamMemberBuilder().build()
        val death = service.createDeathEvent(run, "Pallet Town", member, 50, "X", "Y")

        assertThat(death.location).isEqualTo("Pallet Town")
        verify(repository, times(1)).save(any<DeathEvent>())
    }
}
