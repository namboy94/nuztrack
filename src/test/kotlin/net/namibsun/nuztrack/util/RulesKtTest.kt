package net.namibsun.nuztrack.util

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class RulesKtTest {

    @Test
    fun testGetDefaultRules() {
        assertThat(getDefaultRules()).hasSameElementsAs(listOf(
                Rules.DEATH, Rules.ONLY_FIRST_ENCOUNTER, Rules.MUST_NICKNAME
        ))
    }
}