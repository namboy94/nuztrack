package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.AdditionalAnswers
import org.mockito.kotlin.*

class TeamMemberSwitchEventServiceTest {
    private val repository: EventRepository = mock()
    private val service = TeamMemberSwitchEventService(repository)

    private val events = listOf<Event>(
            TeamMemberSwitchEvent(NUZLOCKE_RUN, "Pallet Town", TEAM_MEMBER, TeamMemberSwitchType.ADD),
            TeamMemberSwitchEvent(NUZLOCKE_RUN, "Pokemon League", TEAM_MEMBER, TeamMemberSwitchType.REMOVE)
    )

    @Test
    fun getAllEvents() {
        whenever(repository.findAllByEventType(EventType.TEAM_MEMBER_SWITCH)).thenReturn(events)
        assertThat(service.getAllTeamMemberSwitchEvents()).isEqualTo(events)
        verify(repository, times(1)).findAllByEventType(EventType.TEAM_MEMBER_SWITCH)
    }

    @Test
    fun createTeamMemberSwitchEvent() {
        whenever(repository.save(any<TeamMemberSwitchEvent>()))
                .then(AdditionalAnswers.returnsFirstArg<TeamMemberSwitchEvent>())

        val teamSwitch = service.createTeamMemberSwitchEvent(
                NUZLOCKE_RUN, "Pallet Town", TEAM_MEMBER, TeamMemberSwitchType.ADD
        )

        assertThat(teamSwitch.teamMember).isEqualTo(TEAM_MEMBER)
        assertThat(teamSwitch.switchType).isEqualTo(TeamMemberSwitchType.ADD)
        verify(repository, times(1)).save(any<TeamMemberSwitchEvent>())
    }
}
