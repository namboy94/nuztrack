package net.namibsun.nuztrack.testbuilders

import TeamMemberBuilder
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent

data class TeamMemberSwitchEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var teamMember: TeamMember = TeamMemberBuilder().build(),
        var switchType: TeamMemberSwitchType = TeamMemberSwitchType.ADD
) {
    fun teamMember(teamMember: TeamMember) = apply { this.teamMember = teamMember }
    fun build() = TeamMemberSwitchEvent(nuzlockeRun, location, teamMember, switchType)
}
