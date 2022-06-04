package net.namibsun.nuztrack.data.events

import net.namibsun.nuztrack.constants.enums.EventType
import net.namibsun.nuztrack.data.NuzlockeRun
import net.namibsun.nuztrack.data.TeamMember
import org.springframework.stereotype.Service
import javax.persistence.*

@Suppress("JpaDataSourceORMInspection")
@Entity
@Table(name = "death")
class DeathEvent(
        nuzlockeRun: NuzlockeRun,
        location: String,
        @OneToOne(cascade = [CascadeType.ALL]) @JoinColumn(name = "death_id") val teamMember: TeamMember,
        @Column val level: Int,
        @Column val opponent: String,
        @Column val description: String
) : Event(nuzlockeRun = nuzlockeRun, location = location, eventType = EventType.DEATH)

@Service
class DeathEventService(val db: EventRepository) {
    fun getAllDeathEvents(): List<DeathEvent> {
        return db.findAllByEventType(EventType.DEATH).map { it as DeathEvent }
    }

    fun createDeathEvent(
            nuzlockeRun: NuzlockeRun,
            location: String,
            teamMember: TeamMember,
            level: Int,
            opponent: String,
            description: String
    ): DeathEvent {
        return db.save(DeathEvent(nuzlockeRun, location, teamMember, level, opponent, description))
    }
}
