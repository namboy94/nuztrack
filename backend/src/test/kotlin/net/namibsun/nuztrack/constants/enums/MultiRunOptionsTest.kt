package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.constants.ValidationException
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class MultiRunOptionsTest {

    @Test
    fun getValueOfRMultiRunOptionKey_success() {
        Assertions.assertThat(MultiRunOptions.valueOfWithChecks(MultiRunOptions.RESET_SPECIES.name.lowercase()))
                .isEqualTo(MultiRunOptions.RESET_SPECIES)
        Assertions.assertThat(MultiRunOptions.valueOfWithChecks(MultiRunOptions.RESET_LEVELS.name.uppercase()))
                .isEqualTo(MultiRunOptions.RESET_LEVELS)
    }

    @Test
    fun getValueOfRuleKey_invalid() {
        Assertions.assertThat(assertThrows<ValidationException> {
            MultiRunOptions.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_MULTI_RUN_OPTION.message)
        Assertions.assertThat(assertThrows<ValidationException> {
            MultiRunOptions.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_MULTI_RUN_OPTION.message)
        Assertions.assertThat(assertThrows<ValidationException> {
            MultiRunOptions.valueOfWithChecks(null)
        }.message).isEqualTo(ErrorMessages.INVALID_MULTI_RUN_OPTION.message)
    }
}