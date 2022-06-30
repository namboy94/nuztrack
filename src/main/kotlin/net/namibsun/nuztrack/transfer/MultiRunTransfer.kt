package net.namibsun.nuztrack.transfer

import net.namibsun.nuztrack.constants.ValidationException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.MultiRunOptions
import net.namibsun.nuztrack.data.NuzlockeRun

data class CreateMultiRunTO(
        val runId: Long,
        val options: List<String>,
        val game: String,
        val name: String
) {
    fun validate(run: NuzlockeRun) {
        if (name.isEmpty()) {
            throw ValidationException(ErrorMessages.EMPTY_NAME)
        }

        if (Games.valueOfWithChecks(game).generation < run.game.generation) {
            throw ValidationException(ErrorMessages.MULTI_RUN_BACKWARDS)
        }

        options.map { MultiRunOptions.valueOfWithChecks(it) }
    }
}

data class MultiRunOptionTO(val key: String, val description: String) {
    companion object {
        fun fromOption(option: MultiRunOptions): MultiRunOptionTO {
            return MultiRunOptionTO(option.name, option.description)
        }
    }
}
