package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.Rules
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

internal class CreateEncounterEventTOTest {

    private val validPokemon = CreateEncounterPokemonTO("Bob", Natures.ADAMANT.name, 1)

    @Test
    fun validate() {
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, "male", true, validPokemon).validate(listOf(), listOf(), listOf(), listOf())
        }
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, "male", false, null).validate(listOf(), listOf(), listOf(), listOf())
        }
    }

    @Test
    fun validate_invalidLocation() {
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, validPokemon)
                    .validate(listOf(Rules.ONLY_FIRST_ENCOUNTER), listOf("A"), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED.message)
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 1, "male", true, validPokemon)
                    .validate(listOf(), listOf("A"), listOf(), listOf())
        }
    }

    @Test
    fun validate_invalidLevel() {
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 0, "male", true, validPokemon)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 101, "male", true, validPokemon)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.LEVEL_OUT_OF_BOUNDS.message)
    }

    @Test
    fun validate_invalidPokedexNumber() {
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 0, 1, "male", true, validPokemon)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 10000000, 1, "male", true, validPokemon)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
    }

    @Test
    fun validate_caughtAndNullDiscrepancy() {
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", false, validPokemon)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.NOT_CAUGHT_BUT_POKEMON.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, null)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.CAUGHT_AND_NO_POKEMON.message)
    }

    @Test
    fun validate_invalidNickname() {
        val tooShort = CreateEncounterPokemonTO("", Natures.ADAMANT.name, 1)
        val tooLong = CreateEncounterPokemonTO("1234567890123", Natures.ADAMANT.name, 1)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, tooShort)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, tooLong)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_NICKNAME.message)
    }

    @Test
    fun validate_invalidNature() {
        val pokemon = CreateEncounterPokemonTO("A", "DoesNotExist", 1)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, pokemon)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_NATURE.message)
    }

    @Test
    fun validate_invalidAbilitySlot() {
        val one = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 0)
        val two = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 4)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, one)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, two)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_invalidAbility() {
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 2)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 1, "male", true, bulba)
                    .validate(listOf(), listOf(), listOf(), listOf())
        }.message).isEqualTo(ErrorMessages.INVALID_ABILITY_SLOT.message)
    }

    @Test
    fun validate_duplicateEncounter() {
        val rules = listOf(Rules.DUPLICATE_CLAUSE)
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 1)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 15, "male", true, bulba)
                    .validate(rules, listOf(), listOf(1), listOf(1))
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 3, 15, "male", true, bulba)
                    .validate(rules, listOf(), listOf(1), listOf(1))
        }
        assertDoesNotThrow {
            CreateEncounterEventTO("A", 1, 15, "male", true, bulba)
                    .validate(rules, listOf(), listOf(), listOf(1))
        }
    }

    @Test
    fun validate_duplicateEncounterThatFailed() {
        val rules = listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS)
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 1)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 1, 15, "male", true, bulba)
                    .validate(rules, listOf(), listOf(), listOf(1))
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }

    @Test
    fun validate_duplicateEvolutionsEncounter() {
        val rules = listOf(Rules.DUPLICATE_CLAUSE, Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES)
        val bulba = CreateEncounterPokemonTO("A", Natures.ADAMANT.name, 1)
        assertThat(assertThrows<ValidationException> {
            CreateEncounterEventTO("A", 3, 15, "male", true, bulba)
                    .validate(rules, listOf(), listOf(1), listOf(1))
        }.message).isEqualTo(ErrorMessages.DUPLICATE_ENCOUNTER.message)
    }
}