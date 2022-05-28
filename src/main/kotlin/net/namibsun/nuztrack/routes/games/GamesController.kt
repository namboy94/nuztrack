package net.namibsun.nuztrack.routes.games

import net.namibsun.nuztrack.util.Games
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GamesController {

    @GetMapping("/games")
    @ResponseBody
    fun getGames(): ResponseEntity<GamesListTO> {
        val gamesList = GamesListTO(Games.values().map { it.title })
        return ResponseEntity.ok(gamesList)
    }
}