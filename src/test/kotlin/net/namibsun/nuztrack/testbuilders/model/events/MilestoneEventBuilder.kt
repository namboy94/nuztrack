package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.transfer.events.CreateMilestoneEventTO
import net.namibsun.nuztrack.transfer.events.MilestoneEventTO

class MilestoneEventBuilder(var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
                            var location: String = "Pallet Town", var milestone: String = "String") {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun milestone(milestone: String) = apply { this.milestone = milestone }
    fun build() = MilestoneEvent(nuzlockeRun, location, milestone)
    fun buildCreatorTO() = CreateMilestoneEventTO(location, milestone)
    fun buildTO() = MilestoneEventTO.fromMilestoneEvent(this.build())
}