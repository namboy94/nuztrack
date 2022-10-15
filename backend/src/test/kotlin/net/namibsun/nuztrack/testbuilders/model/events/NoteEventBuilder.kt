package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.NoteEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.transfer.events.CreateNoteEventTO
import net.namibsun.nuztrack.transfer.events.NoteEventTO
import java.util.*

data class NoteEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var text: String = "Note Text",
        var id: Long = 1,
        var timestamp: Date = Date()
) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun text(text: String) = apply { this.text = text }
    fun id(id: Long) = apply { this.id = id }
    fun timestamp(timestamp: Date) = apply { this.timestamp = timestamp }

    fun build() = NoteEvent(nuzlockeRun, location, text, id, timestamp)
    fun buildCreatorTO() = CreateNoteEventTO(location, text)
    fun buildTO() = NoteEventTO.fromNoteEvent(this.build())
}
