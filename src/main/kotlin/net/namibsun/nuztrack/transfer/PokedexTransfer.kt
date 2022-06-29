package net.namibsun.nuztrack.transfer

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
)

data class PokemonTypesTO(val primary: String, val secondary: String?)