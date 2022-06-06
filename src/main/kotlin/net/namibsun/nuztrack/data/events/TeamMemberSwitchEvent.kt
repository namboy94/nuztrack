package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.constants.enums.TeamMemberSwitchType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import org.springframework.stereotype.Service
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

) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.TEAM_MEMBER_SWITCH)

@Service
class TeamMemberSwitchEventService(val db: EventRepository) {
    fun createTeamMemberSwitchEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            teamMember: TeamMember,
            switchType: TeamMemberSwitchType
    ): TeamMemberSwitchEvent {
        return db.save(TeamMemberSwitchEvent(nuzlockeRun, location, teamMember, switchType))
    }
}
