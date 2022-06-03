package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.constants.Natures
import net.namibsun.nuztrack.constants.Pokedex
import net.namibsun.nuztrack.transfer.PokemonSpeciesTO
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController


@RestController
class PokedexController {

    @GetMapping("/api/pokedex")
    @ResponseBody
    fun getPokedex(): ResponseEntity<Map<Int, PokemonSpeciesTO>> {
        return ResponseEntity.ok(Pokedex.getPokedex())
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
