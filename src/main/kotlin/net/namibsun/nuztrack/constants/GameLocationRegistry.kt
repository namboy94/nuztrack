package net.namibsun.nuztrack.constants

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import net.namibsun.nuztrack.util.Games
import org.springframework.core.io.ClassPathResource

object GameLocationRegistry {
    val gameLocations: Map<Games, List<GameLocationTO>>

    init {
        val registryFile = ClassPathResource("data/locations.json").file
        val rawGameLocations: Map<String, List<GameLocationTO>> = jacksonObjectMapper().readValue(registryFile)
        gameLocations = rawGameLocations.entries.associate { Games.valueOf(it.key) to it.value }
    }
}
