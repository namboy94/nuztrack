package net.namibsun.nuztrack.constants.external

data class PokemonSpeciesTO(
        val name: String,
        val sprite: String,
        val types: TypesTO,
        val abilities: AbilitiesTO
)

data class AbilitiesTO(val primary: String, val secondary: String?, val hidden: String?)
data class TypesTO(val primary: String, val secondary: String?)
