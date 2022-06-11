package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.*
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.EncounterEventService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever

internal class CreateEncounterEventTOTest {

    val service: EncounterEventService = mock()
    private val validPokemon = CreateEncounterPokemonTO("Bob", "male", Natures.ADAMANT.name, 1)

    @Test
    fun validate() {
        val modernRun = buildRun()
        val oldRun = buildRun(game = Games.RED)
        val oldPokemon = CreateEncounterPokemonTO("Rob", null, null, null)
        defaultMocks(modernRun)

        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, true, validPokemon).validate(modernRun, service)
            CreateEncounterEventTO("A", 1, 1, false, null).validate(modernRun, service)
            CreateEncounterEventTO("A", 1, 1, true, oldPokemon).validate(oldRun, service)
        }
    }

    @Test
    fun validate_emptyLocation() {
        val run = buildRun()
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("", 1, 1, true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_invalidLocation() {
        val runWithRule = buildRun(listOf(Rules.ONLY_FIRST_ENCOUNTER))
        val runWithoutRule = buildRun()

        defaultMocks(runWithRule)
        whenever(service.getLocationsWithEncounters(runWithRule.id)).thenReturn(listOf("A"))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, validPokemon).validate(runWithRule, service)
        }.message).isEqualTo(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED.message)
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, true, validPokemon).validate(runWithoutRule, service)
        }
    }

    @Test
    fun validate_invalidLevel() {
        val run = buildRun()

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 0, true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 101, true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
    }

    @Test
    fun validate_invalidPokedexNumber() {
        val run = buildRun()

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 0, 1, true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 10000000, 1, true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
    }

    @Test
    fun validate_caughtAndNullDiscrepancy() {
        val run = buildRun()

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, false, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.NOT_CAUGHT_BUT_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, null).validate(run, service)
        }.message).isEqualTo(ErrorMessages.CAUGHT_AND_NO_POKEMON.message)
    }

    @Test
    fun validate_invalidNickname() {
        val run = buildRun()
        val newRun = buildRun(game = Games.X)
        val tooShort = CreateEncounterPokemonTO("", "male", Natures.ADAMANT.name, 1)
        val tooLongOld = CreateEncounterPokemonTO("12345678901", "male", Natures.ADAMANT.name, 1)
        val tooLongNew = CreateEncounterPokemonTO("1234567890123", "male", Natures.ADAMANT.name, 1)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, tooShort).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, tooLongOld).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, tooLongNew).validate(newRun, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)

        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, true, tooLongOld).validate(newRun, service)
        }

    }

    @Test
    fun validate_invalidNature() {
        val run = buildRun()
        val pokemon = CreateEncounterPokemonTO("A", "male", "DoesNotExist", 1)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, pokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

    @Test
    fun validate_invalidAbilitySlot() {
        val run = buildRun()
        val one = CreateEncounterPokemonTO("A", "male", Natures.ADAMANT.name, 0)
        val two = CreateEncounterPokemonTO("A", "male", Natures.ADAMANT.name, 4)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, one).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, two).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_invalidAbility() {
        val run = buildRun()
        val bulba = CreateEncounterPokemonTO("A", "male", Natures.ADAMANT.name, 2)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_duplicateEncounter() {
        val run = buildRun(listOf(Rules.DUPLICATE_CLAUSE))
        val bulba = CreateEncounterPokemonTO("A", "male", Natures.ADAMANT.name, 1)

        defaultMocks(run)
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf(1))
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 15, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 3, 15, true, bulba).validate(run, service)
        }

        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        assertDoesNotThrow { CreateEncounterEventTO("A", 1, 15, true, bulba).validate(run, service) }
    }

    @Test
    fun validate_duplicateEncounterThatFailed() {
        val run = buildRun(listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS))
        val bulba = CreateEncounterPokemonTO("A", "male", Natures.ADAMANT.name, 1)

        defaultMocks(run)
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 15, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    @Test
    fun validate_duplicateEvolutionsEncounter() {
        val run = buildRun(listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES))
        val bulba = CreateEncounterPokemonTO("A", "male", Natures.ADAMANT.name, 1)

        defaultMocks(run)
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf(1))
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 3, 15, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    @Test
    fun validate_NoNatureInModernGame() {
        val run = buildRun()
        val bulba = CreateEncounterPokemonTO("Bulba", "male", null, 1)
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

    @Test
    fun validate_NoAbilityInModernGame() {
        val run = buildRun()
        val bulba = CreateEncounterPokemonTO("Bulba", "male", Natures.ADAMANT.name, null)
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_NoGenderInModernGame() {
        val run = buildRun()
        val bulba = CreateEncounterPokemonTO("Bulba", null, Natures.ADAMANT.name, 1)
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_GENDER.message)
    }

    @Test
    fun validate_natureInOldGame() {
        val run = buildRun(game = Games.RED)
        val bulba = CreateEncounterPokemonTO("Bulba", null, Natures.ADAMANT.name, null)
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.HAS_NATURE_BUT_OLD_GAME.message)
    }

    @Test
    fun validate_abilityInOldGame() {
        val run = buildRun(game = Games.RED)
        val bulba = CreateEncounterPokemonTO("Bulba", null, null, 1)
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.HAS_ABILITY_BUT_OLD_GAME.message)
    }

    @Test
    fun validate_genderInOldGame() {
        val run = buildRun(game = Games.RED)
        val bulba = CreateEncounterPokemonTO("Bulba", "male", null, null)
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.HAS_GENDER_BUT_OLD_GAME.message)
    }

    private fun buildRun(rules: List<Rules> = listOf(), game: Games = Games.FIRERED): NuzlockeRun {
        return NuzlockeRun(1000, "User", "Name", game, rules, listOf(), RunStatus.ACTIVE)
    }

    private fun defaultMocks(run: NuzlockeRun) {
        whenever(service.getLocationsWithEncounters(run.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf())
    }
}