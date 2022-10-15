package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.NoteEvent
import net.namibsun.nuztrack.util.parseDateFromIsoString
import net.namibsun.nuztrack.util.validateEmptyLocation

data class NoteEventTO(val event: EventTO, val text: String) {
    companion object {
        fun fromNoteEvent(event: NoteEvent): NoteEventTO {
            return NoteEventTO(EventTO.fromEvent(event), event.text)
        }
    }

    fun toNoteEvent(run: NuzlockeRun, keepId: Boolean = false): NoteEvent {
        return NoteEvent(
                run, event.location, text, if (keepId) event.id else 0, parseDateFromIsoString(event.timestamp)
        )
    }
}

data class CreateNoteEventTO(
        val location: String,
        val text: String
) {
    fun validate() {
        validateEmptyLocation(location)
        if (text.isEmpty()) {
            throw ValidationException(ErrorMessages.NO_TEXT)
        }
    }
}