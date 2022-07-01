package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder

class MilestoneEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var milestone: String = "String"
) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun milestone(milestone: String) = apply { this.milestone = milestone }
    fun build() = MilestoneEvent(nuzlockeRun, location, milestone)
}