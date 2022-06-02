package net.namibsun.nuztrack.constants

import net.namibsun.nuztrack.routes.pokedex.PokedexTO
import net.namibsun.nuztrack.routes.pokedex.PokemonAbilitiesTO
import net.namibsun.nuztrack.routes.pokedex.PokemonSpeciesTO
import net.namibsun.nuztrack.routes.pokedex.PokemonTypesTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class PokedexTest {

    @Test
    fun getPokedex() {
        val pokedex: PokedexTO = Pokedex.getPokedex()
        assertThat(pokedex[7]!!.name).isEqualTo("Squirtle")
    }

    @Test
    fun getPokemon_success() {
        val squirtle = Pokedex.getPokemon(7)
        assertThat(squirtle).isEqualTo(PokemonSpeciesTO(
                name = "Squirtle",
                sprite = squirtle.sprite,
                types = PokemonTypesTO("WATER", null),
                abilities = PokemonAbilitiesTO("Torrent", null, "Rain Dish")
        ))
    }

    @Test
    fun getPokemon_error() {
        assertThat(assertThrows<NotFoundException> {
            Pokedex.getPokemon(-15)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<NotFoundException> {
            Pokedex.getPokemon(0)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<NotFoundException> {
            // I doubt there will ever be that many Pokemon, but you never know ¯\_(ツ)_/¯
            Pokedex.getPokemon(1000000)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
    }
}