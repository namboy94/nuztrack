package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.ErrorMessages
import net.namibsun.nuztrack.constants.Natures
import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.Pokedex
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class PokedexControllerTest {

    private val controller = PokedexController()

    @Test
    fun getPokedex() {
        val pokedex = controller.getPokedex().body!!
        assertThat(pokedex[123]).isEqualTo(Pokedex.getPokemon(123))
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