package net.namibsun.nuztrack.util

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class GamesKtTest {

    @Test
    fun getValueOfGameTitle_success() {
        assertThat(getValueOfGameTitle(Games.RED.title)).isEqualTo(Games.RED)
        assertThat(getValueOfGameTitle(Games.LEGENDS_ARCEUS.title)).isEqualTo(Games.LEGENDS_ARCEUS)
    }

    @Test
    fun getValueOfGameTitle_invalid() {
        assertThat(assertThrows<ValidationException> {
            getValueOfGameTitle("NotExisting")
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
        assertThat(assertThrows<ValidationException> {
            getValueOfGameTitle("")
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
    }
}