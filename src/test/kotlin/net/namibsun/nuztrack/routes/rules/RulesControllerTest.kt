package net.namibsun.nuztrack.routes.rules

import net.namibsun.nuztrack.constants.Rules
import net.namibsun.nuztrack.constants.getDefaultRules
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class RulesControllerTest {

    private val controller = RulesController()

    @Test
    fun getRules() {
        val result = controller.getRules().body!!
        assertThat(result.defaultRules).hasSameElementsAs(getDefaultRules().map { it.name.uppercase() })
        assertThat(result.rules).hasSameSizeAs(Rules.values())
    }
}