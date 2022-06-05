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
}
