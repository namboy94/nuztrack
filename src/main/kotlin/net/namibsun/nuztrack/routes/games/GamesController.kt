package net.namibsun.nuztrack.routes.games

import net.namibsun.nuztrack.constants.Games
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GamesController {

    @GetMapping("/games")
    @ResponseBody
    fun getGames(): ResponseEntity<Map<String, String>> {
        val gamesList = Games.values().associate { it.name.lowercase() to it.title }
        return ResponseEntity.ok(gamesList)
    }
}