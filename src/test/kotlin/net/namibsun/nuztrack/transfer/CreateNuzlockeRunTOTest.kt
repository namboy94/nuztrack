package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertDoesNotThrow
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class CreateNuzlockeRunTOTest {

    @Test
    fun validate_success() {
        assertDoesNotThrow { CreateNuzlockeRunTO("Test", Games.RED.name, listOf(), listOf()).validate() }
    }

    @Test
    fun validate_emptyName() {
        assertThat(assertThrows<ValidationException> {
            CreateNuzlockeRunTO("", Games.RED.name, listOf(), listOf()).validate()
        }.message).isEqualTo(ErrorMessages.EMPTY_NAME.message)
    }

    @Test
    fun validate_invalidRules() {
        assertThat(assertThrows<ValidationException> {
            CreateNuzlockeRunTO("Test", Games.RED.name, listOf("DoesNotExist"), listOf()).validate()
        }.message).isEqualTo(ErrorMessages.INVALID_RULE.message)
    }

    @Test
    fun validate_invalidGame() {
        assertThat(assertThrows<ValidationException> {
            CreateNuzlockeRunTO("Test", "DoesNotExist", listOf(), listOf()).validate()
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
    }

}