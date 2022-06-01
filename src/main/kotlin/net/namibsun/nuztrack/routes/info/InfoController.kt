package net.namibsun.nuztrack.routes.info

import net.namibsun.nuztrack.constants.GameLocationRegistry
import net.namibsun.nuztrack.constants.GameLocationTO
import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.PokemonSpeciesTO
import net.namibsun.nuztrack.util.Games
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
class InfoController {

    @GetMapping("/api/info/pokemon/{pokedexId}")
    @ResponseBody
    fun getPokemon(@PathVariable pokedexId: Int): ResponseEntity<PokemonSpeciesTO> {
        return ResponseEntity.ok(Pokedex.pokedex[pokedexId])
    }

    @GetMapping("/api/info/game/{gameTitle}")
    @ResponseBody
    fun getGame(@PathVariable gameTitle: String): ResponseEntity<List<GameLocationTO>> {
        return ResponseEntity.ok(GameLocationRegistry.gameLocations[Games.valueOf(gameTitle.uppercase())])
    }

}