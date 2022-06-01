package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.core.io.ClassPathResource

object Pokedex {
    val pokedex: Map<Int, PokemonSpeciesTO>

    init {
        val pokedexFile = ClassPathResource("data/pokemon.json").file
        pokedex = jacksonObjectMapper().readValue(pokedexFile)
    }
}
