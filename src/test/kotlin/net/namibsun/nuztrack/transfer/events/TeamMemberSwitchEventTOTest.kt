package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NUZLOCKE_RUN
import net.namibsun.nuztrack.data.TEAM_MEMBER
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class TeamMemberSwitchEventTOTest {
    @Test
    fun testConverting() {
        val event = TeamMemberSwitchEvent(NUZLOCKE_RUN, "A", TEAM_MEMBER, TeamMemberSwitchType.ADD)
        val converted = TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.teamMemberId).isEqualTo(event.teamMember.id)
        assertThat(converted.switchType).isEqualTo(event.switchType.name)
    }
}