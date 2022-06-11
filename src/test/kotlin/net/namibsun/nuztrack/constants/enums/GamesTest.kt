package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.constants.ValidationException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class GamesTest {

    @Test
    fun getValueOfGameTitle_success() {
        assertThat(Games.valueOfWithChecks(Games.RED.name.lowercase())).isEqualTo(Games.RED)
        assertThat(Games.valueOfWithChecks(Games.OMEGA_RUBY.name.uppercase())).isEqualTo(Games.OMEGA_RUBY)
    }

    @Test
    fun getValueOfGameTitle_invalid() {
        assertThat(assertThrows<ValidationException> {
            Games.valueOfWithChecks("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
        assertThat(assertThrows<ValidationException> {
            Games.valueOfWithChecks("")
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
        assertThat(assertThrows<ValidationException> {
            Games.valueOfWithChecks(null)
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
    }
}