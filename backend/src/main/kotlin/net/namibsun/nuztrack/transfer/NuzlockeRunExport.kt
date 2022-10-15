package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.transfer.events.EventLogTO

data class NuzlockeRunExportTO(
        val run: NuzlockeRunTO,
        val events: EventLogTO,
        val team: TeamTO
)
