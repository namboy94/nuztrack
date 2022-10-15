package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.transfer.GameTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class GamesControllerTest {

    private val controller = GamesController()

    @Test
    fun getGames() {
        val result = controller.getGames()
        assertThat(result.body).isEqualTo(Games.values().map { GameTO.fromGame(it) })
    }

    @Test
    fun getLocations_success() {
        val locations = controller.getLocations(Games.HEARTGOLD.name).body!!
        assertThat(locations[0].name).isEqualTo("New Bark Town")
    }

    @Test
    fun getLocations_invalid_game() {
        assertThat(assertThrows<ValidationException> {
            controller.getLocations("DoesNotExist")
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
        assertThat(assertThrows<ValidationException> {
            controller.getLocations("")
        }.message).isEqualTo(ErrorMessages.INVALID_GAME.message)
    }
}
