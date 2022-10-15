package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.TeamMemberSwitchEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateTeamMemberSwitchEventTOTest {

    private val teamMemberService: TeamMemberService = mock()
    private val run = NuzlockeRunBuilder().build()
    private val activeOne = TeamMemberBuilder().id(1).isActive().build()
    private val activeTwo = TeamMemberBuilder().id(2).isEevee().isActive().build()
    private val boxed = TeamMemberBuilder().id(3).isBulbasaur().build()
    private val dead = TeamMemberBuilder().id(4).isCharizard().isDead().build()
    private val team = Triple(listOf(activeOne, activeTwo), listOf(boxed), listOf(dead))
    private var builder = TeamMemberSwitchEventBuilder()

    @BeforeEach
    fun setUp() {
        this.builder = TeamMemberSwitchEventBuilder().nuzlockeRun(run).teamMember(activeOne).isRemove()
        whenever(teamMemberService.getTeam(run.id)).thenReturn(team)
        whenever(teamMemberService.getTeamMember(run.id, activeOne.id)).thenReturn(activeOne)
        whenever(teamMemberService.getTeamMember(run.id, activeTwo.id)).thenReturn(activeTwo)
        whenever(teamMemberService.getTeamMember(run.id, boxed.id)).thenReturn(boxed)
        whenever(teamMemberService.getTeamMember(run.id, dead.id)).thenReturn(dead)
    }

    @Test
    fun validate() {
        assertDoesNotThrow {
            builder.teamMember(activeOne).isRemove().buildCreatorTO().validate(run, teamMemberService)
            builder.teamMember(boxed).isAdd().buildCreatorTO().validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_emptyLocation() {
        assertThat(assertThrows<ValidationException> {
            builder.location("").buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_teamMemberDoesNotExist() {
        assertThat(assertThrows<ValidationException> {
            val doesNotExist = TeamMemberBuilder().id(1000).build()
            builder.teamMember(doesNotExist).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_teamMemberAlreadyDead() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(dead).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.TEAM_MEMBER_IS_DEAD.message)
    }

    @Test
    fun validate_otherRunPokemon() {
        val otherRun = NuzlockeRunBuilder().id(run.id + 1).build()

        assertThat(assertThrows<ValidationException> {
            builder.buildCreatorTO().validate(otherRun, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_PartyIsFull() {
        whenever(teamMemberService.getTeam(run.id)).thenReturn(
                Triple(listOf(activeOne, activeTwo, activeTwo, activeTwo, activeTwo, activeTwo), listOf(), listOf()))

        assertThat(assertThrows<ValidationException> {
            builder.teamMember(boxed).isAdd().buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.PARTY_FULL.message)
        assertDoesNotThrow {
            builder.teamMember(activeOne).isRemove().buildCreatorTO().validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_lastMemberInTeam() {
        whenever(teamMemberService.getTeam(run.id)).thenReturn(Triple(listOf(activeOne), listOf(), listOf()))

        assertThat(assertThrows<ValidationException> {
            builder.teamMember(activeOne).isRemove().buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LAST_MEMBER_IN_PARTY.message)
        assertDoesNotThrow {
            builder.teamMember(boxed).isAdd().buildCreatorTO().validate(run, teamMemberService)
        }
    }

    @Test
    fun validate_alreadyInTeam() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(activeTwo).isAdd().buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.ALREADY_IN_PARTY.message)
    }

    @Test
    fun validate_alreadyOutsideOfTeam() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(boxed).isRemove().buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.ALREADY_NOT_IN_PARTY.message)
    }

    @Test
    fun validate_invalidSwitchType() {
        assertThat(assertThrows<ValidationException> {
            CreateTeamMemberSwitchEventTO("Location", activeOne.id, "N/A").validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER_SWITCH_TYPE.message)
    }

}
