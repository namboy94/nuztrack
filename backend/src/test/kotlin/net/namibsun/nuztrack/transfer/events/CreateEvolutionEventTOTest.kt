package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EvolutionEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateEvolutionEventTOTest {

    private val teamMemberService: TeamMemberService = mock()
    private val run = NuzlockeRunBuilder().build()
    private val squirtle = TeamMemberBuilder().id(1).build()
    private var builder = EvolutionEventBuilder()

    @BeforeEach
    private fun setUp() {
        this.builder = EvolutionEventBuilder().nuzlockeRun(run).teamMember(squirtle).newPokedexNumber(8)
        whenever(teamMemberService.getTeamMember(run.id, squirtle.id)).thenReturn(squirtle)
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
            val doesNotExist = TeamMemberBuilder().id(1000).build()
            builder.teamMember(doesNotExist).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_TEAM_MEMBER.message)
    }

    @Test
    fun validate_teamMemberAlreadyDead() {
        val charizard = TeamMemberBuilder().id(2).isCharizard().isDead().build()
        whenever(teamMemberService.getTeamMember(run.id, charizard.id)).thenReturn(charizard)

        assertThat(assertThrows<ValidationException> {
            builder.teamMember(charizard).buildCreatorTO().validate(run, teamMemberService)
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
    fun validate_level() {
        assertThat(assertThrows<ValidationException> {
            builder.level(0).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            builder.level(101).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            builder.level(builder.teamMember.level - 1).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.LEVEL_BELOW_CURRENT.message)
    }

    @Test
    fun validate_CorrectEvolutionSpecies() {
        assertThat(assertThrows<ValidationException> {
            builder.newPokedexNumber(6).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_EVOLUTION_TARGET.message)
        assertThat(assertThrows<ValidationException> {
            builder.newPokedexNumber(7).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_EVOLUTION_TARGET.message)
        assertThat(assertThrows<ValidationException> {
            builder.newPokedexNumber(9).buildCreatorTO().validate(run, teamMemberService)
        }.message).isEqualTo(ErrorMessages.INVALID_EVOLUTION_TARGET.message)
    }

    @Test
    fun validate_AllowMultipleTargetEvolutionsForAppropriateSpecies() {
        val eevee = TeamMemberBuilder().id(2).isEevee().build()
        whenever(teamMemberService.getTeamMember(run.id, eevee.id)).thenReturn(eevee)

        for (eeveelution in listOf(135, 196, 471, 700)) {
            assertDoesNotThrow {
                builder.teamMember(eevee).newPokedexNumber(eeveelution).buildCreatorTO()
                        .validate(run, teamMemberService)
            }
        }
    }
}