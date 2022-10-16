package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.util.getSpriteForGameAndPokemon

typealias PokedexTO = Map<Int, PokemonSpeciesTO>

data class PokemonSpeciesTO(
        val pokedexNumber: Int,
        val name: String,
        val sprite: String,
        val types: PokemonTypesTO,
        val abilities: Map<Int, String?>,
        val baseSpecies: Int,
        val evolutions: List<Int>,
        val genderRate: Int,
        val isLegendary: Boolean,
        val generation: Int
) {
    fun withGameSpecificSprite(game: Games): PokemonSpeciesTO {
        return PokemonSpeciesTO(
                pokedexNumber,
                name,
                getSpriteForGameAndPokemon(this, game, false),
                types,
                abilities,
                baseSpecies,
                evolutions,
                genderRate,
                isLegendary,
                generation
        )
    }
}

data class PokemonTypesTO(val primary: String, val secondary: String?)