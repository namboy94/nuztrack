package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.NuzlockeRunService
import java.security.Principal

class Authenticator(private val runService: NuzlockeRunService) {

    fun loadAuthenticatedRun(runId: Long, principal: Principal): NuzlockeRun {
        val run = this.runService.getRun(runId) ?: throw NotFoundException(ErrorMessages.RUN_NOT_FOUND)
        if (run.userName != principal.name) {
            throw UnauthorizedException(ErrorMessages.NO_ACCESS_TO_RUN)
        }
        return run
    }

}