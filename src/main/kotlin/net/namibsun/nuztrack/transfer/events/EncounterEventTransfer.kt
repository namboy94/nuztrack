package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.events.EncounterEvent

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
    fun validate(previousLocations: List<String>, rules: List<Rules>) {

        if (previousLocations.contains(location) && rules.contains(Rules.ONLY_FIRST_ENCOUNTER)) {
            throw ValidationException(ErrorMessages.ENCOUNTER_IN_LOCATION_ALREADY_USED)
        }

        try {
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
        pokemon?.validate()
    }
}

data class CreateEncounterPokemonTO(
        val nickname: String,
        val nature: String,
        val abilitySlot: Int
) {
    fun validate() {
        if (nickname.isEmpty() || nickname.length > 12) {
            throw ValidationException(ErrorMessages.INVALID_NICKNAME)
        }
        if (!listOf(1, 2, 3).contains(abilitySlot)) {
            throw ValidationException(ErrorMessages.INVALID_ABILITY_SLOT)
        }
        Natures.valueOfWithChecks(nature)
    }
}