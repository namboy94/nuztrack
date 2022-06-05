package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO

data class EncounterEventTO(
        val event: EventTO,
        val pokedexNumber: Int,
        val level: Int,
        val gender: String,
        val caught: Boolean,
        val teamMemberId: Long?
) {
    companion object {
        fun fromEncounterEvent(event: EncounterEvent): EncounterEventTO {
            return EncounterEventTO(
                    EventTO.fromEvent(event),
                    event.pokedexNumber,
                    event.level,
                    event.gender.name,
                    event.caught,
                    event.teamMember?.id
            )
        }
    }
}

data class CreateEncounterEventTO(
        val location: String,
        val pokedexNumber: Int,
        val level: Int,
        val gender: String,
        val caught: Boolean,
        val pokemon: CreateEncounterPokemonTO?
) {
    fun validate(
            rules: List<Rules>,
            previousLocations: List<String>,
            successFullyCaught: List<Int>,
            failedToCatch: List<Int>
    ) {
        if (previousLocations.contains(location) && rules.contains(Rules.ONLY_FIRST_ENCOUNTER)) {
            throw ValidationException(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED)
        }

        val pokemonSpecies = try {
            Pokedex.getPokemon(pokedexNumber)
        } catch (e: NotFoundException) {
            throw ValidationException(ErrorMessages.INVALID_POKEMON)
        }

        if (level < 1 || level > 100) {
            throw ValidationException(ErrorMessages.LEVEL_OUT_OF_BOUNDS)
        }
        if (caught && pokemon == null) {
            throw ValidationException(ErrorMessages.CAUGHT_AND_NO_POKEMON)
        }
        if (!caught && pokemon != null) {
            throw ValidationException(ErrorMessages.NOT_CAUGHT_BUT_POKEMON)
        }
        pokemon?.validate(pokemonSpecies)
        validateDuplicateClause(rules, pokedexNumber, successFullyCaught, failedToCatch)
    }

    private fun validateDuplicateClause(
            rules: List<Rules>,
            pokedexNumber: Int,
            successFullyCaught: List<Int>,
            failedToCatch: List<Int>
    ) {
        val blacklist = mutableListOf<Int>()
        if (rules.contains(Rules.DUPLICATE_CLAUSE)) {
            blacklist += successFullyCaught
        }
        if (rules.contains(Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS)) {
            blacklist += failedToCatch
        }
        if (rules.contains(Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES)) {
            for (species in blacklist.toList()) {
                blacklist += Pokedex.getEvolutionChain(species)
            }
        }
        if (blacklist.contains(pokedexNumber)) {
            throw ValidationException(ErrorMessages.DUPLICATE_ENCOUNTER)
        }
    }
}

data class CreateEncounterPokemonTO(
        val nickname: String,
        val nature: String,
        val abilitySlot: Int
) {
    fun validate(pokemonSpecies: PokemonSpeciesTO) {
        if (nickname.isEmpty() || nickname.length > 12) {
            throw ValidationException(ErrorMessages.INVALID_NICKNAME)
        }
        if (pokemonSpecies.abilities[abilitySlot] == null) {
            throw ValidationException(ErrorMessages.INVALID_ABILITY_SLOT)
        }
        Natures.valueOfWithChecks(nature)
    }
}