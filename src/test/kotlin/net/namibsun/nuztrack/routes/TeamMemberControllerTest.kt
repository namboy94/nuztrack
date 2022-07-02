package net.namibsun.nuztrack.routes

import net.namibsun.nuztrack.data.NuzlockeRunService
import net.namibsun.nuztrack.data.TeamMemberService
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.transfer.TeamMemberTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.http.HttpStatus
import java.security.Principal

internal class TeamMemberControllerTest {

    private val principal: Principal = mock()
    private val runsService: NuzlockeRunService = mock()
    private val service: TeamMemberService = mock()
    private val controller = TeamMemberController(service, runsService)

    private val run = NuzlockeRunBuilder().build()
    private val memberOne = TeamMemberBuilder().id(1).isActive().build()
    private val memberTwo = TeamMemberBuilder().id(2).isBulbasaur().build()
    private val memberThree = TeamMemberBuilder().id(3).isCharizard().isDead().build()
    private val team = Triple(listOf(memberOne), listOf(memberTwo), listOf(memberThree))

    @Test
    fun getTeam() {
        whenever(service.getTeam(run.id)).thenReturn(team)
        whenever(runsService.getRun(run.id)).thenReturn(run)
        whenever(principal.name).thenReturn(run.userName)

        val result = controller.getTeam(run.id, principal)

        assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(result.body!!.active[0]).isEqualTo(TeamMemberTO.fromTeamMember(memberOne))
        assertThat(result.body!!.boxed[0]).isEqualTo(TeamMemberTO.fromTeamMember(memberTwo))
        assertThat(result.body!!.dead[0]).isEqualTo(TeamMemberTO.fromTeamMember(memberThree))

        verify(principal, times(1)).name
        verify(service, times(1)).getTeam(run.id)
        verify(runsService, times(1)).getRun(run.id)
    }
}