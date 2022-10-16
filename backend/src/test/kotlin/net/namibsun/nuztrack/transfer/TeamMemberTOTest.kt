package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.DeathEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EvolutionEventBuilder
import net.namibsun.nuztrack.testbuilders.model.events.TeamMemberSwitchEventBuilder
import net.namibsun.nuztrack.util.getSpriteForGameAndPokemon
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class TeamMemberTOTest {
    @Test
    fun testConverting() {
        val member = TeamMemberBuilder().death(DeathEventBuilder().build())
                .evolutions(mutableListOf(EvolutionEventBuilder().build()))
                .teamSwitches(mutableListOf(TeamMemberSwitchEventBuilder().build())).build()
        val converted = TeamMemberTO.fromTeamMember(member)
        assertThat(converted.id).isEqualTo(member.id)
        assertThat(converted.nickname).isEqualTo(member.nickname)
        assertThat(converted.encounterId).isEqualTo(member.encounter.id)
        assertThat(converted.deathId).isEqualTo(member.death!!.id)
        assertThat(converted.evolutionIds).isEqualTo(member.evolutions.map { it.id })
        assertThat(converted.teamSwitchIds).isEqualTo(member.teamSwitches.map { it.id })
        assertThat(converted.sprite).isEqualTo(getSpriteForGameAndPokemon(
                Pokedex.getPokemon(member.pokedexNumber),
                member.encounter.nuzlockeRun.game,
                false
        ))
    }
}
