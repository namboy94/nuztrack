package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.GameLocationRegistry
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.transfer.GameLocationTO
import net.namibsun.nuztrack.transfer.GameTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GamesController {

    @GetMapping("/api/games")
    @ResponseBody
    fun getGames(): ResponseEntity<List<GameTO>> {
        val gamesList = Games.values().map { GameTO.fromGame(it) }
        return ResponseEntity.ok(gamesList)
    }

    @GetMapping("/api/games/{gameTitle}/locations")
    @ResponseBody
    fun getLocations(@PathVariable gameTitle: String): ResponseEntity<List<GameLocationTO>> {
        val game = Games.valueOfWithChecks(gameTitle)
        val locations = GameLocationRegistry.getLocationsForGame(game)
        return ResponseEntity.ok(locations.map { GameLocationTO.fromGameLocationFileTO(it) })
    }
}