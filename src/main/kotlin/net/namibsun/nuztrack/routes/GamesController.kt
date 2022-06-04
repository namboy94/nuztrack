package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.GameLocationRegistry
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.transfer.GameLocationTO
import net.namibsun.nuztrack.transfer.GamesListTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GamesController {

    @GetMapping("/api/games")
    @ResponseBody
    fun getGames(): ResponseEntity<GamesListTO> {
        val gamesList = Games.values().associate { it.name.uppercase() to it.title }
        return ResponseEntity.ok(gamesList)
    }

    @GetMapping("/api/games/{gameTitle}/locations")
    @ResponseBody
    fun getLocations(@PathVariable gameTitle: String): ResponseEntity<List<GameLocationTO>> {
        val game = Games.valueOfWithChecks(gameTitle)
        return ResponseEntity.ok(GameLocationRegistry.getLocationsForGame(game))
    }
}