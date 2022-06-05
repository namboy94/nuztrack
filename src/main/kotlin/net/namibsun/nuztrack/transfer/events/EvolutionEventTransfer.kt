package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.data.events.EvolutionEvent

data class EvolutionEventTO(
        val event: EventTO,
        val teamMemberId: Long,
        val level: Int,
        val previousPokedexNumber: Int,
        val newPokedexNumber: Int
) {
    companion object {
        fun fromEvolutionEvent(event: EvolutionEvent): EvolutionEventTO {
            return EvolutionEventTO(
                    EventTO.fromEvent(event),
                    event.teamMember.id,
                    event.level,
                    event.previousPokedexNumber,
                    event.newPokedexNumber
            )
        }
    }
}