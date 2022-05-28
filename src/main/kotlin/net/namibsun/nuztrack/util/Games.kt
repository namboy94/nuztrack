package net.namibsun.nuztrack.util

enum class Games(val title: String) {
    RED("Red"), BLUE("Blue"), GREEN("Green"), YELLOW("Yellow"),
    SILVER("Silver"), GOLD("Gold"), CRYSTAL("Crystal"),
    RUBY("Ruby"), SAPPHIRE("Sapphire"), EMERALD("Emerald"),
    FIRERED("FireRed"), LEAFGREEN("LeafGreen"),
    DIAMOND("Diamond"), PEARL("Pearl"), PLATINUM("Platinum"),
    HEARTGOLD("HeartGold"), SOULSILVER("SoulSilver"),
    BLACK("Black"), WHITE("White"), BLACK_2("Black 2"), WHITE_2("White 2"),
    X("X"), Y("Y"), OMEGA_RUBY("Omega Ruby"), ALPHA_SAPPHIRE("Alpha Sapphire"),
    SUN("Sun"), MOON("Moon"), ULTRA_SUN("Ultra Sun"), ULTRA_MOON("Ultra Moon"),
    SWORD("Sword"), SHIELD("Shield"),
    BRILLIANT_DIAMOND("Brilliant Diamond"), SHINING_PEARL("Shining Pearl"),
    LEGENDS_ARCEUS("Legends: Arceus");
}

fun getValueOfGameTitle(title: String): Games {
    return Games.values().first { it.title == title }
}
