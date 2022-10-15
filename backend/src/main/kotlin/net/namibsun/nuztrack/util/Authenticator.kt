package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService

class Authenticator(private val runService: NuzlockeRunService) {

    fun loadAuthenticatedRun(runId: Long, userName: String): NuzlockeRun {
        val run = this.runService.getRun(runId) ?: throw NotFoundException(ErrorMessages.RUN_NOT_FOUND)
        if (run.userName != userName) {
            throw UnauthorizedException(ErrorMessages.NO_ACCESS_TO_RUN)
        }
        return run
    }

}