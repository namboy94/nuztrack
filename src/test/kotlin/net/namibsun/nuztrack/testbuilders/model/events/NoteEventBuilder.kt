package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.NoteEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.transfer.events.CreateNoteEventTO
import net.namibsun.nuztrack.transfer.events.NoteEventTO

data class NoteEventBuilder(var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
                            var location: String = "Pallet Town", var text: String = "Note Text") {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun text(text: String) = apply { this.text = text }
    fun build() = NoteEvent(nuzlockeRun, location, text)
    fun buildCreatorTO() = CreateNoteEventTO(location, text)
    fun buildTO() = NoteEventTO.fromNoteEvent(this.build())
}
