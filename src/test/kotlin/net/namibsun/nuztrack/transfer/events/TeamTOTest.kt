package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.transfer.TeamMemberTO
import net.namibsun.nuztrack.transfer.TeamTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class TeamTOTest {

    @Test
    fun fromTeam() {
        val team = Triple(
                listOf(TeamMemberBuilder().pokedexNumber(1).build()),
                listOf(TeamMemberBuilder().pokedexNumber(2).build()),
                listOf(TeamMemberBuilder().pokedexNumber(3).build())
        )
        val converted = TeamTO.fromTeam(team)

        assertThat(converted.active).isEqualTo(team.first.map { TeamMemberTO.fromTeamMember(it) })
        assertThat(converted.boxed).isEqualTo(team.second.map { TeamMemberTO.fromTeamMember(it) })
        assertThat(converted.dead).isEqualTo(team.third.map { TeamMemberTO.fromTeamMember(it) })
    }

}