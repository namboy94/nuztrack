package net.namibsun.nuztrack.testconstants.transfer

import net.namibsun.nuztrack.transfer.PokemonSpeciesTO
import net.namibsun.nuztrack.transfer.PokemonTypesTO

data class PokemonSpeciesTOBuilder(
        var pokedexNumber: Int = 7,
        var name: String = "Squirtle",
        var sprite: String = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        var types: PokemonTypesTO = PokemonTypesTO("WATER", null),
        var abilities: Map<Int, String?> = mapOf(1 to "Torrent", 2 to null, 3 to "Rain Dish"),
        var baseSpecies: Int = 7,
        var evolutions: List<Int> = listOf(8),
        var genderRate: Int = 1,
        var isLegendary: Boolean = false,
        var generation: Int = 1
) {

    fun pokedexNumber(pokedexNumber: Int) = apply { this.pokedexNumber = pokedexNumber }
    fun name(name: String) = apply { this.name = name }
    fun sprite(sprite: String) = apply { this.sprite = sprite }
    fun types(types: PokemonTypesTO) = apply { this.types = types }
    fun abilities(abilities: Map<Int, String?>) = apply { this.abilities = abilities }
    fun baseSpecies(baseSpecies: Int) = apply { this.baseSpecies = baseSpecies }
    fun evolutions(evolutions: List<Int>) = apply { this.evolutions = evolutions }
    fun genderRate(genderRate: Int) = apply { this.genderRate }
    fun isLegendary(isLegendary: Boolean) = apply { this.isLegendary = isLegendary }
    fun generation(generation: Int) = apply { this.generation = generation }

    fun build() = PokemonSpeciesTO(
            pokedexNumber, name, sprite, types, abilities, baseSpecies, evolutions, genderRate, isLegendary, generation
    )
}
