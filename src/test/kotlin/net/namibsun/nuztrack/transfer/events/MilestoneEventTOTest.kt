package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.events.MilestoneEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class MilestoneEventTOTest {
    @Test
    fun testConverting() {
        val event = MilestoneEvent(NUZLOCKE_RUN, "A", "B")
        val converted = MilestoneEventTO.fromMilestoneEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.milestone).isEqualTo(event.milestone)
    }
}