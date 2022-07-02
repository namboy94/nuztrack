package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.testbuilders.model.events.EncounterEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateEncounterEventTOTest {

    private val service: EncounterEventService = mock()
    private val oldRun = NuzlockeRunBuilder().id(2).game(Games.RED).build()
    private val run = NuzlockeRunBuilder().id(1).game(Games.X).build()
    private var builder = EncounterEventBuilder()
    private var oldBuilder = EncounterEventBuilder()
    private var bulbaBuilder = EncounterEventBuilder()

    @BeforeEach
    fun setUp() {
        this.builder = EncounterEventBuilder().nuzlockeRun(run).caught(true).teamMember(TeamMemberBuilder().build())
        this.oldBuilder = EncounterEventBuilder().caught(true).nuzlockeRun(oldRun)
                .teamMember(TeamMemberBuilder().setGame(oldRun.game).build())
        this.bulbaBuilder = EncounterEventBuilder().pokedexNumber(1).nuzlockeRun(run).caught(true)
                .teamMember(TeamMemberBuilder().pokedexNumber(1).build())
        whenever(service.getLocationsWithEncounters(any())).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(any(), any())).thenReturn(listOf())
    }

    @Test
    fun validate() {
        assertDoesNotThrow {
            builder.buildCreatorTO().validate(run, service)
            builder.caught(false).teamMember(null).buildCreatorTO().validate(run, service)
            oldBuilder.buildCreatorTO().validate(oldRun, service)
        }
    }

    @Test
    fun validate_emptyLocation() {
        assertThat(assertThrows<ValidationException> {
            builder.location("").buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_invalidLocation() {
        val usedLocation = "UsedLocation"
        val runWithRule = NuzlockeRunBuilder().id(2).rules(listOf(Rules.ONLY_FIRST_ENCOUNTER)).build()
        whenever(service.getLocationsWithEncounters(runWithRule.id)).thenReturn(listOf(usedLocation))

        assertDoesNotThrow {
            builder.location(usedLocation).buildCreatorTO().validate(run, service)
        }
        assertThat(assertThrows<ValidationException> {
            builder.nuzlockeRun(runWithRule).location(usedLocation).buildCreatorTO().validate(runWithRule, service)
        }.message).isEqualTo(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED.message)
    }

    @Test
    fun validate_invalidLevel() {
        assertThat(assertThrows<ValidationException> {
            builder.level(0).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            builder.level(101).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
    }

    @Test
    fun validate_invalidPokedexNumber() {
        assertThat(assertThrows<ValidationException> {
            builder.pokedexNumber(0).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            builder.pokedexNumber(10000000).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
    }

    @Test
    fun validate_notCaughtButHasTeamMember() {
        assertThat(assertThrows<ValidationException> {
            builder.caught(false).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.NOT_CAUGHT_BUT_POKEMON.message)
    }

    @Test
    fun validate_caughtButNoTeamMember() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(null).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.CAUGHT_AND_NO_POKEMON.message)
    }

    @Test
    fun validate_invalidNickname() {
        val oldRun = NuzlockeRunBuilder().id(2).game(Games.RED).build()

        val tooShort = TeamMemberBuilder().nickname("").build()
        val tooLongOld = TeamMemberBuilder().nickname("12345678901").build()
        val tooLongNew = TeamMemberBuilder().nickname("1234567890123").build()

        assertThat(assertThrows<ValidationException> {
            builder.teamMember(tooShort).buildCreatorTO().validate(oldRun, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(tooLongOld).buildCreatorTO().validate(oldRun, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)

        assertDoesNotThrow {
            builder.teamMember(tooLongOld).buildCreatorTO().validate(run, service)
        }
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(tooLongNew).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
    }

    @Test
    fun validate_invalidNature() {
        val wrongNature = TeamMemberBuilder().nature(null).build()

        assertThat(assertThrows<ValidationException> {
            builder.teamMember(wrongNature).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

    @Test
    fun validate_invalidAbilitySlot() {
        for (abilitySlot in listOf(null, 0, 2, 4)) {
            val member = TeamMemberBuilder().pokedexNumber(1).abilitySlot(abilitySlot).build()
            assertThat(assertThrows<ValidationException> {
                builder.pokedexNumber(1).teamMember(member).buildCreatorTO().validate(run, service)
            }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
        }
    }

    @Test
    fun validate_duplicateEncounter() {
        val runWithRule = NuzlockeRunBuilder().id(2).rules(listOf(Rules.DUPLICATE_CLAUSE)).build()

        assertDoesNotThrow { bulbaBuilder.buildCreatorTO().validate(runWithRule, service) }

        whenever(service.getEncounteredSpecies(runWithRule.id, true)).thenReturn(listOf(bulbaBuilder.pokedexNumber))

        assertThat(assertThrows<ValidationException> {
            bulbaBuilder.buildCreatorTO().validate(runWithRule, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
        assertDoesNotThrow {
            bulbaBuilder.pokedexNumber(bulbaBuilder.pokedexNumber + 1).buildCreatorTO().validate(runWithRule, service)
        }
    }

    @Test
    fun validate_duplicateEncounterThatFailed() {
        val runWithRule = NuzlockeRunBuilder().rules(
                listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS)).build()

        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(bulbaBuilder.pokedexNumber))

        assertThat(assertThrows<ValidationException> {
            bulbaBuilder.buildCreatorTO().validate(runWithRule, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    @Test
    fun validate_duplicateEvolutionsEncounter() {
        val runWithRule = NuzlockeRunBuilder().rules(
                listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES)).build()

        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            bulbaBuilder.pokedexNumber(bulbaBuilder.pokedexNumber + 1).buildCreatorTO().validate(runWithRule, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    @Test
    fun validate_NoNatureInModernGame() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(TeamMemberBuilder().nature(null).build()).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

    @Test
    fun validate_NoAbilityInModernGame() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(TeamMemberBuilder().abilitySlot(null).build()).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_NoGenderInModernGame() {
        assertThat(assertThrows<ValidationException> {
            builder.teamMember(TeamMemberBuilder().gender(null).build()).buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_GENDER.message)
    }

    @Test
    fun validate_natureInOldGame() {
        assertThat(assertThrows<ValidationException> {
            val teamMember = TeamMemberBuilder().setGame(oldRun.game).nature(Natures.BOLD).build()
            oldBuilder.teamMember(teamMember).buildCreatorTO().validate(oldRun, service)
        }.message).isEqualTo(ErrorMessages.HAS_NATURE_BUT_OLD_GAME.message)
    }

    @Test
    fun validate_abilityInOldGame() {
        assertThat(assertThrows<ValidationException> {
            val teamMember = TeamMemberBuilder().setGame(oldRun.game).abilitySlot(1).build()
            oldBuilder.teamMember(teamMember).buildCreatorTO().validate(oldRun, service)
        }.message).isEqualTo(ErrorMessages.HAS_ABILITY_BUT_OLD_GAME.message)
    }

    @Test
    fun validate_genderInOldGame() {
        assertThat(assertThrows<ValidationException> {
            val teamMember = TeamMemberBuilder().setGame(oldRun.game).gender(Gender.MALE).build()
            oldBuilder.teamMember(teamMember).buildCreatorTO().validate(oldRun, service)
        }.message).isEqualTo(ErrorMessages.HAS_GENDER_BUT_OLD_GAME.message)
    }

    @Test
    fun validate_nicknameAlreadyUsed() {
        whenever(service.getNicknamesOfCaughtEncounters(run.id)).thenReturn(listOf(bulbaBuilder.teamMember!!.nickname))

        assertThat(assertThrows<ValidationException> {
            bulbaBuilder.buildCreatorTO().validate(run, service)
        }.message).isEqualTo(ErrorMessages.NICKNAME_ALREADY_USED.message)
    }
}