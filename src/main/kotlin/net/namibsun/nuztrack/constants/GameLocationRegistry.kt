package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.transfer.GameLocationTO
import net.namibsun.nuztrack.transfer.MilestoneTO
import org.springframework.core.io.ClassPathResource

object GameLocationRegistry {
    private val gameLocations: Map<Games, List<GameLocationTO>>

    init {
        val registryStream = ClassPathResource("data/locations.json").inputStream
        val rawGameLocations: Map<String, List<GameLocationTO>> = jacksonObjectMapper().readValue(registryStream)
        gameLocations = rawGameLocations.entries.associate { Games.valueOf(it.key.uppercase()) to it.value }
    }

    fun getLocationsForGame(game: Games): List<GameLocationTO> {
        return gameLocations[game] ?: throw NotFoundException(ErrorMessages.INVALID_GAME)
    }

    fun getMilestonesForGame(game: Games): List<MilestoneTO> {
        val locationsWithMilestones = getLocationsForGame(game).filter { it.milestones.isNotEmpty() }
        val milestones = mutableListOf<MilestoneTO>()
        locationsWithMilestones.forEach { location -> location.milestones.forEach { milestones.add(it) } }
        return milestones
    }
}
