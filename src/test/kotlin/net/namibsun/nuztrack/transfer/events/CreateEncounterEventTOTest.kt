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
    private val validPokemon = CreateEncounterPokemonTO("Bob", Natures.ADAMANT.name, 1)

    @Test
    fun validate() {
        val run = buildRun()
        defaultMocks(run)

        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, "male", true, validPokemon).validate(run, service)
            CreateEncounterEventTO("A", 1, 1, "male", false, null).validate(run, service)
        }
    }

    @Test
    fun validate_emptyLocation() {
        val run = buildRun()
        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("", 1, 1, "male", true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.MISSING_LOCATION.message)
    }

    @Test
    fun validate_invalidLocation() {
        val runWithRule = buildRun(listOf(Rules.ONLY_FIRST_ENCOUNTER))
        val runWithoutRule = buildRun()

        defaultMocks(runWithRule)
        whenever(service.getLocationsWithEncounters(runWithRule.id)).thenReturn(listOf("A"))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, validPokemon).validate(runWithRule, service)
        }.message).isEqualTo(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED.message)
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, "male", true, validPokemon).validate(runWithoutRule, service)
        }
    }

    @Test
    fun validate_invalidLevel() {
        val run = buildRun()

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 0, "male", true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 101, "male", true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
    }

    @Test
    fun validate_invalidPokedexNumber() {
        val run = buildRun()

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 0, 1, "male", true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 10000000, 1, "male", true, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
    }

    @Test
    fun validate_caughtAndNullDiscrepancy() {
        val run = buildRun()

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", false, validPokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.NOT_CAUGHT_BUT_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, null).validate(run, service)
        }.message).isEqualTo(ErrorMessages.CAUGHT_AND_NO_POKEMON.message)
    }

    @Test
    fun validate_invalidNickname() {
        val run = buildRun()
        val tooShort = CreateEncounterPokemonTO("", Natures.ADAMANT.name, 1)
        val tooLong = CreateEncounterPokemonTO("1234567890123", Natures.ADAMANT.name, 1)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, tooShort).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, tooLong).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
    }

    @Test
    fun validate_invalidNature() {
        val run = buildRun()
        val pokemon = CreateEncounterPokemonTO("A", "DoesNotExist", 1)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, pokemon).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

    @Test
    fun validate_invalidAbilitySlot() {
        val run = buildRun()
        val one = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 0)
        val two = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 4)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, one).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, two).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_invalidAbility() {
        val run = buildRun()
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 2)

        defaultMocks(run)

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_duplicateEncounter() {
        val run = buildRun(listOf(Rules.DUPLICATE_CLAUSE))
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 1)

        defaultMocks(run)
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf(1))
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 15, "male", true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 3, 15, "male", true, bulba).validate(run, service)
        }

        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        assertDoesNotThrow { CreateEncounterEventTO("A", 1, 15, "male", true, bulba).validate(run, service) }
    }

    @Test
    fun validate_duplicateEncounterThatFailed() {
        val run = buildRun(listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS))
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 1)

        defaultMocks(run)
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 15, "male", true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    @Test
    fun validate_duplicateEvolutionsEncounter() {
        val run = buildRun(listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES))
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 1)

        defaultMocks(run)
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf(1))
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf(1))

        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 3, 15, "male", true, bulba).validate(run, service)
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    private fun buildRun(rules: List<Rules> = listOf()): NuzlockeRun {
        return NuzlockeRun(1000, "User", "Name", Games.RED, rules, listOf(), RunStatus.ACTIVE)
    }

    private fun defaultMocks(run: NuzlockeRun) {
        whenever(service.getLocationsWithEncounters(run.id)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, true)).thenReturn(listOf())
        whenever(service.getEncounteredSpecies(run.id, false)).thenReturn(listOf())
    }
}