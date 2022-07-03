package net.namibsun.nuztrack.transfer

data class PKHeXPokemon(
        val nickName: String,
        val species: Int,
        val active: Boolean,
        val level: Int,
        val gender: String?,
        val nature: String?,
        val abilitySlot: Int?
)