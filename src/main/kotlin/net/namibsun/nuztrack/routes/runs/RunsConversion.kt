package net.namibsun.nuztrack.routes.runs

import net.namibsun.nuztrack.data.NuzlockeRun

fun convertNuzlockeRunToNuzlockeRunTO(run: NuzlockeRun): NuzlockeRunTO {
    return NuzlockeRunTO(
            id = run.id!!,
            userName = run.userName,
            name = run.name,
            game = run.game.title,
            rules = run.rules.map { it.key }
    )
}
