package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.Games
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class GameTOTest {

    @Test
    fun testConvertingGameEnumToTO() {
        val converted = GameTO.fromGame(Games.ALPHA_SAPPHIRE)
        assertThat(converted.title).isEqualTo(Games.ALPHA_SAPPHIRE.title)
        assertThat(converted.key).isEqualTo(Games.ALPHA_SAPPHIRE.name)
        assertThat(converted.generation).isEqualTo(Games.ALPHA_SAPPHIRE.generation)
    }

}