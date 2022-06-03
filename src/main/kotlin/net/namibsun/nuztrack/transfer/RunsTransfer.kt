package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.data.NuzlockeRun

data class NuzlockeRunTO(
        val id: Long,
        val userName: String,
        val name: String,
        val game: String,
        val rules: List<String>,
        val customRules: List<String>,
        val status: String
) {
    companion object {
        fun fromNuzlockeRun(run: NuzlockeRun): NuzlockeRunTO {
            return NuzlockeRunTO(
                    id = run.id!!,
                    userName = run.userName,
                    name = run.name,
                    game = run.game.title,
                    rules = run.rules.map { it.name.lowercase() },
                    customRules = run.customRules,
                    status = run.status.name
            )
        }
    }
}

data class CreateNuzlockeRunTO(
        val name: String,
        val game: String,
        val rules: List<String>,
        val customRules: List<String>
)
