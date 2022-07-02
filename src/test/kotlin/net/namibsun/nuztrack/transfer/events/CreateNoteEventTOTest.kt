package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.testbuilders.model.events.NoteEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

internal class CreateNoteEventTOTest {

    @Test
    fun validate() {
        assertDoesNotThrow { NoteEventBuilder().buildCreatorTO().validate() }
    }

    @Test
    fun validate_emptyText() {
        assertThat(assertThrows<ValidationException> {
            NoteEventBuilder().text("").buildCreatorTO().validate()
        }.message).isEqualTo(ErrorMessages.NO_TEXT.message)
    }

    @Test
    fun validate_emptyLocation() {
        assertThat(assertThrows<ValidationException> {
            NoteEventBuilder().location("").buildCreatorTO().validate()
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }
}