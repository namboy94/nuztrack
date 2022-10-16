package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.testbuilders.transfer.PokemonSpeciesTOBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class SpritesTest {

    @Test
    fun getSpriteForGameAndPokemon_Gen_1() {
        val species = PokemonSpeciesTOBuilder().build()
        val spriteUrl = getSpriteForGameAndPokemon(species, Games.RED, false)
        assertThat(spriteUrl).isEqualTo("https://img.pokemondb.net/sprites/red-blue/normal/squirtle-color.png")
    }

    @Test
    fun getSpriteForGameAndPokemon_Gen_2() {
        val species = PokemonSpeciesTOBuilder().build()
        val spriteUrl = getSpriteForGameAndPokemon(species, Games.SILVER, false)
        val shinySpriteUrl = getSpriteForGameAndPokemon(species, Games.SILVER, true)

        assertThat(spriteUrl).isEqualTo("https://img.pokemondb.net/sprites/silver/normal/squirtle.png")
        assertThat(shinySpriteUrl).isEqualTo(spriteUrl.replace("normal", "shiny"))
    }

    @Test
    fun getSpriteForGameAndPokemon_Gen_3_FIRERED() {
        val genOneSpecies = PokemonSpeciesTOBuilder().build()
        val genTwoSpecies = PokemonSpeciesTOBuilder().pokedexNumber(152).name("Chikorita").build()
        val genOneUrl = getSpriteForGameAndPokemon(genOneSpecies, Games.FIRERED, false)
        val genTwoUrl = getSpriteForGameAndPokemon(genTwoSpecies, Games.FIRERED, true)

        assertThat(genOneUrl).isEqualTo("https://img.pokemondb.net/sprites/firered-leafgreen/normal/squirtle.png")
        assertThat(genTwoUrl).isEqualTo("https://img.pokemondb.net/sprites/emerald/shiny/chikorita.png")
    }

    @Test
    fun getSpriteForGameAndPokemon_Gen_7() {
        val species = PokemonSpeciesTOBuilder().build()
        val spriteUrl = getSpriteForGameAndPokemon(species, Games.ULTRA_SUN, false)
        assertThat(spriteUrl).isEqualTo("https://img.pokemondb.net/sprites/bank/normal/squirtle.png")
    }

    @Test
    fun getSpriteForGameAndPokemon_Gen_8() {
        val species = PokemonSpeciesTOBuilder().build()
        val spriteUrl = getSpriteForGameAndPokemon(species, Games.SWORD, false)
        assertThat(spriteUrl).isEqualTo("https://img.pokemondb.net/sprites/home/normal/squirtle.png")
    }
}