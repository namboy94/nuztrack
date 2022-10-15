package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.NoteEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class NoteEventTOTest {
    @Test
    fun testConverting() {
        val event = NoteEventBuilder().build()
        val converted = NoteEventTO.fromNoteEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.text).isEqualTo(event.text)
    }
}