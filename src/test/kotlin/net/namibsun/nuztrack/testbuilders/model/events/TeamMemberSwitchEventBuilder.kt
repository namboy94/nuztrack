package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder

data class TeamMemberSwitchEventBuilder(
        var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
        var location: String = "Pallet Town",
        var teamMember: TeamMember = TeamMemberBuilder().build(),
        var switchType: TeamMemberSwitchType = TeamMemberSwitchType.ADD
) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun teamMember(teamMember: TeamMember) = apply { this.teamMember = teamMember }
    fun build() = TeamMemberSwitchEvent(nuzlockeRun, location, teamMember, switchType)
}
