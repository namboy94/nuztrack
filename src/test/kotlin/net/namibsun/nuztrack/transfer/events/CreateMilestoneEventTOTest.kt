package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.RunStatus
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.MilestoneEvent
import net.namibsun.nuztrack.data.events.MilestoneEventService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateMilestoneEventTOTest {

    private val service: MilestoneEventService = mock()
    private val run = NuzlockeRun(50, "", "", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)

    @Test
    fun validate() {
        defaultMocks()
        assertDoesNotThrow { CreateMilestoneEventTO("Cerulean City", "Cascade Badge").validate(run, service) }
    }

    @Test
    fun validate_emptyLocation() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateMilestoneEventTO("", "Cascade Badge").validate(run, service)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_milestoneAlreadyReached() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateMilestoneEventTO("Pewter City", "Boulder Badge").validate(run, service)
        }.message).isEqualTo(ErrorMessages.MILESTONE_ALREADY_REACHED.message)
    }

    @Test
    fun validate_invalidLocation() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateMilestoneEventTO("Vermillion City", "Cascade Badge").validate(run, service)
        }.message).isEqualTo(ErrorMessages.MILESTONE_IN_WRONG_LOCATION.message)
    }

    @Test
    fun validate_invalidMilestone() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateMilestoneEventTO("Violet City", "Zephyr Badge").validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_MILESTONE.message)
    }

    private fun defaultMocks() {
        whenever(service.getMilestoneEvents(run.id)).thenReturn(listOf(
                MilestoneEvent(run, "Pewter City", "Boulder Badge")
        ))
    }
}