package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.EvolutionEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.transfer.events.CreateEvolutionEventTO
import net.namibsun.nuztrack.transfer.events.EvolutionEventTO

data class EvolutionEventBuilder(var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
                                 var location: String = "Pallet Town",
                                 var teamMember: TeamMember = TeamMemberBuilder().build(), var level: Int = 16,
                                 var previousPokedexNumber: Int = 7, var newPokedexNumber: Int = 8) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun teamMember(teamMember: TeamMember) = apply { this.teamMember = teamMember }
    fun level(level: Int) = apply { this.level = level }
    fun previousPokedexNumber(previousPokedexNumber: Int) = apply { this.previousPokedexNumber = previousPokedexNumber }
    fun newPokedexNumber(newPokedexNumber: Int) = apply { this.newPokedexNumber = newPokedexNumber }
    fun build() = EvolutionEvent(nuzlockeRun, location, teamMember, level, previousPokedexNumber, newPokedexNumber)
    fun buildCreatorTO() = CreateEvolutionEventTO(location, this.build().teamMember.id, level, newPokedexNumber)
    fun buildTO() = EvolutionEventTO.fromEvolutionEvent(this.build())
}
