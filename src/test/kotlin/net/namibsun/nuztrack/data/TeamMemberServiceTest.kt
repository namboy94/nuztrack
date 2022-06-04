package net.namibsun.nuztrack.data

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

internal class TeamMemberServiceTest {

    private val repository: TeamMemberRepository = mock()
    private val service = TeamMemberService(repository)

    @Test
    fun getAllForNuzlockeRun() {
        whenever(repository.findAllByNuzlockeRunId(NUZLOCKE_RUN.id)).thenReturn(listOf(TEAM_MEMBER))

        val results = service.getAllForNuzlockeRun(NUZLOCKE_RUN)

        assertThat(results).isEqualTo(listOf(TEAM_MEMBER))
        verify(repository, times(1)).findAllByNuzlockeRunId(NUZLOCKE_RUN.id)
    }
}