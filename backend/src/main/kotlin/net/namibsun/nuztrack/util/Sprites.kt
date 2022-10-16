package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO

fun getSpriteForGameAndPokemon(pokemon: PokemonSpeciesTO, game: Games, shiny: Boolean): String {
    val gameKeys = mapOf(
            Games.RED to "red-blue",
            Games.BLUE to "red-blue",
            Games.YELLOW to "yellow",
            Games.SILVER to "silver",
            Games.GOLD to "gold",
            Games.CRYSTAL to "crystal",
            Games.RUBY to "ruby-sapphire",
            Games.SAPPHIRE to "ruby-sapphire",
            Games.FIRERED to "firered-leafgreen",
            Games.LEAFGREEN to "firered-leafgreen",
            Games.EMERALD to "emerald",
            Games.DIAMOND to "diamond-pearl",
            Games.PEARL to "diamond-pearl",
            Games.PLATINUM to "platinum",
            Games.HEARTGOLD to "heartgold-soulsilver",
            Games.SOULSILVER to "heartgold-soulsilver",
            Games.BLACK to "black-white",
            Games.WHITE to "black-white",
            Games.BLACK_2 to "black-white",
            Games.WHITE_2 to "black-white",
            Games.X to "x-y",
            Games.Y to "y-y",
            Games.OMEGA_RUBY to "omega-ruby-alpha-sapphire/dex",
            Games.ALPHA_SAPPHIRE to "omega-ruby-alpha-sapphire/dex"
    )
    var gameKey = gameKeys[game]
    if (game in listOf(Games.FIRERED, Games.LEAFGREEN) && pokemon.pokedexNumber > 151) {
        gameKey = gameKeys[Games.EMERALD]
    }
    if (gameKey == null) {
        gameKey = if (game.generation == 7) "bank" else "home"
    }

    val shinyKey = if (shiny) "shiny" else "normal"
    val colorExtra = if (game.generation == 1) "-color" else ""
    return "https://img.pokemondb.net/sprites/" +
            "${gameKey}/${shinyKey}/" +
            pokemon.name.lowercase() +
            "${colorExtra}.png"
}
