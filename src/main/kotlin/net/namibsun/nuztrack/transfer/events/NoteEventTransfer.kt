package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.events.NoteEvent
import net.namibsun.nuztrack.util.validateEmptyLocation

data class NoteEventTO(val event: EventTO, val text: String) {
    companion object {
        fun fromNoteEvent(event: NoteEvent): NoteEventTO {
            return NoteEventTO(EventTO.fromEvent(event), event.text)
        }
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