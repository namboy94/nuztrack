package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.transfer.events.CreateMilestoneEventTO
import net.namibsun.nuztrack.transfer.events.MilestoneEventTO
import java.util.*

class MilestoneEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(), var location: String = "Pewter City",
        var milestone: String = "Boulder Badge", var id: Long = 1, var timestamp: Date = Date()
) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun milestone(milestone: String) = apply { this.milestone = milestone }
    fun id(id: Long) = apply { this.id = id }
    fun timestamp(timestamp: Date) = apply { this.timestamp = timestamp }

    fun build() = MilestoneEvent(nuzlockeRun, location, milestone, id, timestamp)
    fun buildCreatorTO() = CreateMilestoneEventTO(location, milestone)
    fun buildTO() = MilestoneEventTO.fromMilestoneEvent(this.build())
}