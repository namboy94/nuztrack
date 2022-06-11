package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.util.formatDateToIsoString
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class EncounterEventTOTest {
    @Test
    fun testConverting() {
        val run = NuzlockeRun(
                100, "A", "B", Games.RED, listOf(Rules.DEATH), listOf("TEST"), RunStatus.ACTIVE
        )
        val event = EncounterEvent(run, "A", 1, 1, false)
        val converted = EncounterEventTO.fromEncounterEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.event.runId).isEqualTo(run.id)
        assertThat(converted.event.location).isEqualTo(event.location)
        assertThat(converted.event.timestamp).isEqualTo(formatDateToIsoString(event.timestamp))
        assertThat(converted.pokedexNumber).isEqualTo(event.pokedexNumber)
        assertThat(converted.caught).isEqualTo(event.caught)
        assertThat(converted.teamMemberId).isEqualTo(null)
    }
}