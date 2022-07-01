package net.namibsun.nuztrack.testbuilders.model

import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EvolutionEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder

data class TeamMemberBuilder(
        private var id: Long = 1,
        private var nickname: String = "Bob",
        private var pokedexNumber: Int = 7,
        private var level: Int = 14,
        private var gender: Gender? = Gender.MALE,
        private var nature: Natures? = Natures.BASHFUL,
        private var abilitySlot: Int? = 1,
        private var encounter: EncounterEvent = EncounterEventBuilder().build(),
        private var death: DeathEvent? = null,
        private var evolutions: MutableList<EvolutionEvent> = mutableListOf(),
        private var teamSwitches: MutableList<TeamMemberSwitchEvent> = mutableListOf()

) {

    fun id(id: Long) = apply { this.id = id }
    fun nickname(nickname: String) = apply { this.nickname = nickname }
    fun pokedexNumber(pokedexNumber: Int) = apply { this.pokedexNumber = pokedexNumber }
    fun level(level: Int) = apply { this.level = level }
    fun gender(gender: Gender?) = apply { this.gender = gender }
    fun nature(nature: Natures?) = apply { this.nature = nature }
    fun abilitySlot(abilitySlot: Int?) = apply { this.abilitySlot = abilitySlot }
    fun encounter(encounter: EncounterEvent) = apply { this.encounter = encounter }
    fun death(death: DeathEvent?) = apply { this.death = death }
    fun evolutions(evolutions: MutableList<EvolutionEvent>) = apply { this.evolutions = evolutions }
    fun teamSwitches(teamSwitches: MutableList<TeamMemberSwitchEvent>) = apply { this.teamSwitches = teamSwitches }

    fun build(): TeamMember {
        val teamMember = TeamMember(
                id, nickname, pokedexNumber, level, gender, nature, abilitySlot,
                encounter, death, evolutions, teamSwitches
        )
        encounter.teamMember = teamMember
        if (death != null) {
            death!!.teamMember = teamMember
        }
        evolutions.map { it.teamMember = teamMember }
        teamSwitches.map { it.teamMember = teamMember }
        return teamMember
    }
}