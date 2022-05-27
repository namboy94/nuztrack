package net.namibsun.nuztrack.pokemon

import com.fasterxml.jackson.annotation.JsonValue

enum class Game {
    RED, BLUE, GREEN, YELLOW,
    SILVER, GOLD, CRYSTAL,
    RUBY, SAPPHIRE, EMERALD, FIRERED, LEAFGREEN,
    DIAMOND, PEARL, PLATINUM, HEARTGOLD, SOULSILVER,
    BLACK, WHITE, BLACK_2, WHITE_2,
    X, Y, OMEGA_RUBY, ALPHA_SAPPHIRE,
    SUN, MOON, ULTRA_SUN, ULTRA_MOON,
    SWORD, SHIELD, BRILLIANT_DIAMOND, SHINING_PEARL, LEGENDS_ARCEUS;

    @JsonValue
    fun getGameName(): String {
        return this.name
    }

}