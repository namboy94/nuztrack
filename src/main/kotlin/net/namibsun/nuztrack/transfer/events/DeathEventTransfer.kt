package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.DeathEvent

data class DeathEventTO(
        val event: EventTO,
        val teamMemberId: Long,
        val level: Int,
        val opponent: String,
        val description: String
) {
    companion object {
        fun fromDeathEvent(event: DeathEvent): DeathEventTO {
            return DeathEventTO(
                    EventTO.fromEvent(event),
                    event.teamMember.id,
                    event.level,
                    event.opponent,
                    event.description
            )
        }
    }
}