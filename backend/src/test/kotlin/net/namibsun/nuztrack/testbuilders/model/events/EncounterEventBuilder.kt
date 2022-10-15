package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.transfer.events.CreateEncounterEventTO
import net.namibsun.nuztrack.transfer.events.CreateEncounterPokemonTO
import net.namibsun.nuztrack.transfer.events.EncounterEventTO
import java.util.*

data class EncounterEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var pokedexNumber: Int = 7, var level: Int = 5,
        var caught: Boolean = false,
        var teamMember: TeamMember? = null,
        var id: Long = 1,
        var timestamp: Date = Date()
) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun pokedexNumber(pokedexNumber: Int) = apply { this.pokedexNumber = pokedexNumber }
    fun level(level: Int) = apply { this.level = level }
    fun caught(caught: Boolean) = apply { this.caught = caught }
    fun teamMember(teamMember: TeamMember?) = apply { this.teamMember = teamMember }
    fun id(id: Long) = apply { this.id = id }
    fun timestamp(timestamp: Date) = apply { this.timestamp = timestamp }

    fun build(): EncounterEvent {
        val encounter = EncounterEvent(nuzlockeRun, location, pokedexNumber, level, caught, teamMember, id, timestamp)
        if (teamMember != null) {
            teamMember!!.encounter = encounter
        }
        return encounter
    }

    fun buildCreatorTO(): CreateEncounterEventTO {
        val teamMember = this.build().teamMember
        val pokemonCreator = if (teamMember == null) {
            null
        } else {
            CreateEncounterPokemonTO(teamMember.nickname, teamMember.gender?.name, teamMember.nature?.name,
                    teamMember.abilitySlot)
        }
        return CreateEncounterEventTO(location, pokedexNumber, level, caught, pokemonCreator)
    }

    fun buildTO() = EncounterEventTO.fromEncounterEvent(this.build())

    fun isBulbasaur() = apply {
        this.teamMember = TeamMemberBuilder().isBulbasaur().build()
        this.pokedexNumber = this.teamMember!!.pokedexNumber
    }
}
