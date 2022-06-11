package net.namibsun.nuztrack.constants.enums

import net.namibsun.nuztrack.util.safeValueOf

enum class Games(val title: String, val generation: Int) {
    RED("Red", 1), BLUE("Blue", 1), GREEN("Green", 1), YELLOW("Yellow", 1),
    SILVER("Silver", 2), GOLD("Gold", 2), CRYSTAL("Crystal", 2),
    RUBY("Ruby", 3), SAPPHIRE("Sapphire", 3), EMERALD("Emerald", 3),
    FIRERED("FireRed", 3), LEAFGREEN("LeafGreen", 3),
    DIAMOND("Diamond", 4), PEARL("Pearl", 4), PLATINUM("Platinum", 4),
    HEARTGOLD("HeartGold", 4), SOULSILVER("SoulSilver", 4),
    BLACK("Black", 5), WHITE("White", 5), BLACK_2("Black 2", 5), WHITE_2("White 2", 5),
    X("X", 6), Y("Y", 6), OMEGA_RUBY("Omega Ruby", 6), ALPHA_SAPPHIRE("Alpha Sapphire", 6),
    SUN("Sun", 7), MOON("Moon", 7), ULTRA_SUN("Ultra Sun", 7), ULTRA_MOON("Ultra Moon", 7),
    SWORD("Sword", 8), SHIELD("Shield", 8),
    BRILLIANT_DIAMOND("Brilliant Diamond", 8), SHINING_PEARL("Shining Pearl", 8);

    companion object {
        fun valueOfWithChecks(string: String?): Games {
            return safeValueOf(string, ErrorMessages.INVALID_GAME)
        }
    }
}
