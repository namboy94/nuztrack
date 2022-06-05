package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.constants.ValidationException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class GenderTest {

    @Test
    fun getValueOfGender_success() {
        assertThat(Gender.valueOfWithChecks(Gender.MALE.name.lowercase())).isEqualTo(Gender.MALE)
        assertThat(Gender.valueOfWithChecks(Gender.FEMALE.name.lowercase())).isEqualTo(Gender.FEMALE)
    }

    @Test
    fun getValueOfGenderTitle_invalid() {
        assertThat(assertThrows<ValidationException> {
            Gender.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_GENDER.message)
        assertThat(assertThrows<ValidationException> {
            Gender.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_GENDER.message)
        assertThat(assertThrows<ValidationException> {
            Gender.valueOfWithChecks(null)
        }.message).isEqualTo(ErrorMessages.INVALID_GENDER.message)
    }
}