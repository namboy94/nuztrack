package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "team_add")
class TeamAddEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "team_member_id", nullable = false)
        val teamMember: TeamMember
) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.TEAM_ADD)

class TeamAddEventService(val db: EventRepository) {
    fun getAllTeamAddEvents(): List<TeamAddEvent> {
        return db.findAllByEventType(EventType.TEAM_ADD).map { it as TeamAddEvent }
    }

    fun createTeamAddEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            teamMember: TeamMember
    ): TeamAddEvent {
        return db.save(TeamAddEvent(nuzlockeRun, location, teamMember))
    }
}
