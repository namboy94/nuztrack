package net.namibsun.nuztrack.testbuilders

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.EncounterEvent

data class EncounterEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var pokedexNumber: Int = 7,
        var level: Int = 5,
        var caught: Boolean = false,
        var teamMember: TeamMember? = null
) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun pokedexNumber(pokedexNumber: Int) = apply { this.pokedexNumber = pokedexNumber }
    fun level(level: Int) = apply { this.level = level }
    fun caught(caught: Boolean) = apply { this.caught = caught }
    fun teamMember(teamMember: TeamMember?) = apply { this.teamMember = teamMember }

    fun build(): EncounterEvent {
        val encounter = EncounterEvent(nuzlockeRun, location, pokedexNumber, level, caught, teamMember)
        if (teamMember != null) {
            teamMember!!.encounter = encounter
        }
        return encounter
    }
}
