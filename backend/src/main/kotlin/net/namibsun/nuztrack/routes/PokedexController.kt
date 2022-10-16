package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Natures
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
class PokedexController {

    @GetMapping("/api/pokedex")
    @ResponseBody
    fun getPokedex(@RequestParam("game") game: String?): ResponseEntity<Map<Int, PokemonSpeciesTO>> {
        val pokedex = if (game == null) {
            Pokedex.getPokedex()
        } else {
            Pokedex.getPokedex(Games.valueOfWithChecks(game))
        }
        return ResponseEntity.ok(pokedex)
    }

    @GetMapping("/api/pokedex/{pokedexId}")
    @ResponseBody
    fun getPokemon(@PathVariable pokedexId: Int): ResponseEntity<PokemonSpeciesTO> {
        return ResponseEntity.ok(Pokedex.getPokemon(pokedexId))
    }

    @GetMapping("/api/pokedex/natures")
    @ResponseBody
    fun getNatures(): ResponseEntity<List<String>> {
        return ResponseEntity.ok(Natures.values().map { it.name })
    }

}
