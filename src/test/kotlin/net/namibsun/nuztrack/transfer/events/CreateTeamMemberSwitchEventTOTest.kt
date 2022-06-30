package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TEAM_MEMBER
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.data.events.DeathEvent
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateTeamMemberSwitchEventTOTest {

    private val teamMemberService: TeamMemberService = mock()
    private val run = NuzlockeRun(1000, "User", "Name", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)
    private val memberOne = TeamMember(
            1, "Squirtle", 7, 5, Gender.MALE, Natures.NAUGHTY, 1, EncounterEvent(run, "A", 7, 5, true),
            teamSwitches = mutableListOf(TeamMemberSwitchEvent(run, "", TEAM_MEMBER, TeamMemberSwitchType.ADD))
    )
    private val memberTwo = TeamMember(
            2, "Charmander", 4, 5, Gender.FEMALE, Natures.NAUGHTY, 1, EncounterEvent(run, "B", 4, 5, true),
            death = DeathEvent(run, "B", TEAM_MEMBER, 1, "O", "D")
    )
    private val memberThree = TeamMember(
            3, "Eevee", 133, 5, Gender.FEMALE, Natures.NAUGHTY, 1, EncounterEvent(run, "B", 133, 5, true),
            teamSwitches = mutableListOf()
    )

    @Test
    fun validate() {
        defaultMocks()
        assertDoesNotThrow {
            CreateTeamMemberSwitchEventTO("Location", memberOne.id, "REMOVE").validate(run, teamMemberService)
            CreateTeamMemberSwitchEventTO("Location", memberThree.id, "ADD").validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_emptyLocation() {
        defaultMocks()

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("", memberOne.id, "REMOVE").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_teamMemberDoesNotExist() {
        defaultMocks()

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", 1000, "REMOVE").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_teamMemberAlreadyDead() {
        defaultMocks()

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberTwo.id, "ADD").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.TEAM_MEMBER_IS_DEAD.message)
    }

    @Test
    fun validate_otherRunPokemon() {
        defaultMocks()
        val otherRun = NuzlockeRun(0, "A", "A", Games.RED, listOf(), listOf(), RunStatus.ACTIVE)

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberOne.id, "REMOVE").validate(otherRun, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_PartyIsFull() {
        defaultMocks()
        whenever(teamMemberService.getTeam(run.id)).thenReturn(
                Triple(listOf(memberOne, memberOne, memberOne, memberOne, memberOne, memberOne), listOf(), listOf())
        )

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberThree.id, "ADD").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.PARTY_FULL.message)
        assertDoesNotThrow {
            CreateTeamMemberSwitchEventTO("Location", memberOne.id, "REMOVE").validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_lastMemberInTeam() {
        defaultMocks()
        whenever(teamMemberService.getTeam(run.id)).thenReturn(
                Triple(listOf(memberOne), listOf(), listOf())
        )

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberOne.id, "REMOVE").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LAST_MEMBER_IN_PARTY.message)
        assertDoesNotThrow {
            CreateTeamMemberSwitchEventTO("Location", memberThree.id, "ADD").validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_alreadyInTeam() {
        defaultMocks()

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberOne.id, "ADD").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.ALREADY_IN_PARTY.message)
    }

    @Test
    fun validate_alreadyOutsideOfTeam() {
        defaultMocks()

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberThree.id, "REMOVE").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.ALREADY_NOT_IN_PARTY.message)
    }

    @Test
    fun validate_invalidSwitchType() {
        defaultMocks()

        Assertions.assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", memberOne.id, "N/A").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER_SWITCH_TYPE.message)
    }

    private fun defaultMocks() {
        whenever(teamMemberService.getTeam(run.id)).thenReturn(
                Triple(listOf(memberOne, memberOne), listOf(), listOf())
        )
        whenever(teamMemberService.getTeamMember(run.id, memberOne.id)).thenReturn(memberOne)
        whenever(teamMemberService.getTeamMember(run.id, memberTwo.id)).thenReturn(memberTwo)
        whenever(teamMemberService.getTeamMember(run.id, memberThree.id)).thenReturn(memberThree)
    }
}
