package net.namibsun.nuztrack.constants

import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Rules
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class RulesTest {

    @Test
    fun testGetDefaultRules() {
        assertThat(Rules.defaultRules()).hasSameElementsAs(listOf(
                Rules.DEATH, Rules.ONLY_FIRST_ENCOUNTER, Rules.MUST_NICKNAME
        ))
    }

    @Test
    fun getValueOfRuleKey_success() {
        assertThat(Rules.valueOfWithChecks(Rules.DEATH.name.lowercase())).isEqualTo(Rules.DEATH)
        assertThat(Rules.valueOfWithChecks(Rules.DUPLICATE_CLAUSE.name.uppercase())).isEqualTo(Rules.DUPLICATE_CLAUSE)
    }

    @Test
    fun getValueOfRuleKey_invalid() {
        assertThat(assertThrows<ValidationException> {
            Rules.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_RULE.message)
        assertThat(assertThrows<ValidationException> {
            Rules.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_RULE.message)
    }
}