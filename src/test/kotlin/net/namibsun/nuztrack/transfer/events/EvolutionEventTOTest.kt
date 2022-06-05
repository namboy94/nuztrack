package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import net.namibsun.nuztrack.data.events.EvolutionEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class EvolutionEventTOTest {
    @Test
    fun testConverting() {
        val event = EvolutionEvent(NUZLOCKE_RUN, "A", TEAM_MEMBER, 50, 1, 2)
        val converted = EvolutionEventTO.fromEvolutionEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.teamMemberId).isEqualTo(event.teamMember.id)
        assertThat(converted.level).isEqualTo(event.level)
        assertThat(converted.newPokedexNumber).isEqualTo(event.newPokedexNumber)
    }
}