package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.NoteEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder

data class NoteEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var text: String = "Note Text"
) {
    fun build() = NoteEvent(nuzlockeRun, location, text)
}
