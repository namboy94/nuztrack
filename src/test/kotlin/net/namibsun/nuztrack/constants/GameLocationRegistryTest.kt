package net.namibsun.nuztrack.constants

import net.namibsun.nuztrack.constants.enums.Games
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class GameLocationRegistryTest {

    @Test
    fun getLocationsForGame() {
        val locations = GameLocationRegistry.getLocationsForGame(Games.RED)
        assertThat(locations[0].name).isEqualTo("Pallet Town")
        assertThat(locations[1].encounters).hasSameElementsAs(listOf(16, 19))
        assertThat(locations[2].milestones[0].name).isEqualTo("Earth Badge")
    }
}
