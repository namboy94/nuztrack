package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.DeathEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class DeathEventTOTest {
    @Test
    fun testConverting() {
        val event = DeathEventBuilder().build()
        val converted = DeathEventTO.fromDeathEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.teamMemberId).isEqualTo(event.teamMember.id)
        assertThat(converted.level).isEqualTo(event.level)
    }
}