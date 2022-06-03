package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.Games
import net.namibsun.nuztrack.constants.Rules
import net.namibsun.nuztrack.constants.RunStatus
import net.namibsun.nuztrack.data.NuzlockeRun
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class NuzlockeRunTOTest {
    @Test
    fun testConverting() {
        val run = NuzlockeRun(
                100, "A", "B", Games.RED, listOf(Rules.DEATH), listOf("TEST"), RunStatus.ACTIVE
        )
        val converted = NuzlockeRunTO.fromNuzlockeRun(run)
        assertThat(converted.id).isEqualTo(run.id)
        assertThat(converted.userName).isEqualTo(run.userName)
        assertThat(converted.name).isEqualTo(run.name)
        assertThat(Games.valueOfWithChecks(converted.game)).isEqualTo(run.game)
        assertThat(converted.rules.map { Rules.valueOfWithChecks(it) }).isEqualTo(run.rules)
        assertThat(converted.customRules).isEqualTo(run.customRules)
        assertThat(RunStatus.valueOfWithChecks(converted.status)).isEqualTo(run.status)
    }
}
