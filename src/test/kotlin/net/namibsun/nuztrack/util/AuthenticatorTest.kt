package net.namibsun.nuztrack.util

import net.namibsun.nuztrack.constants.NotFoundException
import net.namibsun.nuztrack.constants.UnauthorizedException
import net.namibsun.nuztrack.constants.enums.ErrorMessages
import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
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
    private val run = NuzlockeRunBuilder().build()


    @Test
    fun loadAuthenticatedRun_success() {
        whenever(runService.getRun(run.id)).thenReturn(run)

        val run = authenticator.loadAuthenticatedRun(run.id, run.userName)

        assertThat(run.game).isEqualTo(run.game)
        verify(runService, times(1)).getRun(run.id)
    }

    @Test
    fun loadAuthenticatedRun_unauthorized() {
        whenever(runService.getRun(run.id)).thenReturn(run)

        assertThat(assertThrows<UnauthorizedException> {
            authenticator.loadAuthenticatedRun(run.id, "NotTheRealUser")
        }.message).isEqualTo(ErrorMessages.NO_ACCESS_TO_RUN.message)

        verify(runService, times(1)).getRun(run.id)
    }

    @Test
    fun loadAuthenticatedRun_runDoesNotExist() {
        whenever(runService.getRun(run.id)).thenReturn(null)

        assertThat(assertThrows<NotFoundException> {
            authenticator.loadAuthenticatedRun(run.id, run.userName)
        }.message).isEqualTo(ErrorMessages.RUN_NOT_FOUND.message)

        verify(runService, times(1)).getRun(run.id)
    }

}