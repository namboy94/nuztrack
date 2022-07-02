package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class NuzlockeRunTOTest {
    @Test
    fun testConverting() {
        val run = NuzlockeRunBuilder().build()
        val converted = NuzlockeRunTO.fromNuzlockeRun(run)
        assertThat(converted.id).isEqualTo(run.id)
        assertThat(converted.userName).isEqualTo(run.userName)
        assertThat(converted.name).isEqualTo(run.name)
        assertThat(converted.game.key).isEqualTo(run.game.name)
        assertThat(converted.rules).isEqualTo(run.rules.map { it.name.uppercase() })
        assertThat(converted.customRules).isEqualTo(run.customRules)
        assertThat(RunStatus.valueOfWithChecks(converted.status)).isEqualTo(run.status)
    }
}
