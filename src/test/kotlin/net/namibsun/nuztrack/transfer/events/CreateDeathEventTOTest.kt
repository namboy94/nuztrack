package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TEAM_MEMBER
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateDeathEventTOTest {

    private val teamMemberService: TeamMemberService = mock()
    private val run = NuzlockeRun(1000, "User", "Name", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)
    private val memberOne = TeamMember(
            1, "A", 7, 5, Natures.NAUGHTY, 1, EncounterEvent(run, "A", 7, 5, Gender.MALE, true)
    )
    private val memberTwo = TeamMember(
            2, "B", 4, 5, Natures.NAUGHTY, 1, EncounterEvent(run, "B", 4, 5, Gender.FEMALE, true),
            death = DeathEvent(run, "B", TEAM_MEMBER, 1, "O", "D")
    )

    @Test
    fun validate() {
        defaultMocks()

        assertDoesNotThrow {
            CreateDeathEventTO("Location", memberOne.id, 5, "Opponent", "Description").validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_emptyLocation() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("", memberOne.id, 5, "Opponent", "Description").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_teamMemberDoesNotExist() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", 1000, 5, "Opponent", "Description").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_teamMemberAlreadyDead() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberTwo.id, 5, "Opponent", "Description").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.TEAM_MEMBER_IS_DEAD.message)
    }

    @Test
    fun validate_otherRunPokemon() {
        defaultMocks()
        val otherRun = NuzlockeRun(0, "A", "A", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberOne.id, 5, "O", "D").validate(otherRun, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_emptyDescription() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberOne.id, 5, "Opponent", "").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_DESCRIPTION.message)
    }

    @Test
    fun validate_emptyOpponent() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberOne.id, 5, "", "Description").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_OPPONENT.message)
    }

    @Test
    fun validate_level() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberOne.id, 0, "O", "D").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberOne.id, 101, "O", "D").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateDeathEventTO("Location", memberOne.id, memberOne.level - 1, "O", "D").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_BELOW_CURRENT.message)
    }

    private fun defaultMocks() {
        whenever(teamMemberService.getTeamMember(run.id, memberOne.id)).thenReturn(memberOne)
        whenever(teamMemberService.getTeamMember(run.id, memberTwo.id)).thenReturn(memberTwo)
    }

}