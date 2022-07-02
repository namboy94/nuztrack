package net.namibsun.nuztrack.testbuilders.model.events

import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import net.namibsun.nuztrack.data.events.TeamMemberSwitchEvent
import net.namibsun.nuztrack.testbuilders.model.NuzlockeRunBuilder
import net.namibsun.nuztrack.testbuilders.model.TeamMemberBuilder
import net.namibsun.nuztrack.transfer.events.CreateTeamMemberSwitchEventTO
import net.namibsun.nuztrack.transfer.events.TeamMemberSwitchEventTO

data class TeamMemberSwitchEventBuilder(var nuzlockeRun: NuzlockeRun = NuzlockeRunBuilder().build(),
                                        var location: String = "Pallet Town",
                                        var teamMember: TeamMember = TeamMemberBuilder().build(),
                                        var switchType: TeamMemberSwitchType = TeamMemberSwitchType.ADD) {
    fun nuzlockeRun(nuzlockeRun: NuzlockeRun) = apply { this.nuzlockeRun = nuzlockeRun }
    fun location(location: String) = apply { this.location = location }
    fun teamMember(teamMember: TeamMember) = apply { this.teamMember = teamMember }
    fun switchType(switchType: TeamMemberSwitchType) = apply { this.switchType = switchType }
    fun build() = TeamMemberSwitchEvent(nuzlockeRun, location, teamMember, switchType)
    fun buildCreatorTO() = CreateTeamMemberSwitchEventTO(location, this.build().teamMember.id, switchType.name)
    fun buildTO() = TeamMemberSwitchEventTO.fromTeamMemberSwitchEvent(this.build())

    fun isAdd() = apply { this.switchType = TeamMemberSwitchType.ADD }
    fun isRemove() = apply { this.switchType = TeamMemberSwitchType.REMOVE }
}
