package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.MilestoneEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class MilestoneEventTOTest {
    @Test
    fun testConverting() {
        val event = MilestoneEventBuilder().build()
        val converted = MilestoneEventTO.fromMilestoneEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.milestone).isEqualTo(event.milestone)
    }
}