package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.Games
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class GameLocationTOTest {
    @Test
    fun fromGameLocationFileTO() {
        val milestone = MilestoneTO("A", "B", 1, "C")
        val fileTO = GameLocationFileTO("A", Games.ALPHA_SAPPHIRE.name, listOf(1, 2, 3), listOf(milestone))
        val converted = GameLocationTO.fromGameLocationFileTO(fileTO)
        assertThat(converted.game).isEqualTo(GameTO.fromGame(Games.ALPHA_SAPPHIRE))
        assertThat(converted.name).isEqualTo("A")
        assertThat(converted.encounters).isEqualTo(listOf(1, 2, 3))
        assertThat(converted.milestones).isEqualTo(listOf(milestone))
    }
}