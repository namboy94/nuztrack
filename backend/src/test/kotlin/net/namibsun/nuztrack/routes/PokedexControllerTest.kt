package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Natures
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class PokedexControllerTest {

    private val controller = PokedexController()

    @Test
    fun getPokedex_default() {
        val pokedex = controller.getPokedex(null).body!!
        assertThat(pokedex[123]).isEqualTo(Pokedex.getPokemon(123))
    }

    @Test
    fun getPokedex_gameSpecific() {
        val pokedex = controller.getPokedex(Games.FIRERED.name).body!!
        assertThat(pokedex[123]!!.name).isEqualTo(Pokedex.getPokemon(123).name)
        assertThat(pokedex[123]!!.sprite).isNotEqualTo(Pokedex.getPokemon(123).sprite)
    }

    @Test
    fun getPokemon_success() {
        val pokemon = controller.getPokemon(7).body!!
        assertThat(pokemon).isEqualTo(Pokedex.getPokemon(7))
    }

    @Test
    fun getPokemon_fail() {
        assertThat(assertThrows<NotFoundException> {
            controller.getPokemon(0)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<NotFoundException> {
            controller.getPokemon(-25)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
        assertThat(assertThrows<NotFoundException> {
            controller.getPokemon(10000000)
        }.message).isEqualTo(ErrorMessages.INVALID_POKEMON.message)
    }

    @Test
    fun getNatures() {
        val natures = controller.getNatures().body!!
        assertThat(natures.map { Natures.valueOfWithChecks(it) }).hasSameElementsAs(Natures.values().asList())
    }
}