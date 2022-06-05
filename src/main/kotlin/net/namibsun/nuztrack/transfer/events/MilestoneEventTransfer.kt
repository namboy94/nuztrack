package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.MilestoneEvent

data class MilestoneEventTO(val event: EventTO, val milestone: String) {
    companion object {
        fun fromMilestoneEvent(event: MilestoneEvent): MilestoneEventTO {
            return MilestoneEventTO(EventTO.fromEvent(event), event.milestone)
        }
    }
}