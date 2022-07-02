package net.namibsun.nuztrack.transfer.events

import net.namibsun.nuztrack.testbuilders.model.events.TeamMemberSwitchEventBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


internal class TeamMemberSwitchEventTOTest {
    @Test
    fun testConverting() {
        val event = TeamMemberSwitchEventBuilder().build()
        val converted = TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(event)
        assertThat(converted.event.id).isEqualTo(event.id)
        assertThat(converted.teamMemberId).isEqualTo(event.teamMember.id)
        assertThat(converted.switchType).isEqualTo(event.switchType.name)
    }
}