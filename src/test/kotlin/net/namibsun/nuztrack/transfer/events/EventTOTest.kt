package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.util.formatDateToIsoString
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class EventTOTest {
    @Test
    fun testConverting() {
        val run = NuzlockeRun(
                100, "A", "B", Games.RED, listOf(Rules.DEATH), listOf("TEST"), RunStatus.ACTIVE
        )
        val event = EncounterEvent(run, "A", 1, 1, Gender.MALE, false)
        val converted = EventTO.fromEvent(event)
        assertThat(converted.id).isEqualTo(event.id)
        assertThat(converted.runId).isEqualTo(run.id)
        assertThat(converted.location).isEqualTo(event.location)
        assertThat(converted.timeStamp).isEqualTo(formatDateToIsoString(event.timestamp))
    }
}