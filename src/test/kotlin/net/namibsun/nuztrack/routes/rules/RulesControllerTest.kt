package net.namibsun.nuztrack.routes.rules

import net.namibsun.nuztrack.constants.Rules
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class RulesControllerTest {

    private val controller = RulesController()

    @Test
    fun getRules() {
        val result = controller.getRules().body!!
        assertThat(result.defaultRules).hasSameElementsAs(Rules.defaultRules().map { it.name.uppercase() })
        assertThat(result.rules).hasSameSizeAs(Rules.values())
    }
}