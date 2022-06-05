package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.NoteEvent

data class NoteEventTO(val event: EventTO, val text: String) {
    companion object {
        fun fromNoteEvent(event: NoteEvent): NoteEventTO {
            return NoteEventTO(EventTO.fromEvent(event), event.text)
        }
    }
}