package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.Event
import net.namibsun.nuztrack.util.formatDateToIsoString


data class EventTO(val id: Long, val runId: Long, val timeStamp: String, val location: String) {
    companion object {
        fun fromEvent(event: Event): EventTO {
            return EventTO(
                    event.id,
                    event.nuzlockeRun.id,
                    formatDateToIsoString(event.timestamp),
                    event.location
            )
        }
    }
}
