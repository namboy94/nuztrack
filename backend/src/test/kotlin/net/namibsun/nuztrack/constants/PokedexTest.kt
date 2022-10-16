package net.namibsun.nuztrack.constants

import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Gender
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.testbuilders.transfer.PokemonSpeciesTOBuilder
import net.namibsun.nuztrack.transfer.PokedexTO
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
    fun getPokedex_gameSpecific() {
        val pokedex = Pokedex.getPokedex(Games.RED)
        assertThat(pokedex[7]!!.sprite).isNotEqualTo(Pokedex.getPokedex()[7]!!.sprite)
        assertThat(pokedex[7]!!.sprite).contains("pokemondb.net")
        assertThat(pokedex).containsKey(151)
        assertThat(pokedex).doesNotContainKey(152)
    }

    @Test
    fun getPokedex_limits() {
        assertThat(Pokedex.getPokedex(Games.SWORD).size).isEqualTo(Pokedex.getPokedex().size)
        assertThat(Pokedex.getPokedex(Games.ULTRA_SUN).size).isEqualTo(809)
        assertThat(Pokedex.getPokedex(Games.X).size).isEqualTo(721)
        assertThat(Pokedex.getPokedex(Games.BLACK).size).isEqualTo(649)
        assertThat(Pokedex.getPokedex(Games.PEARL).size).isEqualTo(493)
        assertThat(Pokedex.getPokedex(Games.EMERALD).size).isEqualTo(386)
        assertThat(Pokedex.getPokedex(Games.SILVER).size).isEqualTo(251)
        assertThat(Pokedex.getPokedex(Games.RED).size).isEqualTo(151)
    }

    @Test
    fun getPokemon_success() {
        assertThat(Pokedex.getPokemon(7)).isEqualTo(PokemonSpeciesTOBuilder().build())
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

    @Test
    fun getEvolutionChain_Squirtle() {
        assertThat(Pokedex.getEvolutionChain(7)).hasSameElementsAs(listOf(7, 8, 9))
    }

    @Test
    fun getEvolutionChain_Blastoise() {
        assertThat(Pokedex.getEvolutionChain(9)).hasSameElementsAs(listOf(7, 8, 9))
    }

    @Test
    fun getEvolutionChain_Eevee() {
        val eeveelutions = listOf(133, 134, 135, 136, 196, 197, 470, 471, 700)
        assertThat(Pokedex.getEvolutionChain(133)).hasSameElementsAs(eeveelutions)
    }

    @Test
    fun getEvolutionChain_Hitmonchan() {
        assertThat(Pokedex.getEvolutionChain(107)).hasSameElementsAs(listOf(106, 107, 236, 237))
    }

    @Test
    fun getBaseSpeciesForGame_BabyPokemonPikachu() {
        assertThat(Pokedex.getBaseSpeciesForGame(25, Games.RED)).isEqualTo(25)
        assertThat(Pokedex.getBaseSpeciesForGame(25, Games.SILVER)).isEqualTo(172)
    }

    @Test
    fun getBaseSpeciesForGame_BabyPokemonRaichu() {
        assertThat(Pokedex.getBaseSpeciesForGame(26, Games.RED)).isEqualTo(25)
        assertThat(Pokedex.getBaseSpeciesForGame(26, Games.SILVER)).isEqualTo(172)
    }

    @Test
    fun getBaseSpeciesForGame_Hitmons() {
        assertThat(Pokedex.getBaseSpeciesForGame(106, Games.RED)).isEqualTo(106)
        assertThat(Pokedex.getBaseSpeciesForGame(107, Games.RED)).isEqualTo(107)
        assertThat(Pokedex.getBaseSpeciesForGame(106, Games.SILVER)).isEqualTo(236)
        assertThat(Pokedex.getBaseSpeciesForGame(107, Games.SILVER)).isEqualTo(236)
    }

    @Test
    fun generateGender_oldGame() {
        assertThat(Pokedex.generateGender(1, Games.RED)).isNull()
    }

    @Test
    fun generateGender_neutral() {
        assertThat(Pokedex.generateGender(150, Games.SILVER)).isEqualTo(Gender.NEUTRAL)
    }

    @Test
    fun generateGender_majorityMale() {
        assertThat(Pokedex.generateGender(1, Games.SILVER)).isEqualTo(Gender.MALE)
    }

    @Test
    fun generateGender_majorityFemale() {
        assertThat(Pokedex.generateGender(300, Games.RUBY)).isEqualTo(Gender.FEMALE)
    }

    @Test
    fun generateGender_EqualRatio() {
        assertThat(Pokedex.generateGender(10, Games.SILVER)).isIn(listOf(Gender.MALE, Gender.FEMALE))
    }

    @Test
    fun generateAbilitySlot() {
        assertThat(Pokedex.generateAbilitySlot(1, Games.X)).isIn(listOf(1, 3))
    }

    @Test
    fun generateAbilitySlot_oldGame() {
        assertThat(Pokedex.generateAbilitySlot(1, Games.RED)).isNull()
    }

    @Test
    fun generateAbilitySlot_hiddenAbilityPossible() {
        // 1/(2^100) probability of failing
        assertThat((1..100).map { Pokedex.generateAbilitySlot(1, Games.BLACK) }).contains(3)
    }

    @Test
    fun generateAbilitySlot_hiddenAbilityImpossible() {
        assertThat((1..100).map { Pokedex.generateAbilitySlot(1, Games.DIAMOND) }).doesNotContain(3)
    }

    @Test
    fun generateNature_oldGame() {
        assertThat(Pokedex.generateNature(Games.RED)).isNull()
    }

    @Test
    fun generateNature() {
        assertThat(Pokedex.generateNature(Games.RUBY)).isIn(Natures.values().map { it })
    }
}