package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.transfer.events.CreateDeathEventTO
import net.namibsun.nuztrack.transfer.events.DeathEventTO

data class DeathEventBuilder(var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
                             var location: String = "Pallet Town",
                             var teamMember: TeamMember = TeamMemberBuilder().build(), var level: Int = 24,
                             var opponent: String = "BLUE", var description: String = "Died to Alakazam's Psychic") {

    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun teamMember(teamMember: TeamMember) = apply { this.teamMember = teamMember }
    fun level(level: Int) = apply { this.level = level }
    fun opponent(opponent: String) = apply { this.opponent = opponent }
    fun description(description: String) = apply { this.description = description }
    fun build(): DeathEvent {
        val death = DeathEvent(nuzlockeRun, location, teamMember, level, opponent, description)
        teamMember.death = death
        return death
    }

    fun buildCreatorTO() = CreateDeathEventTO(location, teamMember.id, level, opponent, description)
    fun buildTO() = DeathEventTO.fromDeathEvent(this.build())
}
