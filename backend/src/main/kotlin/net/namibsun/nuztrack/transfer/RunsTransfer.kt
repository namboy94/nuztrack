package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.Rules
import net.namibsun.nuztrack.data.NuzlockeRun

data class NuzlockeRunTO(
    val id: Long,
    val userName: String,
    val name: String,
    val game: GameTO,
    val rules: List<String>,
    val customRules: List<String>,
    val status: String
) {
    companion object {
        fun fromNuzlockeRun(run: NuzlockeRun): NuzlockeRunTO {
            return NuzlockeRunTO(
                id = run.id,
                userName = run.userName,
                name = run.name,
                game = GameTO.fromGame(run.game),
                rules = run.rules.map { it.name.uppercase() },
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
) {
    fun validate() {
        if (name == "") {
            throw ValidationException(ErrorMessages.EMPTY_NAME)
        }
        Games.valueOfWithChecks(game)
        rules.map { Rules.valueOfWithChecks(it) }
    }
}
