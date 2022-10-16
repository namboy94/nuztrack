package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.util.getSpriteForGameAndPokemon

data class TeamTO(val active: List<TeamMemberTO>, val boxed: List<TeamMemberTO>, val dead: List<TeamMemberTO>) {
    companion object {
        fun fromTeam(team: Triple<List<TeamMember>, List<TeamMember>, List<TeamMember>>): TeamTO {
            val (active, boxed, dead) = team
            return TeamTO(
                    active = active.map { TeamMemberTO.fromTeamMember(it) },
                    boxed = boxed.map { TeamMemberTO.fromTeamMember(it) },
                    dead = dead.map { TeamMemberTO.fromTeamMember(it) }
            )
        }
    }
}

data class TeamMemberTO(
        val id: Long,
        val nickname: String,
        val pokedexNumber: Int,
        val level: Int,
        val gender: String?,
        val nature: String?,
        val abilitySlot: Int?,
        val sprite: String,
        val encounterId: Long,
        val deathId: Long?,
        val evolutionIds: List<Long>,
        val teamSwitchIds: List<Long>
) {
    companion object {
        fun fromTeamMember(teamMember: TeamMember): TeamMemberTO {
            val game = teamMember.encounter.nuzlockeRun.game
            val species = Pokedex.getPokemon(teamMember.pokedexNumber)
            return TeamMemberTO(
                    teamMember.id,
                    teamMember.nickname,
                    teamMember.pokedexNumber,
                    teamMember.level,
                    teamMember.gender?.name,
                    teamMember.nature?.name,
                    teamMember.abilitySlot,
                    getSpriteForGameAndPokemon(species, game, false), // TODO shiny
                    teamMember.encounter.id,
                    teamMember.death?.id,
                    teamMember.evolutions.map { it.id },
                    teamMember.teamSwitches.map { it.id }
            )
        }
    }

    fun toTeamMember(encounter: EncounterEvent, keepId: Boolean = false): TeamMember {
        return TeamMember(
                if (keepId) id else 0,
                nickname,
                pokedexNumber,
                level,
                Gender.valueOfWithChecks(gender),
                Natures.valueOfWithChecks(nature),
                abilitySlot,
                encounter
        )
    }
}