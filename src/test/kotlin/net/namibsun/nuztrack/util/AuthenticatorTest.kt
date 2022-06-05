package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.NuzlockeRunService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

internal class AuthenticatorTest {

    private val runService: NuzlockeRunService = mock()
    private val authenticator = Authenticator(runService)

    @Test
    fun loadAuthenticatedRun_success() {
        whenever(runService.getRun(NUZLOCKE_RUN.id)).thenReturn(NUZLOCKE_RUN)

        val run = authenticator.loadAuthenticatedRun(NUZLOCKE_RUN.id, NUZLOCKE_RUN.userName)

        assertThat(run.game).isEqualTo(NUZLOCKE_RUN.game)
        verify(runService, times(1)).getRun(NUZLOCKE_RUN.id)
    }

    @Test
    fun loadAuthenticatedRun_unauthorized() {
        whenever(runService.getRun(NUZLOCKE_RUN.id)).thenReturn(NUZLOCKE_RUN)

        assertThat(assertThrows<UnauthorizedException> {
            authenticator.loadAuthenticatedRun(NUZLOCKE_RUN.id, "NotTheRealUser")
        }.message).isEqualTo(ErrorMessages.NO_ACCESS_TO_RUN.message)

        verify(runService, times(1)).getRun(NUZLOCKE_RUN.id)
    }

    @Test
    fun loadAuthenticatedRun_runDoesNotExist() {
        whenever(runService.getRun(NUZLOCKE_RUN.id)).thenReturn(null)

        assertThat(assertThrows<NotFoundException> {
            authenticator.loadAuthenticatedRun(NUZLOCKE_RUN.id, NUZLOCKE_RUN.userName)
        }.message).isEqualTo(ErrorMessages.RUN_NOT_FOUND.message)

        verify(runService, times(1)).getRun(NUZLOCKE_RUN.id)
    }

}