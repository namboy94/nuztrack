package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

internal class CreateNoteEventTOTest {

    @Test
    fun validate() {
        assertDoesNotThrow { CreateNoteEventTO("Location", "Text").validate() }
    }

    @Test
    fun validate_emptyText() {
        assertThat(assertThrows<ValidationException> {
            CreateNoteEventTO("Location", "").validate()
        }.message).isEqualTo(ErrorMessages.NO_TEXT.message)
    }

    @Test
    fun validate_emptyLocation() {
        assertThat(assertThrows<ValidationException> {
            CreateNoteEventTO("", "Text").validate()
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }
}