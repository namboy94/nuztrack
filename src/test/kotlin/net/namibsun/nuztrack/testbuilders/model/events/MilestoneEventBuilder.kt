package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder

class MilestoneEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var milestone: String = "String"
) {
    fun build() = MilestoneEvent(nuzlockeRun, location, milestone)
}