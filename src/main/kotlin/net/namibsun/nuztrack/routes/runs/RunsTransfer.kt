package net.namibsun.nuztrack.routes.runs

data class NuzlockeRunTO(
        val id: Long,
        val userName: String,
        val name: String,
        val game: String,
        val rules: List<String>,
        val customRules: List<String>,
        val status: String
)

data class CreateNuzlockeRunTO(
        val name: String,
        val game: String,
        val rules: List<String>,
        val customRules: List<String>
)
