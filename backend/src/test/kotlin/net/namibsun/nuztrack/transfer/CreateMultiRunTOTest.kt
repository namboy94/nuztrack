package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.transfer.CreateMultiRunTOBuilder
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

class CreateMultiRunTOTest {

    @Test
    fun validate_success() {
        assertDoesNotThrow { CreateMultiRunTOBuilder().build().validate(NuzlockeRunBuilder().build()) }
    }

    @Test
    fun validate_emptyName() {
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().name("").build().validate(NuzlockeRunBuilder().build())
        }.message).isEqualTo(ErrorMessages.EMPTY_NAME.message)
    }

    @Test
    fun validate_invalidOptions() {
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().options(listOf("DoesNotExist")).build().validate(NuzlockeRunBuilder().build())
        }.message).isEqualTo(ErrorMessages.INVALID_MULTI_RUN_OPTION.message)
    }

    @Test
    fun validate_invalidGame() {
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().game("DoesNotExist").build().validate(NuzlockeRunBuilder().build())
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
    }

    @Test
    fun validate_backwardsGeneration() {
        val run = NuzlockeRunBuilder().game(Games.FIRERED).build()
        org.assertj.core.api.Assertions.assertThat(assertThrows<ValidationException> {
            CreateMultiRunTOBuilder().game(Games.RED.name).build().validate(run)
        }.message).isEqualTo(ErrorMessages.MULTI_RUN_BACKWARDS.message)
    }
}