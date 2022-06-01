package net.namibsun.nuztrack.constants

data class GameLocationTO(
        val name: String,
        val encounters: List<Int>,
        val milestones: List<MilestoneTO>
)

data class MilestoneTO(val name: String, val image: String, val level_cap: Int)