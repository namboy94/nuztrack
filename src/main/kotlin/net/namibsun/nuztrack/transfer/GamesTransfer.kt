package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.enums.Games

data class GameTO(
    val title: String,
    val key: String,
    val generation: Int
) {
    companion object {
        fun fromGame(game: Games): GameTO {
            return GameTO(game.title, game.name, game.generation)
        }
    }
}

data class GameLocationFileTO(
    val name: String,
    val gameKey: String,
    val encounters: List<Int>,
    val milestones: List<MilestoneTO>
)

data class GameLocationTO(
    val name: String,
    val game: GameTO,
    val encounters: List<Int>,
    val milestones: List<MilestoneTO>
) {
    companion object {
        fun fromGameLocationFileTO(fileTO: GameLocationFileTO): GameLocationTO {
            return GameLocationTO(
                fileTO.name,
                GameTO.fromGame(Games.valueOfWithChecks(fileTO.gameKey)),
                fileTO.encounters,
                fileTO.milestones
            )
        }
    }
}

data class MilestoneTO(
    val name: String,
    val image: String,
    val level_cap: Int,
    val location: String
)
