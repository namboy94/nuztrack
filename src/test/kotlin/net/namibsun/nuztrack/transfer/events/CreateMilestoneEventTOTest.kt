package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.data.events.MilestoneEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.events.MilestoneEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateMilestoneEventTOTest {

    private val service: MilestoneEventService = mock()
    private val run = NuzlockeRunBuilder().build()
    private val existingMilestone = MilestoneEventBuilder().milestone("Boulder Badge").location("Pewter City").build()
    private var builder = MilestoneEventBuilder()

    @BeforeEach
    fun setUp() {
        this.builder = MilestoneEventBuilder().milestone("Cascade Badge").location("Cerulean City")
        whenever(service.getMilestoneEvents(run.id)).thenReturn(listOf(existingMilestone))
    }

    @Test
    fun validate() {
        assertDoesNotThrow { builder.buildCreatorTO().validate(run, service) }
    }

    @Test
    fun validate_emptyLocation() {
        assertThat(assertThrows<ValidationException> {
            builder.location("").buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_milestoneAlreadyReached() {
        assertThat(assertThrows<ValidationException> {
            builder.location(existingMilestone.location).milestone(existingMilestone.milestone).buildCreatorTO()
                    .validate(run, service)
        }.message).isEqualTo(ErrorMessages.MILESTONE_ALREADY_REACHED.message)
    }

    @Test
    fun validate_invalidLocation() {
        assertThat(assertThrows<ValidationException> {
            builder.location("Vermillion City").buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.MILESTONE_IN_WRONG_LOCATION.message)
    }

    @Test
    fun validate_invalidMilestoneForGame() {
        val goldRun = NuzlockeRunBuilder().id(2).game(Games.GOLD).build()

        val zephyrBuilder = builder.location("Violet City").milestone("Zephyr Badge")

        assertThat(assertThrows<ValidationException> {
            zephyrBuilder.buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_MILESTONE.message)
        assertDoesNotThrow { zephyrBuilder.buildCreatorTO().validate(goldRun, service) }
    }
}