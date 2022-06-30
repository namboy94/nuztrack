package net.namibsun.nuztrack.testbuilders

import TeamMemberBuilder
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.EvolutionEvent

data class EvolutionEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var teamMember: TeamMember = TeamMemberBuilder().build(),
        var level: Int = 16,
        val previousPokedexNumber: Int = 7,
        val newPokedexNumber: Int = 8
) {
    fun teamMember(teamMember: TeamMember) = apply { this.teamMember = teamMember }
    fun build() = EvolutionEvent(nuzlockeRun, location, teamMember, level, previousPokedexNumber, newPokedexNumber)
}
