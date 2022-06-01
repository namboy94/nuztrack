package net.namibsun.nuztrack.constants

data class PokemonSpeciesTO(
        val name: String,
        val sprite: String,
        val types: Map<Int, String?>,
        val abilities: Map<Int, String?>
)
