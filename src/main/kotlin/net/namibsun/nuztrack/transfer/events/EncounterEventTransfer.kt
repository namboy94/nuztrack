package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.events.EncounterEvent
import net.namibsun.nuztrack.data.events.EncounterEventService
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO
import net.namibsun.nuztrack.util.validateEmptyLocation
import net.namibsun.nuztrack.util.validateLevel

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
    fun validate(run: NuzlockeRun, encounterService: EncounterEventService) {
        validateEmptyLocation(location)
        val previousLocations = encounterService.getLocationsWithEncounters(run.id)
        if (previousLocations.contains(location) && run.rules.contains(Rules.ONLY_FIRST_ENCOUNTER)) {
            throw ValidationException(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED)
        }

        val pokemonSpecies = try {
            Pokedex.getPokemon(pokedexNumber)
        } catch (e: NotFoundException) {
            throw ValidationException(ErrorMessages.INVALID_POKEMON)
        }

        validateLevel(level)
        if (caught && pokemon == null) {
            throw ValidationException(ErrorMessages.CAUGHT_AND_NO_POKEMON)
        }
        if (!caught && pokemon != null) {
            throw ValidationException(ErrorMessages.NOT_CAUGHT_BUT_POKEMON)
        }
        pokemon?.validate(pokemonSpecies, run.game)
        validateDuplicateClause(run, encounterService)
    }

    private fun validateDuplicateClause(run: NuzlockeRun, encounterService: EncounterEventService) {
        val blacklist = mutableListOf<Int>()
        if (run.rules.contains(Rules.DUPLICATE_CLAUSE)) {
            blacklist += encounterService.getEncounteredSpecies(run.id, true)
        }
        if (run.rules.contains(Rules.DUPLICATE_CLAUSE_INCLUDES_FAILED_ENCOUNTERS)) {
            blacklist += encounterService.getEncounteredSpecies(run.id, false)
        }
        if (run.rules.contains(Rules.DUPLICATE_CLAUSE_INCLUDES_ENTIRE_SPECIES)) {
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
        val nature: String?,
        val abilitySlot: Int?
) {
    fun validate(pokemonSpecies: PokemonSpeciesTO, game: Games) {
        val maxNicknameLength = if (game.generation <= 5) 10 else 12
        if (nickname.isEmpty() || nickname.length > maxNicknameLength) {
            throw ValidationException(ErrorMessages.INVALID_NICKNAME)
        }

        if (game.generation <= 2) {
            if (nature != null) {
                throw ValidationException(ErrorMessages.HAS_NATURE_BUT_OLD_GAME)
            }
            if (abilitySlot != null) {
                throw ValidationException(ErrorMessages.HAS_ABILITY_BUT_OLD_GAME)
            }
        } else {
            if (pokemonSpecies.abilities[abilitySlot] == null) {
                throw ValidationException(ErrorMessages.INVALID_ABILITY_SLOT)
            }
            Natures.valueOfWithChecks(nature)
        }
    }
}