package net.namibsun.nuztrack.testbuilders.transfer

import net.namibsun.nuztrack.constants.enums.Games
import net.namibsun.nuztrack.constants.enums.MultiRunOptions
import net.namibsun.nuztrack.transfer.CreateMultiRunTO

// TODO Make a model builder instead
data class CreateMultiRunTOBuilder(
        var runId: Long = 1, var options: List<String> = MultiRunOptions.values().map { it.name },
        var game: String = Games.LEAFGREEN.name, var name: String = "My next journey"
) {
    fun runId(runId: Long) = apply { this.runId = runId }
    fun options(options: List<String>) = apply { this.options = options }
    fun game(game: String) = apply { this.game = game }
    fun name(name: String) = apply { this.name = name }
    fun build() = CreateMultiRunTO(runId, options, game, name)
}