package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import net.namibsun.nuztrack.util.formatDateToIsoString
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class EventTOTest {
    @Test
    fun testConverting() {
        val event = EncounterEventBuilder().build()
        val converted = EventTO.fromEvent(event)
        assertThat(converted.id).isEqualTo(event.id)
        assertThat(converted.runId).isEqualTo(event.nuzlockeRun.id)
        assertThat(converted.location).isEqualTo(event.location)
        assertThat(converted.timestamp).isEqualTo(formatDateToIsoString(event.timestamp))
    }
}