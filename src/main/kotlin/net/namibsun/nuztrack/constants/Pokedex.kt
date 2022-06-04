package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.transfer.PokedexTO
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO
import org.springframework.core.io.ClassPathResource

object Pokedex {
    private val pokedex: PokedexTO

    init {
        val pokedexFile = ClassPathResource("data/pokemon.json").file
        pokedex = jacksonObjectMapper().readValue(pokedexFile)
    }

    fun getPokemon(pokedexId: Int): PokemonSpeciesTO {
        return pokedex[pokedexId] ?: throw NotFoundException(ErrorMessages.INVALID_POKEMON)
    }

    fun getPokedex(): PokedexTO {
        return pokedex
    }

    fun getAbilityName(pokedexId: Int, abilitySlot: Int): String {
        val pokemon = getPokemon(pokedexId)
        try {
            val abilities = listOf(pokemon.abilities.primary, pokemon.abilities.secondary, pokemon.abilities.hidden)
            return abilities[abilitySlot]!!
        } catch (e: IndexOutOfBoundsException) {
            throw ValidationException(ErrorMessages.INVALID_ABILITY_SLOT)
        } catch (e: NullPointerException) {
            throw ValidationException(ErrorMessages.INVALID_ABILITY_SLOT)
        }
    }

    fun getAbilitySlot(pokedexId: Int, abilityName: String): Int {
        val abilities = getPokemon(pokedexId).abilities
        val slots = mapOf(abilities.primary to 1, abilities.secondary to 2, abilities.hidden to 3)
        return slots[abilityName] ?: throw ValidationException(ErrorMessages.INVALID_ABILITY)
    }
}
