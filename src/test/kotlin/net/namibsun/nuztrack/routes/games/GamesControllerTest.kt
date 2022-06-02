package net.namibsun.nuztrack.routes.games

import net.namibsun.nuztrack.constants.Games
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class GamesControllerTest {

    private val controller = GamesController()

    @Test
    fun getGames() {
        val result = controller.getGames()
        assertThat(result.body).isEqualTo(Games.values().associate { it.name.uppercase() to it.title })
    }
}
