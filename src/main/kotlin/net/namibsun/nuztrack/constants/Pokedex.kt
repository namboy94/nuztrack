package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.transfer.PokedexTO
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO
import org.springframework.core.io.ClassPathResource

object Pokedex {
    private val pokedex: PokedexTO

    init {
        val pokedexStream = ClassPathResource("data/pokemon.json").inputStream
        pokedex = jacksonObjectMapper().readValue(pokedexStream)
    }

    fun getPokemon(pokedexNumber: Int): PokemonSpeciesTO {
        return pokedex[pokedexNumber] ?: throw NotFoundException(ErrorMessages.INVALID_POKEMON)
    }

    fun getPokedex(): PokedexTO {
        return pokedex
    }

    fun getEvolutionChain(pokedexNumber: Int): List<Int> {
        val pokemon = getPokemon(pokedexNumber)
        return traverseEvolutionChain(pokemon.baseSpecies)
    }

    private fun traverseEvolutionChain(pokedexNumber: Int): List<Int> {
        val collected = mutableListOf(pokedexNumber)
        val pokemon = getPokemon(pokedexNumber)
        for (next in pokemon.evolutions) {
            collected += traverseEvolutionChain(next)
        }
        return collected
    }

    fun getBaseSpeciesForGame(pokedexNumber: Int, game: Games): Int {
        val baseSpecies = getPokemon(getPokemon(pokedexNumber).baseSpecies)
        return if (baseSpecies.generation > game.generation) {
            if (baseSpecies.evolutions.contains(pokedexNumber)) {
                pokedexNumber
            } else {
                baseSpecies.evolutions[0]
            }
        } else {
            baseSpecies.pokedexNumber
        }
    }

    fun generateGender(pokedexNumber: Int, game: Games): Gender? {
        val genderRate = getPokemon(pokedexNumber).genderRate
        val probableGender =
                if (genderRate == -1) Gender.NEUTRAL
                else if (genderRate < 4) Gender.MALE
                else if (genderRate > 4) Gender.FEMALE
                else listOf(Gender.MALE, Gender.FEMALE).random()
        return if (game.generation >= 2) probableGender else null
    }

    fun generateAbilitySlot(pokedexNumber: Int, game: Games): Int? {
        val validSlots = getPokemon(pokedexNumber).abilities.filter { it.value != null }.keys
        return if (game.generation >= 3) validSlots.random() else null
    }

    fun generateNature(game: Games): Natures? {
        return if (game.generation >= 3) Natures.values().random() else null
    }
}
