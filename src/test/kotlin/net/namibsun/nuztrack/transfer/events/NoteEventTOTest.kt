package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.events.NoteEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class NoteEventTOTest {
    @Test
    fun testConverting() {
        val event = NoteEvent(NUZLOCKE_RUN, "A", "B")
        val converted = NoteEventTO.fromNoteEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.text).isEqualTo(event.text)
    }
}