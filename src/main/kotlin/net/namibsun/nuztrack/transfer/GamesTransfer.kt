package net.namibsun.nuztrack.transfer

typealias GamesListTO = Map<String, String>

data class GameLocationTO(
        val name: String,
        val gameKey: String,
        val encounters: List<Int>,
        val milestones: List<MilestoneTO>
)

data class MilestoneTO(
        val name: String,
        val image: String,
        val level_cap: Int,
        val location: String
)
