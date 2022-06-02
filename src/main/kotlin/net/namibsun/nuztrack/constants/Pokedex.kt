package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.routes.pokedex.PokedexTO
import net.namibsun.nuztrack.routes.pokedex.PokemonSpeciesTO
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
}
