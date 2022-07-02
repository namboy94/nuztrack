package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.EvolutionEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class EvolutionEventTOTest {
    @Test
    fun testConverting() {
        val event = EvolutionEventBuilder().build()
        val converted = EvolutionEventTO.fromEvolutionEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.teamMemberId).isEqualTo(event.teamMember.id)
        assertThat(converted.level).isEqualTo(event.level)
        assertThat(converted.newPokedexNumber).isEqualTo(event.newPokedexNumber)
    }
}