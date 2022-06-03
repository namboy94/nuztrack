package net.namibsun.nuztrack.routes.pokedex

typealias PokedexTO = Map<Int, PokemonSpeciesTO>

data class PokemonSpeciesTO(
        val name: String,
        val sprite: String,
        val types: PokemonTypesTO,
        val abilities: PokemonAbilitiesTO,
        val evolutions: List<Int>
)

data class PokemonAbilitiesTO(val primary: String, val secondary: String?, val hidden: String?)
data class PokemonTypesTO(val primary: String, val secondary: String?)