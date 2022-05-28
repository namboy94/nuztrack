package net.namibsun.nuztrack.routes.runs

data class NuzlockeRunTO(
        val id: Long,
        val userName: String,
        val name: String,
        val game: String,
        val rules: List<String>
)

data class CreateNuzlockeRunTO(
        val name: String,
        val game: String,
        val rules: List<String>
)
