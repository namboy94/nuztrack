package net.namibsun.nuztrack.routes.runs

import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.util.getValueOfGameTitle

fun convertNuzlockeRunToNuzlockeRunTO(run: NuzlockeRun): NuzlockeRunTO {
    return NuzlockeRunTO(
            id = run.id!!,
            userName = run.userName,
            name = run.name,
            game = run.game.title,
            rules = run.rules
    )
}

fun convertCreateNuzlockeRunTOToNuzlockeRun(createRun: CreateNuzlockeRunTO, username: String): NuzlockeRun {
    return NuzlockeRun(
            userName = username,
            name = createRun.name,
            game = getValueOfGameTitle(createRun.game),
            rules = createRun.rules
    )
}