package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import net.namibsun.nuztrack.util.formatDateToIsoString
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class EncounterEventTOTest {
    @Test
    fun testConverting() {
        val event = EncounterEventBuilder().teamMember(null).caught(false).build()
        val converted = EncounterEventTO.fromEncounterEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.event.runId).isEqualTo(event.nuzlockeRun.id)
        assertThat(converted.event.location).isEqualTo(event.location)
        assertThat(converted.event.timestamp).isEqualTo(formatDateToIsoString(event.timestamp))
        assertThat(converted.pokedexNumber).isEqualTo(event.pokedexNumber)
        assertThat(converted.caught).isEqualTo(false)
        assertThat(converted.teamMemberId).isEqualTo(null)
    }
}