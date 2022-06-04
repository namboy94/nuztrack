package net.namibsun.nuztrack.data

import net.namibsun.nuztrack.constants.Games
import net.namibsun.nuztrack.constants.RunStatus

val NUZLOCKE_RUN = NuzlockeRun(
        userName = "Ash",
        name = "First",
        game = Games.RED,
        rules = listOf(),
        customRules = listOf(),
        status = RunStatus.COMPLETED
)