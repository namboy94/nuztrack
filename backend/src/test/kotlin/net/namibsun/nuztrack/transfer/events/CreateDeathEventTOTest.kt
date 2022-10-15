package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.DeathEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateDeathEventTOTest {

    private val teamMemberService: TeamMemberService = mock()
    private val run = NuzlockeRunBuilder().build()
    private val memberOne = TeamMemberBuilder().id(1).nickname("A").build()
    private val memberTwo = TeamMemberBuilder().id(2).nickname("B").death(DeathEventBuilder().build()).build()
    private val team = Triple(listOf(memberOne), listOf<TeamMember>(), listOf(memberTwo))
    private var builder = DeathEventBuilder()

    @BeforeEach
    fun defaultMocks() {
        builder = DeathEventBuilder().teamMember(memberOne).nuzlockeRun(run)
        whenever(teamMemberService.getTeamMember(run.id, memberOne.id)).thenReturn(memberOne)
        whenever(teamMemberService.getTeamMember(run.id, memberTwo.id)).thenReturn(memberTwo)
        whenever(teamMemberService.getTeam(run.id)).thenReturn(team)
    }

    @Test
    fun validate() {
        assertDoesNotThrow { builder.buildCreatorTO().validate(run, teamMemberService) }
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
            val teamMember = TeamMemberBuilder().id(1000).build()
            builder.teamMember(teamMember).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_teamMemberAlreadyDead() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(memberTwo).level(memberTwo.level).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.TEAM_MEMBER_IS_DEAD.message)
    }

    @Test
    fun validate_otherRunPokemon() {
        val otherRun = NuzlockeRunBuilder().id(1000).build()

        assertThat(assertThrows<ValidationException> {
            builder.buildCreatorTO().validate(otherRun, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_emptyDescription() {
        assertThat(assertThrows<ValidationException> {
            builder.description("").buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_DESCRIPTION.message)
    }

    @Test
    fun validate_emptyOpponent() {
        assertThat(assertThrows<ValidationException> {
            builder.opponent("").buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.MISSING_OPPONENT.message)
    }

    @Test
    fun validate_level() {
        assertThat(assertThrows<ValidationException> {
            builder.level(0).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            builder.level(101).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            builder.level(memberOne.level - 1).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_BELOW_CURRENT.message)
    }

    @Test
    fun validate_NotInActiveParty() {
        whenever(teamMemberService.getTeam(run.id)).thenReturn(Triple(listOf(), listOf(), listOf(memberTwo)))

        assertThat(assertThrows<ValidationException> {
            builder.buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.NOT_IN_PARTY.message)
    }
}