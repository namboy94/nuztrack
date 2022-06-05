package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import net.namibsun.nuztrack.data.events.DeathEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class DeathEventTOTest {
    @Test
    fun testConverting() {
        val event = DeathEvent(NUZLOCKE_RUN, "A", TEAM_MEMBER, 50, "B", "C")
        val converted = DeathEventTO.fromDeathEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.teamMemberId).isEqualTo(event.teamMember.id)
        assertThat(converted.level).isEqualTo(event.level)
    }
}