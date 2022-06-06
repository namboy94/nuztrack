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

internal class CreateEvolutionEventTOTest {

    private val teamMemberService: TeamMemberService = mock()
    private val run = NuzlockeRun(1000, "User", "Name", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)
    private val memberOne = TeamMember(
            1, "Squirtle", 7, 5, Natures.NAUGHTY, 1, EncounterEvent(run, "A", 7, 5, Gender.MALE, true)
    )
    private val memberTwo = TeamMember(
            2, "Charmander", 4, 5, Natures.NAUGHTY, 1, EncounterEvent(run, "B", 4, 5, Gender.FEMALE, true),
            death = DeathEvent(run, "B", TEAM_MEMBER, 1, "O", "D")
    )
    private val memberThree = TeamMember(
            3, "Eevee", 133, 5, Natures.NAUGHTY, 1, EncounterEvent(run, "B", 133, 5, Gender.FEMALE, true)
    )

    @Test
    fun validate() {
        defaultMocks()
        assertDoesNotThrow { CreateEvolutionEventTO("Location", memberOne.id, 5, 8).validate(run, teamMemberService) }
    }

    @Test
    fun validate_emptyLocation() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("", memberOne.id, 5, 8).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_teamMemberDoesNotExist() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", 1000, 5, 8).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_teamMemberAlreadyDead() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberTwo.id, 5, 5).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.TEAM_MEMBER_IS_DEAD.message)
    }

    @Test
    fun validate_otherRunPokemon() {
        defaultMocks()
        val otherRun = NuzlockeRun(0, "A", "A", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)

        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, 5, 8).validate(otherRun, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_level() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, 0, 8).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, 101, 8).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, memberOne.level - 1, 8).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_BELOW_CURRENT.message)
    }

    @Test
    fun validate_CorrectEvolutionSpecies() {
        defaultMocks()

        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, 5, 6).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_EVOLUTION_TARGET.message)
        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, 5, 7).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_EVOLUTION_TARGET.message)
        assertThat(assertThrows<ValidationException> {
            CreateEvolutionEventTO("Location", memberOne.id, 5, 9).validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_EVOLUTION_TARGET.message)
    }

    @Test
    fun validate_AllowMultipleTargetEvolutionsForAppropriateSpecies() {
        defaultMocks()
        for (eeveelution in listOf(135, 196, 471, 700)) {
            assertDoesNotThrow {
                CreateEvolutionEventTO("Location", memberThree.id, 5, eeveelution).validate(run, teamMemberService)
            }
        }
    }

    private fun defaultMocks() {
        whenever(teamMemberService.getTeamMember(run.id, memberOne.id)).thenReturn(memberOne)
        whenever(teamMemberService.getTeamMember(run.id, memberTwo.id)).thenReturn(memberTwo)
        whenever(teamMemberService.getTeamMember(run.id, memberThree.id)).thenReturn(memberThree)
    }
}