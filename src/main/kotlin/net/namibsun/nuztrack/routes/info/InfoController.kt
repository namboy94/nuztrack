package net.namibsun.nuztrack.routes.info

import net.namibsun.nuztrack.constants.external.GameLocationRegistry
import net.namibsun.nuztrack.constants.external.GameLocationTO
import net.namibsun.nuztrack.constants.external.Pokedex
import net.namibsun.nuztrack.constants.external.PokemonSpeciesTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
class InfoController {

    @GetMapping("/api/info/pokedex")
    @ResponseBody
    fun getPokedex(): ResponseEntity<Map<Int, PokemonSpeciesTO>> {
        return ResponseEntity.ok(Pokedex.pokedex)
    }

    @GetMapping("/api/info/pokedex/{pokedexId}")
    @ResponseBody
    fun getPokemon(@PathVariable pokedexId: Int): ResponseEntity<PokemonSpeciesTO> {
        return ResponseEntity.ok(Pokedex.getPokemon(pokedexId))
    }

    @GetMapping("/api/info/locations/{gameTitle}")
    @ResponseBody
    fun getGame(@PathVariable gameTitle: String): ResponseEntity<List<GameLocationTO>> {
        return ResponseEntity.ok(GameLocationRegistry.getLocationsForGameTitle(gameTitle))
    }
}
