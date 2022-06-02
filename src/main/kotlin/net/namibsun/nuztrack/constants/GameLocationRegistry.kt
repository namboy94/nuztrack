package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.routes.games.GameLocationTO
import org.springframework.core.io.ClassPathResource

object GameLocationRegistry {
    private val gameLocations: Map<Games, List<GameLocationTO>>

    init {
        val registryFile = ClassPathResource("data/locations.json").file
        val rawGameLocations: Map<String, List<GameLocationTO>> = jacksonObjectMapper().readValue(registryFile)
        gameLocations = rawGameLocations.entries.associate { Games.valueOf(it.key.uppercase()) to it.value }
    }

    fun getLocationsForGame(game: Games): List<GameLocationTO> {
        return gameLocations[game] ?: throw NotFoundException(ErrorMessages.INVALID_GAME)
    }
}
