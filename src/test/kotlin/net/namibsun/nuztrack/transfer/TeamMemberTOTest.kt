package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EvolutionEvent
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test

internal class TeamMemberTOTest {
    @Test
    fun testConverting() {
        val run = NuzlockeRun(
                100, "A", "B", Games.RED, listOf(Rules.DEATH), listOf("TEST"), RunStatus.ACTIVE
        )
        val encounter = EncounterEvent(run, "A", 1, 1, true)
        val dummyMember = TeamMember(1, "Bob", 1, 1, Gender.MALE, Natures.BOLD, 1, encounter)
        val evolution = EvolutionEvent(run, "B", dummyMember, 1, 1, 2)
        val member = TeamMember(
                1, "Bob", 1, 1, Gender.MALE, Natures.BOLD, 1, encounter, null, listOf(evolution), listOf()
        )

        val converted = TeamMemberTO.fromTeamMember(member)
        Assertions.assertThat(converted.id).isEqualTo(member.id)
        Assertions.assertThat(converted.nickname).isEqualTo(member.nickname)
        Assertions.assertThat(converted.encounterId).isEqualTo(encounter.id)
        Assertions.assertThat(converted.deathId).isEqualTo(null)
        Assertions.assertThat(converted.evolutionIds).isEqualTo(listOf(evolution.id))
        Assertions.assertThat(converted.teamSwitchIds).isEqualTo(listOf<Long>())
    }
}
