package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.data.TeamMember

data class TeamTO(val active: List<TeamMemberTO>, val boxed: List<TeamMemberTO>, val dead: List<TeamMemberTO>)

data class TeamMemberTO(
        val id: Long,
        val nickname: String,
        val pokedexNumber: Int,
        val level: Int,
        val nature: String,
        val abilitySlot: Int,
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
                    teamMember.nature.name,
                    teamMember.abilitySlot,
                    teamMember.encounter.id,
                    teamMember.death?.id,
                    teamMember.evolutions.map { it.id },
                    teamMember.teamSwitches.map { it.id }
            )
        }
    }
}