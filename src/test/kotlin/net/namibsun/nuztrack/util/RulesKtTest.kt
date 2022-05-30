package net.namibsun.nuztrack.util

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class RulesKtTest {

    @Test
    fun testGetDefaultRules() {
        assertThat(getDefaultRules()).hasSameElementsAs(listOf(
                Rules.DEATH, Rules.ONLY_FIRST_ENCOUNTER, Rules.MUST_NICKNAME
        ))
    }

    @Test
    fun getValueOfRuleKey_success() {
        assertThat(getValueOfRuleKey(Rules.DEATH.name.lowercase())).isEqualTo(Rules.DEATH)
        assertThat(getValueOfRuleKey(Rules.DUPLICATE_CLAUSE.name.lowercase())).isEqualTo(Rules.DUPLICATE_CLAUSE)
    }

    @Test
    fun getValueOfRuleKey_invalid() {
        assertThat(assertThrows<ValidationException> {
            getValueOfRuleKey("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_RULE.message)
        assertThat(assertThrows<ValidationException> {
            getValueOfRuleKey("")
        }.message).isEqualTo(ErrorMessages.INVALID_RULE.message)
    }
}