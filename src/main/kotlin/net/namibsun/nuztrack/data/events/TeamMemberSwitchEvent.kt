package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.constants.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "team_add")
class TeamMemberSwitchEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,

        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "team_member_id", nullable = false)
        val teamMember: TeamMember,

        @Column val switchType: TeamMemberSwitchType

) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.PARTY_MEMBER_SWITCH)

class TeamMemberSwitchEventService(val db: EventRepository) {
    fun getAllTeamMemberSwitchEvents(): List<TeamMemberSwitchEvent> {
        return db.findAllByEventType(EventType.PARTY_MEMBER_SWITCH).map { it as TeamMemberSwitchEvent }
    }

    fun createTeamMemberSwitchEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            teamMember: TeamMember,
            switchType: TeamMemberSwitchType
    ): TeamMemberSwitchEvent {
        return db.save(TeamMemberSwitchEvent(nuzlockeRun, location, teamMember, switchType))
    }
}
