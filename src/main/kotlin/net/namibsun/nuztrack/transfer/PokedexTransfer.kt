package net.namibsun.nuztrack.transfer

typealias PokedexTO = Map<Int, PokemonSpeciesTO>

data class PokemonSpeciesTO(
        val name: String,
        val sprite: String,
        val types: PokemonTypesTO,
        val abilities: Map<Int, String?>,
        val evolutions: List<Int>
)

data class PokemonTypesTO(val primary: String, val secondary: String?)