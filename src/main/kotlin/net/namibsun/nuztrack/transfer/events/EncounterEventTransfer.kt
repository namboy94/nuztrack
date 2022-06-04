package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Natures

data class CreateEncounterEventTO(
        val location: String,
        val pokedexNumber: Int,
        val level: Int,
        val gender: String,
        val caught: Boolean,
        val pokemon: CreateEncounterPokemonTO?
) {
    fun validate(previousLocations: List<String>) {

        if (previousLocations.contains(location)) {
            throw ValidationException(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED)
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

        val species = Pokedex.getPokemon(pokedexNumber)
        if (pokemon != null) {
            val abilities = listOf(species.abilities.primary, species.abilities.secondary, species.abilities.hidden)
            if (!abilities.contains(pokemon.nature)) {
                throw ValidationException(ErrorMessages.INVALID_ABILITY)
            }
            Natures.valueOfWithChecks(pokemon.nature)
        }
    }
}

data class CreateEncounterPokemonTO(
        val nickname: String,
        val nature: String,
        val ability: String
)