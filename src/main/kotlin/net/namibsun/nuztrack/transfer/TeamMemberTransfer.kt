package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.data.TeamMember

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
        val encounterId: Long,
        val deathId: Long?,
        val evolutionIds: List<Long>,
        val teamSwitchIds: List<Long>
) {
    companion object {
        fun fromTeamMember(teamMember: TeamMember): TeamMemberTO {
            return TeamMemberTO(
                    teamMember.id,
                    teamMember.nickname,
                    teamMember.pokedexNumber,
                    teamMember.level,
                    teamMember.gender?.name,
                    teamMember.nature?.name,
                    teamMember.abilitySlot,
                    teamMember.encounter.id,
                    teamMember.death?.id,
                    teamMember.evolutions.map { it.id },
                    teamMember.teamSwitches.map { it.id }
            )
        }
    }
}