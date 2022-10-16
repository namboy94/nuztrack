package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.testbuilders.transfer.PokemonSpeciesTOBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class PokemonSpeciesTOTest {
    @Test
    fun testGameSpecificSprite() {
        val species = PokemonSpeciesTOBuilder().build()
        val withGameSpecificSprite = species.withGameSpecificSprite(Games.FIRERED)
        assertThat(species.sprite).isNotEqualTo(withGameSpecificSprite.sprite)
    }
}
