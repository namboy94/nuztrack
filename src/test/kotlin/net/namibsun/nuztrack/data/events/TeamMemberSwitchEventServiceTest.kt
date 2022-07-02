package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*

class TeamMemberSwitchEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = TeamMemberSwitchEventService(repository)

    @Test
    fun createTeamMemberSwitchEvent() {
        whenever(repository.save(any<TeamMemberSwitchEvent>())).thenAnswer { it.getArgument(0) }

        val run = NuzlockeRunBuilder().build()
        val member = TeamMemberBuilder().build()

        val teamSwitch = service.createTeamMemberSwitchEvent(run, "Pallet Town", member, TeamMemberSwitchType.ADD)

        assertThat(teamSwitch.teamMember).isEqualTo(member)
        assertThat(teamSwitch.switchType).isEqualTo(TeamMemberSwitchType.ADD)
        verify(repository, times(1)).save(any<TeamMemberSwitchEvent>())
    }
}
