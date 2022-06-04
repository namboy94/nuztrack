package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "team_removal")
class TeamRemoveEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "team_member_id", nullable = false)
        val teamMember: TeamMember
) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.TEAM_ADD)

class TeamRemoveEventService(val db: EventRepository) {
    fun getAllTeamRemoveEvents(): List<TeamRemoveEvent> {
        return db.findAllByEventType(EventType.TEAM_ADD).map { it as TeamRemoveEvent }
    }

    fun createTeamRemoveEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            teamMember: TeamMember
    ): TeamRemoveEvent {
        return db.save(TeamRemoveEvent(nuzlockeRun, location, teamMember))
    }
}
