package net.namibsun.nuztrack.constants.external

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.constants.ErrorMessages
import net.namibsun.nuztrack.constants.Games
import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.getValueOfGameTitle
import org.springframework.core.io.ClassPathResource

object GameLocationRegistry {
    val gameLocations: Map<Games, List<GameLocationTO>>

    init {
        val registryFile = ClassPathResource("data/locations.json").file
        val rawGameLocations: Map<String, List<GameLocationTO>> = jacksonObjectMapper().readValue(registryFile)
        gameLocations = rawGameLocations.entries.associate { Games.valueOf(it.key.uppercase()) to it.value }
    }

    fun getLocationsForGameTitle(gameString: String): List<GameLocationTO> {
        val game = getValueOfGameTitle(gameString)
        return gameLocations[game] ?: throw NotFoundException(ErrorMessages.INVALID_GAME)
    }
}
