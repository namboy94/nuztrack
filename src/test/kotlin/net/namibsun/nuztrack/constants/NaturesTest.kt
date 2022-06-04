package net.namibsun.nuztrack.constants

import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Natures
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class NaturesTest {

    @Test
    fun valuesLengthIsCorrect() {
        assertThat(Natures.values().size).isEqualTo(25)
    }

    @Test
    fun getValueOfGameTitle_success() {
        assertThat(Natures.valueOfWithChecks(Natures.ADAMANT.name.lowercase())).isEqualTo(Natures.ADAMANT)
        assertThat(Natures.valueOfWithChecks(Natures.MODEST.name.uppercase())).isEqualTo(Natures.MODEST)
    }

    @Test
    fun getValueOfGameTitle_invalid() {
        assertThat(org.junit.jupiter.api.assertThrows<ValidationException> {
            Natures.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
        assertThat(org.junit.jupiter.api.assertThrows<ValidationException> {
            Natures.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

}