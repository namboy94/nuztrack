package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.testbuilders.transfer.CreateMultiRunTOBuilder
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

class CreateMultiRunTOTest {

    @Test
    fun validate_success() {
        assertDoesNotThrow { CreateMultiRunTOBuilder().build().validate() }
    }

    @Test
    fun validate_emptyName() {
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().name("").build().validate()
        }.message).isEqualTo(ErrorMessages.EMPTY_NAME.message)
    }

    @Test
    fun validate_invalidOptions() {
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().options(listOf("DoesNotExist")).build().validate()
        }.message).isEqualTo(ErrorMessages.INVALID_MULTI_RUN_OPTION.message)
    }

    @Test
    fun validate_invalidGame() {
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().game("DoesNotExist").build().validate()
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
    }
}